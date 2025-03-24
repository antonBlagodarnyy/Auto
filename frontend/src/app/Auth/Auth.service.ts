import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticated = false;
  private token?: string | null;
  private tokenTimer?: ReturnType<typeof setInterval> | null;
  private userId?: number | null;
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }
  getIsAuth() {
    return this.isAuthenticated;
  }
  getUserId() {
    return this.userId;
  }
  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  register(username: string, email: string, password: string) {
    const authData = { username: username, email: email, password: password };
    this.http.post(environment.apiUrl + '/users/signup', authData).subscribe({
      next: () => {
        //TODO implement token
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  login(email: string, password: string) {
    const authData = { email: email, password: password };
    this.http
      .post<{ token: string; expiresIn: number; userId: number }>(
        environment.apiUrl + '/users/login',
        authData
      )
      .subscribe({
        next: (response) => {
          const token = response.token;
          this.token = token;
          
          if (token) {
            const expiresInDuration = response.expiresIn;

            this.setAuthTimer(expiresInDuration);

            this.isAuthenticated = true;
            this.userId = response.userId;
            this.authStatusListener.next(true);

            const now = new Date();
            const expirationDate = new Date(
              now.getTime() + expiresInDuration * 1000
            );

            this.saveAuthData(token, expirationDate, this.userId);
            this.router.navigate(['dashboard']);
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }
  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.userId = null;
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
    console.log(userIdRaw);
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
