import {
  Component,
  computed,
  input,
  output,
  Signal,
  signal,
} from '@angular/core';
import { IClient } from '../../../Interfaces/IClient';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { TitleCasePipe } from '@angular/common';
import { FilterKeysPipe } from '../custom-keyvalue.pipe';

@Component({
  selector: 'app-mobile-clients',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatPaginatorModule,
    TitleCasePipe,
    FilterKeysPipe,
  ],
  template: ` @for(client of clientsToShow(); track client.id){
    <mat-card>
      <mat-card-header>
        <mat-card-title
          ><h4>{{ client.name }}</h4></mat-card-title
        >
      </mat-card-header>

      <mat-card-content>
        @for( prop of client | filterKeys:['id','name' ]; track prop.key) {
        <div>
          <span class="field">{{ prop.key | titlecase }}:</span
          ><span class="value">{{ prop.value }}</span>
        </div>
        }
      </mat-card-content>
      <mat-card-actions>
        <button mat-button (click)="onEdit(client)">Edit</button>
        <button mat-button (click)="onDelete(client.id)">Delete</button>
      </mat-card-actions>
    </mat-card>

    }

    <mat-paginator
      (page)="onPageChange($event)"
      [pageSizeOptions]="[5, 10, 25]"
      aria-label="Select page"
      showFirstLastButtons="true"
      length="{{ this.clients()().length }}"
      pageIndex="{{ pageIndex() }}"
      pageSize="{{ pageSize() }}"
    >
    </mat-paginator>`,
  styles: `
  mat-card{
    margin: 2rem;
  }
  .field{
      font-weight:500;
      color: var(--mat-sys-primary);
    }
    .value{
      margin-left: 1rem;
    }`,
})
export class MobileClientsComponent {
  clients = input.required<Signal<IClient[]>>();
  deleteEvent = output<number>();
  openEditFormEvent = output<IClient>();

  pageIndex = signal(0);
  pageSize = signal(5);
  clientsToShow = computed(() => {
    const start = this.pageIndex() * this.pageSize();
    const end = start + this.pageSize();

    return this.clients()().slice(start, end);
  });
  constructor() {}

  onPageChange($event: PageEvent) {
    this.pageIndex.set($event.pageIndex);
    this.pageSize.set($event.pageSize);
  }

  onDelete(clientId: number) {
    this.deleteEvent.emit(clientId);
  }
  onEdit(client: IClient) {
    this.openEditFormEvent.emit(client);
  }
}
