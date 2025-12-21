import { Component } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { MatError, MatInputModule, MatLabel } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-signup',
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatLabel,
    MatButtonModule,
    MatError,
    RouterLink,
    MatIconModule,
  ],
  templateUrl: './signup.component.html',
  styleUrl: '../auth.component.scss',
})
export class SignupComponent {
  constructor(private authService: AuthService) {}

  passwordMatch: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const pass = control.get('password');
    const passwordConfirm = control.get('passwordConfirm');
    if (!pass || !passwordConfirm) return null;

    return pass.value == passwordConfirm.value ? null : { passwordMatch: true };
  };

  registerForm = new FormGroup(
    {
      userName: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
      passwordConfirm: new FormControl('', Validators.required),
    },
    { validators: this.passwordMatch }
  );

  ngOnInit(): void {
    this.authService.autoAuthUser();

    //TODO create already-auth.guard
    //if (this.authService.user.getValue()) {
    //  this.router.navigate(['dashboard']);
    //}
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
