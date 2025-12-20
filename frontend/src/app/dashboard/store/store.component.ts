import { Component, inject, OnInit, Signal } from '@angular/core';
import { StoreService } from '../../services/store.service';
import { IProduct } from '../../Interfaces/IProduct';
import { ProductFormComponent } from './product-form/product-form.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductTableComponent } from './product-table/product-table.component';
import { ViewportService } from '../../services/viewport.service';
import { MatIconModule } from '@angular/material/icon';
import { MobileProductsComponent } from '../mobile/mobile-products/mobile-products.component';

@Component({
  selector: 'app-store',
  imports: [
    ProductTableComponent,
    MatDialogModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MobileProductsComponent,
  ],
  template: `
    <div class="container">
      <button class="btn-add" mat-fab extended (click)="onOpenCreateForm()">
        <mat-icon>add</mat-icon>Add product
      </button>
      @if(isSmallScreen()?.matches){
      <app-mobile-products
        [products]="products"
        (deleteEvent)="onDeleteProduct($event)"
        (openEditFormEvent)="onOpenEditForm($event)"
      />
      } @else {
      <app-product-table
        class="table"
        [products]="products()"
        (deleteEvent)="onDeleteProduct($event)"
        (openEditFormEvent)="onOpenEditForm($event)"
      />
      }
    </div>
  `,
  styles: `  .table{
    width: 90vw;
  }
  .btn-add{
    margin: 2rem;
  }
  .container{
  display: flex;
  flex-direction: column;
  align-items: center;
  }`,
})
export class StoreComponent implements OnInit {
  constructor(private dialog: MatDialog, private snackBarRef: MatSnackBar) {}
  private viewportService = inject(ViewportService);
  private storeService = inject(StoreService);

  isSmallScreen = toSignal(this.viewportService.isSmallScreen$);

  products: Signal<IProduct[]> = toSignal(this.storeService.products$, {
    initialValue: [],
  });

  ngOnInit(): void {
    this.storeService.getStoredProducts$().subscribe();
  }

  onDeleteProduct(productId: number) {
    this.storeService.deleteProduct$(productId)?.subscribe({
      next: () => {
        this.snackBarRef.open('Product deleted.', '', {
          duration: 1000,
        });
      },
    });
  }

  onOpenEditForm(product: IProduct) {
    const dialogRef = this.dialog.open(ProductFormComponent, {
      data: product,
    });
    // Listen to the dialog close event to handle edit
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const { productId, changedValues } = result;
        this.storeService.updateProduct$(productId, changedValues).subscribe({
          next: () => {
            this.snackBarRef.open('Product edited.', '', { duration: 1000 });
          },
        });
      }
    });
  }
  onOpenCreateForm() {
    const dialogRef = this.dialog.open(ProductFormComponent);
    // Listen to the dialog close event to handle edit
    dialogRef.afterClosed().subscribe(
      (result: {
        newProduct: {
          title: string;
          description: string;
          stock: string;
          price: string;
        };
      }) => {
        if (result) {
          const { title, description, stock, price } = result.newProduct;
          this.storeService
            .addNewProduct$({
              title: title,
              description: description,
              stock: +stock,
              price: +price,
            })
            .subscribe({
              next: () => {
                this.snackBarRef.open('Product added.', '', {
                  duration: 1000,
                });
              },
            });
        }
      }
    );
  }
}
