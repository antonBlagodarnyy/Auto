import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-welcome',
  imports: [RouterLink, MatButtonModule],
  styleUrl: './welcome.component.css',
  template: `
    <div class="container">
      <h1 class="header">Welcome to Auto</h1>
      <div class="container-auth">
        <a mat-button routerLink="profile/login">Login</a>
        <a mat-button routerLink="profile/signup">Signup</a>
      </div>
    </div>
  `,
})
export class WelcomeComponent {}
