import { Routes } from '@angular/router';
import { UserListComponent } from './pages/user-list/user-list.component';
import { UserFormComponent } from './pages/user-form/user-form.component';

export const routes: Routes = [
  { path: '', component: UserListComponent },
  { path: 'nuevo', component: UserFormComponent },
  { path: 'editar/:id', component: UserFormComponent }, // opcional para edición
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
