import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { TodoComponent } from '../todo/todo.component';
import { ViewportService } from '../../services/viewport.service';
import { MatMenuModule } from '@angular/material/menu';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
  ],
  template: `<mat-toolbar>
    @if(isSmallScreen()?.matches){
    <button mat-icon-button [matMenuTriggerFor]="menu">
      <mat-icon>menu</mat-icon>
    </button>
    <mat-menu #menu="matMenu">
      <a mat-menu-item [routerLink]="['calendar']">Calendar</a>
      <a
        mat-menu-item
        [routerLink]="['store']"
        routerLinkActive="router-link-active"
        >Store</a
      >
      <a
        mat-menu-item
        [routerLink]="['clients']"
        routerLinkActive="router-link-active"
        >Clients</a
      >
    </mat-menu>
    } @else{
    <div class="container-links">
      <a mat-button [routerLink]="['calendar']">Calendar</a>
      <a
        mat-button
        [routerLink]="['store']"
        routerLinkActive="router-link-active"
        >Store</a
      >
      <a
        mat-button
        [routerLink]="['clients']"
        routerLinkActive="router-link-active"
        >Clients</a
      >
    </div>
    }

    <button class="btn-todo" mat-raised-button (click)="openTodos()">
      TODO
    </button>
    <span style="flex:1 1 auto"></span>
    <button mat-raised-button (click)="onLogout()">Logout</button>
  </mat-toolbar>`,
  styles: `.container-links > a{
    margin: 1rem;
  }
  .btn-todo{
    margin: 1rem;
  }`,
})
export class HeaderComponent {
  protected viewportService = inject(ViewportService);
  isSmallScreen = toSignal(this.viewportService.isSmallScreen$);
  constructor(private authService: AuthService, private dialogRef: MatDialog) {}

  onLogout() {
    this.authService.logout();
  }
  openTodos() {
    this.dialogRef.open(TodoComponent);
  }
}
