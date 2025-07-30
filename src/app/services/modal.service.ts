import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private displayModal = new BehaviorSubject<boolean>(false);
  private modalData = new BehaviorSubject<any>(null);

  constructor() {}

  open(data?: any): void {
    this.modalData.next(data);
    this.displayModal.next(true);
  }

  close(): void {
    this.displayModal.next(false);
    this.modalData.next(null);
  }

  display(): Observable<boolean> {
    return this.displayModal.asObservable();
  }

  getData(): Observable<any> {
    return this.modalData.asObservable();
  }
}
