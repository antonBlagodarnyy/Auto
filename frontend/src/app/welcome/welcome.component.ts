import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-welcome',
  imports: [RouterLink],
  styleUrl: './welcome.component.css',
  template: `
    <div class="container">
      <h1 class="header">Welcome to Auto</h1>
      <div class="container-auth">
        <a routerLink="profile/login">Login</a>
        <a routerLink="profile/signup">Signup</a>
      </div>
    </div>
  `,
})
export class WelcomeComponent {}
