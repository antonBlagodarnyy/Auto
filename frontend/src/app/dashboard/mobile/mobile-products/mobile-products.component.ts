import { TitleCasePipe, NgClass, CurrencyPipe } from '@angular/common';
import {
  Component,
  computed,
  input,
  output,
  signal,
  Signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { FilterKeysPipe } from '../custom-keyvalue.pipe';
import { IProduct } from '../../../Interfaces/IProduct';

@Component({
  selector: 'app-mobile-products',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatPaginatorModule,
    TitleCasePipe,
    FilterKeysPipe,
    NgClass,
    CurrencyPipe,
  ],
  template: `@for(product of productsToShow(); track product.id){
    <mat-card>
      <mat-card-header>
        <mat-card-title
          ><h4>{{ product.title }}</h4></mat-card-title
        >
      </mat-card-header>

      <mat-card-content>
        @for( prop of product | filterKeys:['id','title' ]; track prop.key) {
        <div>
          <span class="field">{{ prop.key | titlecase }}:</span
          ><span
            class="value"
            [ngClass]="{'description' : prop.key == 'description'}"
            >{{
              prop.key == 'price' ? (prop.value | currency : 'EUR') : prop.value
            }}</span
          >
        </div>
        }
      </mat-card-content>
      <mat-card-actions>
        <button mat-button (click)="onEdit(product)">Edit</button>
        <button mat-button (click)="onDelete(product.id)">Delete</button>
      </mat-card-actions>
    </mat-card>

    }

    <mat-paginator
      (page)="onPageChange($event)"
      [pageSizeOptions]="[5, 10, 25]"
      aria-label="Select page"
      showFirstLastButtons="true"
      length="{{ this.products()().length }}"
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
    }
    .description{
    overflow-wrap: anywhere;
 
  }`,
})
export class MobileProductsComponent {
  products = input.required<Signal<IProduct[]>>();
  deleteEvent = output<number>();
  openEditFormEvent = output<IProduct>();

  pageIndex = signal(0);
  pageSize = signal(5);
  productsToShow = computed(() => {
    const start = this.pageIndex() * this.pageSize();
    const end = start + this.pageSize();

    return this.products()().slice(start, end);
  });
  constructor() {}

  onPageChange($event: PageEvent) {
    this.pageIndex.set($event.pageIndex);
    this.pageSize.set($event.pageSize);
  }

  onDelete(productId: number) {
    this.deleteEvent.emit(productId);
  }
  onEdit(product: IProduct) {
    this.openEditFormEvent.emit(product);
  }
}
