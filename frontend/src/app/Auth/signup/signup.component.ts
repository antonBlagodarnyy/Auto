import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { passwordMatch } from './ValidationFunctions';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../Auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './signup.component.html',
  styleUrl: '../auth.component.css',
})
export class SignupComponent {
  constructor(private authService: AuthService, private router: Router) {}

  registerForm = new FormGroup(
    {
      userName: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
      passwordConfirm: new FormControl('', Validators.required),
    },
    { validators: passwordMatch }
  );

  ngOnInit(): void {
    this.authService.autoAuthUser();

    if (this.authService.user.getValue()) {
      this.router.navigate(['dashboard']);
    }
  }

  onSubmit() {
    if (!this.registerForm.invalid) {
      const form = this.registerForm.value;
      if (
        form.email != null &&
        form.userName != null &&
        form.password != null
      ) {
        this.authService.register(form.userName, form.email, form.password);
      }
    }
  }
}
