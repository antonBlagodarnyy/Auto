import { Component } from '@angular/core';
import { AuthService } from '../../Auth/Auth.service';
import { RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButton, MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-header',
  imports: [RouterLink, MatToolbarModule, MatButtonModule],
  template: `<mat-toolbar>
    <div class="container-links">
      <a mat-button [routerLink]="['calendar']">Calendar</a>
      <a
        mat-button
        [routerLink]="['store']"
        routerLinkActive="router-link-active"
        >Store</a
      >
      <a
        mat-button
        [routerLink]="['clients']"
        routerLinkActive="router-link-active"
        >Clients</a
      >
    </div>
    <span style="flex:1 1 auto"></span>
    <button mat-raised-button (click)="onLogout()">Logout</button>
  </mat-toolbar>`,
})
export class HeaderComponent {
  constructor(private authService: AuthService) {}
  onLogout() {
    this.authService.logout();
  }
}
