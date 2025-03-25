import { Component } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../Auth/Auth.service';
import { TodoComponent } from './todo/todo.component';

@Component({
  selector: 'app-dashboard',
  imports: [HeaderComponent, RouterOutlet, TodoComponent],
  styleUrl: './dashboard.component.css',
  
  template: `<app-header></app-header>
    <div class="container">
      <div class="dashboard">
        <router-outlet></router-outlet>
      </div>
      <div class="side-bar">
        <app-todo></app-todo>
      </div>
    </div> `,
  
})
export class DashboardComponent {
  constructor(private authService: AuthService, private router: Router) {
    this.authService.autoAuthUser();
  }

  ngOnInit(): void {}
}
