import { Component, input, output } from '@angular/core';
import { Product } from '../product.model';
import { ProductFormComponent } from '../product-form/product-form.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-product',
  imports: [NgIf, ProductFormComponent],
  template: `<tr *ngIf="!showForm">
      <td>{{ product()?.title }}</td>
      <td>{{ product()?.description }}</td>
      <td>{{ product()?.stock }}</td>
      <td>{{ product()?.price }}</td>
      <td>
        <button (click)="toggleForm(product()?.id)">Edit</button
        ><button (click)="deleteProduct(product()?.id)">Delete</button>
      </td>
    </tr>

    <tr *ngIf="showForm">
      <td colspan="4">
        <app-product-form
          [mode]="'edit'"
          [product]="product()"
          (createdOrUpdated)="toggleForm(product()?.id); onUpdated()"
        ></app-product-form>
      </td>
      <td>
        <button (click)="toggleForm(product()?.id)">Cancel</button>
      </td>
    </tr> `,
  styleUrl: '../store.component.css',
})
export class ProductComponent {
  product = input<Product>();
  showForm: boolean = false;
  productDeleteId = output<number>();
  updated = output();

  deleteProduct(productId: number | undefined) {
    if (productId) {
      if (confirm('Delete product?')) this.productDeleteId.emit(productId);
    }
  }
  toggleForm(productId: number | undefined) {
    if (productId) {
      this.showForm = !this.showForm;
    }
  }
  onUpdated() {
    this.updated.emit();
  }
}
