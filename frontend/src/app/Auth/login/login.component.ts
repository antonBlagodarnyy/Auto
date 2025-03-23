import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../Auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: '../auth.component.css',
})
export class LoginComponent {
  constructor(private authService: AuthService) {}
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  });

  onSubmit() {
    if (!this.loginForm.invalid) {
      const form = this.loginForm.value;
      if (form.email != null && form.password != null) {
        this.authService.login(form.email, form.password);
      }
    }
  }
}
