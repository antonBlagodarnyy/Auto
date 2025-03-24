import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  GuardResult,
  MaybeAsync,
  Router,
  RouterOutlet,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from './Auth.service';
import { map, take } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): MaybeAsync<GuardResult> {
    this.authService.autoAuthUser();
    return this.authService.user.pipe(take(1), map(user => {


        if(user){
          return true;
        } else {
          return this.router.createUrlTree(['/'])
        }
    }));
  }
}
