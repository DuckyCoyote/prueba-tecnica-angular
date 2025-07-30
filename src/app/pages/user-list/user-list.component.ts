import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { ModalService } from '../../services/modal.service';
import { UserFormComponent } from '../user-form/user-form.component';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  imports: [CommonModule, UserFormComponent],
  standalone: true
})
export class UserListComponent implements OnInit {
  users: any[] = [];
  currentPage: number = 0;
  pageSize: number = 10;
  totalPages: number = 0;
  totalElements: number = 0;
  isLast: boolean = false;
  showModal = false;

  constructor(
    private userService: UserService,
    public modalService: ModalService
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers(page: number = 0) {
    this.userService.getUsers(page, this.pageSize).subscribe((res) => {
      this.users = res.data || [];
      this.totalPages = res.totalPages;
      this.currentPage = res.currentPage;
      this.pageSize = res.pageSize;
      this.totalElements = res.totalElements;
      this.isLast = res.isLast;
    });
  }

  setPage(page: number) {
    if (page >= 0 && page < this.totalPages) {
      this.loadUsers(page);
    }
  }

  openUserForm(user?: any) {
    this.modalService.open(user);
  }

  deleteUser(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      this.userService.deleteUser(id).subscribe(() => {
        this.loadUsers(this.currentPage);
      });
    }
  }

  get paginatedUsers() {
    return this.users;
  }
}
