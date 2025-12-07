import { Component, inject, OnInit } from '@angular/core';
import { StoreService } from '../../services/store.service';
import { Product } from './product.model';
import { ProductFormComponent } from './product-form/product-form.component';
import { BehaviorSubject } from 'rxjs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-store',
  imports: [
    ProductFormComponent,
    MatDialogModule,
    MatTableModule,
    MatButtonModule,
  ],
  template: ` <app-product-form
      (createdOrUpdated)="updateProducts()"
    ></app-product-form>
    <table mat-table [dataSource]="products.getValue()">

    <ng-container matColumnDef="title">
        <th mat-header-cell *matHeaderCellDef>Title</th>
        <td mat-cell *matCellDef="let product">{{ product.title }}</td>
      </ng-container>

      <ng-container matColumnDef="description">
        <th mat-header-cell *matHeaderCellDef>Description</th>
        <td mat-cell *matCellDef="let product">{{ product.description }}</td>
      </ng-container>

      <ng-container matColumnDef="stock">
        <th mat-header-cell *matHeaderCellDef>Stock</th>
        <td mat-cell *matCellDef="let product">{{ product.stock }}</td>
      </ng-container>

       <ng-container matColumnDef="price">
        <th mat-header-cell *matHeaderCellDef>Price</th>
        <td mat-cell *matCellDef="let product">{{ product.price }}</td>
      </ng-container>

      <ng-container matColumnDef="actions">
        <th mat-header-cell *matHeaderCellDef>Actions</th>
        <td mat-cell *matCellDef="let product">
          <button mat-button (click)="onProductDelete(product.id)">Delete</button>
          <button
            mat-button
            (click)="
              toggleForm(product.title, product.description, product.stock, product.price, product.id)
            "
          >
            Edit
          </button>
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="columnsToDisplay"></tr>
      <tr mat-row *matRowDef="let myRowData; columns: columnsToDisplay"></tr>
    </table>`,
})
export class StoreComponent implements OnInit {
  products = new BehaviorSubject<Product[]>([]);
  
  columnsToDisplay = ['title', 'description', 'stock', 'price' ,'actions'];

  editForm = inject(MatDialog);

  constructor(private storeService: StoreService) {}

  ngOnInit(): void {
    this.updateProducts();
  }
  updateProducts() {
    this.storeService.getProducts()?.subscribe((product) => {
      this.products.next(product.results);
    });
  }

  onProductDelete(productId: number) {
    this.storeService
      .deleteProduct(productId)
      ?.subscribe(() => this.updateProducts());
  }
  toggleForm(
      productTitle: string,
      productDescription: string,
      productStock: string,
      productPrice: number,
      productId: number
    ) {
      const dialogRef = this.editForm.open(ProductFormComponent, {
        data: {
          edit: true,
          title: productTitle,
          description: productDescription,
          stock: ""+productStock,
          price:""+productPrice,
          id: productId,
        },
      });
      dialogRef.afterClosed().subscribe(() => {
        this.updateProducts();
      });
    }
}
