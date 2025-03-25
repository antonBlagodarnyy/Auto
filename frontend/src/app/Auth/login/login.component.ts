import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../Auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  styleUrl: '../auth.component.css',
  template: ` <div class="container">
    <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
      <label for="email">Email:</label>
      <input id="email" type="text" formControlName="email" />

      <label for="password">Password:</label>
      <input id="password" type="password" formControlName="password" />

      <button type="submit">Login</button>
    </form>
  </div>`,
})
export class LoginComponent {
  constructor(private authService: AuthService, private router: Router) {}
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  });
  ngOnInit(): void {
    this.authService.autoAuthUser();

    if (this.authService.user.getValue()) {
      this.router.navigate(['dashboard']);
    }
  }
  onSubmit() {
    if (!this.loginForm.invalid) {
      const form = this.loginForm.value;
      if (form.email != null && form.password != null) {
        this.authService.login(form.email, form.password);
      }
    }
  }
}
