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

@Component({
  selector: 'app-store',
  imports: [
    ProductFormComponent,
    ProductTableComponent,
    MatDialogModule,
    MatTableModule,
    MatButtonModule,
  ],
  template: `
    <app-product-form
      (createdEvent)="onCreatedProduct($event)"
    ></app-product-form>
    <div class="container">
      <app-product-table
        [products]="products()"
        (deleteEvent)="onDeleteProduct($event)"
        (openEditFormEvent)="onOpenEditForm($event)"
      />
    </div>
  `,
  styles: `.container{
    padding: 5vh;
  }`,
})
export class StoreComponent implements OnInit {
  constructor(private dialog: MatDialog, private snackBarRef: MatSnackBar) {}

  private storeService = inject(StoreService);

  products: Signal<IProduct[]> = toSignal(this.storeService.products$, {
    initialValue: [],
  });

  ngOnInit(): void {
    this.storeService.getStoredProducts$().subscribe();
  }

  onCreatedProduct(newProduct: {
    title: string;
    description: string;
    stock: number;
    price: number;
  }) {
    this.storeService.addNewProduct$(newProduct).subscribe({
      next: () => {
        this.snackBarRef.open('Client added.', '', {
          duration: 1000,
        });
      },
    });
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
      maxWidth: '100%',
    });
    // Listen to the dialog close event to handle edit
    dialogRef.afterClosed().subscribe((result) => {
      const { productId, changedValues } = result;
      this.storeService.updateProduct$(productId, changedValues).subscribe({
        next: () => {
          this.snackBarRef.open('Product edited.', '', { duration: 1000 });
        },
      });
    });
  }
}
