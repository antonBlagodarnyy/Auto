import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-welcome',
  imports: [RouterLink],
  styleUrl: './welcome.component.css',
  template: `<h1>Welcome to auto</h1>
    <main style="display: flex; align-items: center;">
      <img width="50%" src="/assets/a.jpg" />
      <a routerLink="profile/login">Login</a>
      <a routerLink="profile/signup">Signup</a>
    </main> `,
})
export class WelcomeComponent {}
