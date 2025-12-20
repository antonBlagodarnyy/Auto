import { Component, inject } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterOutlet,
} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  imports: [HeaderComponent, RouterOutlet],

  template: `<app-header></app-header>

    @if(welcome){
    <h2>Welcome!</h2>
    }
    <router-outlet></router-outlet> `,
  styles: `h2{
    padding-top: 5rem;
      text-align: center;
    }`,
})
export class DashboardComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  welcome = true;
  private routerSub!: Subscription;

  constructor(private authService: AuthService) {
    this.authService.autoAuthUser();
  }
  ngOnInit() {
    // Initial check
    this.updateWelcome();

    // Listen to router events using lifecycle subscription
    this.routerSub = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => this.updateWelcome());
  }

  ngOnDestroy() {
    // Prevent memory leaks
    this.routerSub.unsubscribe();
  }

  private updateWelcome() {
    // Check if the current route has no child, meaning root dashboard
    this.welcome = this.route.snapshot.firstChild === null;
  }
}
