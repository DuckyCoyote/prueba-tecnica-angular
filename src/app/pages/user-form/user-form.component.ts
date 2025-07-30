import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { CpInfoService } from '../../services/cp-info.service';
import { CommonModule } from '@angular/common';
import { CpInfo } from '../../models/CpInfo.model';
import { ModalService } from '../../services/modal.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  imports: [FormsModule, CommonModule],
  standalone: true
})


export class UserFormComponent implements OnInit, OnDestroy {
  isEditing = false;
  user: User = { name: '', lastName: '', email: '', address: '' };
  calle: string = '';
  cp: string = '';
  
  // Datos para los selects
  cpInfoList: CpInfo[] = [];
  selectedCpInfo: CpInfo = {
    cp: '',
    asentamiento: '',
    tipo_asentamiento: '',
    municipio: '',
    estado: '',
    ciudad: '',
    pais: ''
  };

  private modalSubscription?: Subscription;

  formErrors: { [key: string]: string } = {};

  constructor(
    private userService: UserService,
    private cpService: CpInfoService,
    public modalService: ModalService
  ) {}

  ngOnInit(): void {
    this.modalSubscription = this.modalService.getData().subscribe(data => {
      if (data) {
        this.isEditing = true;
        this.user = { ...data };
        if (this.user.address) {
          const cpMatch = this.user.address.match(/\b\d{5}\b/);
          if (cpMatch) {
            this.cp = cpMatch[0];
            this.getDireccion();
          }
          const addressParts = this.user.address.split(',');
          if (addressParts.length > 0) {
            this.calle = addressParts[0].trim();
          }
        }
      } else {
        this.resetForm();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.modalSubscription) {
      this.modalSubscription.unsubscribe();
    }
  }

  resetForm(): void {
    this.isEditing = false;
    this.user = { name: '', lastName: '', email: '', address: '' };
    this.calle = '';
    this.cp = '';
    this.selectedCpInfo = {
      cp: '',
      asentamiento: '',
      tipo_asentamiento: '',
      municipio: '',
      estado: '',
      ciudad: '',
      pais: ''
    };
    this.cpInfoList = [];
  }

  getDireccion() {
    if (this.cp) {
      this.cpService.getInfoByCP(this.cp).subscribe({
        next: (data: any[]) => {
          console.log('Respuesta de CP:', data);
          if (data && Array.isArray(data)) {
            // Extraemos los objetos response de cada elemento del array
            this.cpInfoList = data.map(item => item.response);
            console.log('Lista de CP info:', this.cpInfoList);
            if (this.cpInfoList.length > 0) {
              this.selectedCpInfo = { ...this.cpInfoList[0] };
              console.log('CP Info seleccionada:', this.selectedCpInfo);
              this.updateAddress();
            }
          }
        },
        error: (error) => {
          console.error('Error al obtener info del CP:', error);
        }
      });
    }
  }

  updateAddress() {
    this.user.address = `${this.calle} ${this.selectedCpInfo.tipo_asentamiento} ${this.selectedCpInfo.asentamiento}, ${this.selectedCpInfo.cp} ${this.selectedCpInfo.municipio}, ${this.selectedCpInfo.estado}, ${this.selectedCpInfo.pais}`;
  }

  onAsentamientoChange() {
    const selected = this.cpInfoList.find(info => info.asentamiento === this.selectedCpInfo.asentamiento);
    if (selected) {
      this.selectedCpInfo = selected;
      this.updateAddress();
    }
  }

  validateForm(): boolean {
    this.formErrors = {};
    let valid = true;
    if (!this.user.name || this.user.name.trim().length < 2) {
      this.formErrors['name'] = 'El nombre es obligatorio y debe tener al menos 2 caracteres.';
      valid = false;
    }
    if (!this.user.lastName || this.user.lastName.trim().length < 2) {
      this.formErrors['lastName'] = 'El apellido es obligatorio y debe tener al menos 2 caracteres.';
      valid = false;
    }
    if (!this.user.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(this.user.email)) {
      this.formErrors['email'] = 'Correo electrónico inválido.';
      valid = false;
    }
    if (!this.calle || this.calle.trim().length < 2) {
      this.formErrors['calle'] = 'La calle es obligatoria.';
      valid = false;
    }
    if (!this.cp || !/^\d{5}$/.test(this.cp)) {
      this.formErrors['cp'] = 'El código postal debe ser de 5 dígitos.';
      valid = false;
    }
    if (!this.selectedCpInfo.asentamiento) {
      this.formErrors['asentamiento'] = 'Selecciona un asentamiento.';
      valid = false;
    }
    return valid;
  }

  submit() {
    if (!this.validateForm()) {
      return;
    }

    const observable = this.isEditing
      ? this.userService.updateUser(this.user.id!, this.user)
      : this.userService.addUser(this.user);

    observable.subscribe({
      next: (res) => {
        console.log(this.isEditing ? 'Usuario actualizado' : 'Usuario guardado', res);
        this.modalService.close();
      },
      error: (error) => {
        console.error('Error al guardar el usuario:', error);
      }
    });
  }
}
