import { Component } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-dashboard',
  imports: [HeaderComponent, RouterOutlet],

  template: `<app-header></app-header>
    <div class="container">
      <div class="dashboard">
        <router-outlet></router-outlet>
      </div>
    </div> `,
})
export class DashboardComponent {
  constructor(private authService: AuthService, private router: Router) {
    this.authService.autoAuthUser();
  }

  ngOnInit(): void {}
}
