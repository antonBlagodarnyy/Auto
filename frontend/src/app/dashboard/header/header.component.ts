import { Component } from '@angular/core';
import { AuthService } from '../../Auth/Auth.service';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  constructor(private authService: AuthService) {}
  onLogout() {
    this.authService.logout();
  }
}
