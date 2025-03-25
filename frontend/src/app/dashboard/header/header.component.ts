import { Component } from '@angular/core';
import { AuthService } from '../../Auth/Auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  styleUrl: './header.component.css',
  template: `<button (click)="onLogout()">Logout</button>
    <a [routerLink]="['calendar']" routerLinkActive="router-link-active">Calendar</a>
    <a [routerLink]="['store']" routerLinkActive="router-link-active">Store</a>
    <a [routerLink]="['clients']" routerLinkActive="router-link-active"
      >Clients</a
    >`,
})
export class HeaderComponent {
  constructor(private authService: AuthService) {}
  onLogout() {
    this.authService.logout();
  }
}
