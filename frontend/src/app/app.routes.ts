import { Routes } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './Auth/auth.guard';
import { LoginComponent } from './Auth/login/login.component';
import { SignupComponent } from './Auth/signup/signup.component';
import { StoreComponent } from './dashboard/store/store.component';
import { CalendarComponent } from './dashboard/calendar/calendar.component';
import { ClientsComponent } from './dashboard/clients/clients.component';

export const routes: Routes = [
  { path: '', component: WelcomeComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      {path:'calendar', component: CalendarComponent},
      {path:'store', component: StoreComponent},
      {path:'clients', component: ClientsComponent}
    ]
  },
  {
    path: 'profile',
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'signup', component: SignupComponent },
    ],
  },
];
