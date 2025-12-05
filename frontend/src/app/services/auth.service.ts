import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LoadingComponent } from '../loading/loading.component';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user = new BehaviorSubject<{
    token: string;
    expirationDate: Date;
    userId: number;
  } | null>(null);

  private tokenTimer?: ReturnType<typeof setInterval> | null;

  dialogRef = inject(MatDialog);

  constructor(private http: HttpClient, private router: Router) {}

  register(username: string, email: string, password: string) {
    let loaderRef: MatDialogRef<LoadingComponent, any>;
    let loaderTimeout: ReturnType<typeof setTimeout>;

    loaderTimeout = setTimeout(() => {
      loaderRef = this.dialogRef.open(LoadingComponent, {
        disableClose: true,
      });
    }, 300);

    const authData = { username: username, email: email, password: password };
    this.http
      .post<{ token: string; expiresIn: number; userId: number }>(
        environment.apiUrl + '/users/signup',
        authData
      )
      .subscribe({
        next: (response) => {
          const token = response.token;
          const expiresIn = response.expiresIn;
          const userId = response.userId;

          if (token && expiresIn && userId) {
            this.setAuthTimer(expiresIn);

            const now = new Date();
            const expirationDate = new Date(now.getTime() + expiresIn * 1000);
            this.user.next({
              token: token,
              expirationDate: expirationDate,
              userId: userId,
            });

            this.saveAuthData(token, expirationDate, userId);
            this.router.navigate(['/dashboard']);
          }
        },
        error: (err) => {
          clearTimeout(loaderTimeout);
          loaderRef.close();
          return err;
        },
        complete: () => {
          clearTimeout(loaderTimeout);
          loaderRef.close();
        },
      });
  }
  login(email: string, password: string) {
    let loaderRef: MatDialogRef<LoadingComponent, any>;
    let loaderTimeout: ReturnType<typeof setTimeout>;

    loaderTimeout = setTimeout(() => {
      loaderRef = this.dialogRef.open(LoadingComponent, {
        disableClose: true,
      });
    }, 300);

    const authData = { email: email, password: password };
    this.http
      .post<{ token: string; expiresIn: number; userId: number }>(
        environment.apiUrl + '/users/login',
        authData
      )
      .subscribe({
        next: (response) => {
          const token = response.token;
          const expiresInDuration = response.expiresIn;
          const userId = response.userId;
          if (token && expiresInDuration && userId) {
            this.setAuthTimer(expiresInDuration);

            const now = new Date();
            const expirationDate = new Date(
              now.getTime() + expiresInDuration * 1000
            );
            this.user.next({
              token: token,
              expirationDate: expirationDate,
              userId: userId,
            });

            this.saveAuthData(token, expirationDate, userId);
            this.router.navigate(['dashboard']);
          }
        },
        error: (err) => {
          clearTimeout(loaderTimeout);
          loaderRef?.close();
          return err;
        },
        complete: () => {
          clearTimeout(loaderTimeout);
          loaderRef?.close();
        },
      });
  }
  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      this.user.next(null);
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.user.next(authInformation);
      this.setAuthTimer(expiresIn / 1000);
    }
  }
  logout() {
    this.user.next(null);
    this.clearAuthData();
    this.router.navigate(['/']);
  }
  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }
  private saveAuthData(token: string, expirationDate: Date, userId: number) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', JSON.stringify(userId));
  }
  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }
  private getAuthData(): {
    token: string;
    expirationDate: Date;
    userId: any;
  } | null {
    const token = localStorage.getItem('token');
    const expirationDateRaw = localStorage.getItem('expiration');
    const userIdRaw = localStorage.getItem('userId');

    if (!token || !expirationDateRaw || !userIdRaw) {
      return null;
    }
    const userId = JSON.parse(userIdRaw);
    const expirationDate = new Date(expirationDateRaw);

    return {
      token,
      expirationDate,
      userId,
    };
  }
}
