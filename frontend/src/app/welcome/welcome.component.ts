import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-welcome',
  imports: [RouterLink, MatButtonModule],
  styleUrl: './welcome.component.scss',
  template: `
    <div class="container">
      <h1 class="title">Welcome to <span>Auto</span></h1>
      <div class="container-auth">
        <a mat-raised-button routerLink="profile/login">Login</a>
        <a mat-raised-button routerLink="profile/signup">Signup</a>
      </div>
    </div>
  `,
})
export class WelcomeComponent {}
