import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationComponent } from './components/navigation/navigation.component';

@Component({
  selector: 'app-root',
  template: `
    <app-navigation></app-navigation>
    <router-outlet></router-outlet>
  `,
  imports: [RouterOutlet, NavigationComponent],
  standalone: true
})
export class AppComponent {
  title = 'user-management';
}
