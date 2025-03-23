import { Component } from '@angular/core';
import { LoginComponent } from "./login/login.component";
import { SignupComponent } from "./signup/signup.component";
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-auth',
  imports: [LoginComponent, SignupComponent, NgIf],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {
  showForm: string = '';

  changeForm(form: string) {
    this.showForm = form;
  }
}
