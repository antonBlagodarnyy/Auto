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

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  registerForm = new FormGroup({
    userName: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', this.passwordsMatch(passwordConfirm.value)),
    passwordConfirm: new FormControl(),
  });
  onSubmit() {
    console.log('sent');
  }
  passwordsMatch(passwordConfirmValue: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const forbidden = passwordConfirmValue.match(control.value);
      return forbidden ? { forbiddenName: { value: control.value } } : null;
    };
  }
}
