import { Component } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../Auth/Auth.service';
import { TodoComponent } from "./todo/todo.component";


@Component({
  selector: 'app-dashboard',
  imports: [HeaderComponent, RouterOutlet, TodoComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  constructor(private authService: AuthService, private router: Router) {this.authService.autoAuthUser();}
 

  
  ngOnInit(): void {

  }
}
