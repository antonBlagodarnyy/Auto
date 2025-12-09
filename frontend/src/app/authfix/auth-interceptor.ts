import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpEvent,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { Observable, switchMap, take } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return this.authService.user$.pipe(
      take(1),
      switchMap((user) => {
        const authToken = user?.token;

        if (authToken) {
          const authRequest = req.clone({
            headers: req.headers.set('Authorization', 'Bearer ' + authToken),
          });
          return next.handle(authRequest);
        } else {
          return next.handle(req); // If no token, continue with the request without modifying headers
        }
      })
    );
  }
}
