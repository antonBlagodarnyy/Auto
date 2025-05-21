import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../Auth.service';
import { Router } from '@angular/router';
import { MatInputModule, MatLabel } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, MatInputModule, MatLabel, MatButtonModule],
  styleUrl: '../auth.component.css',
  templateUrl: './login.component.html',
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
