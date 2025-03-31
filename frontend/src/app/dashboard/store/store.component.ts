import { Component, OnInit } from '@angular/core';
import { StoreService } from './store.service';
import { Product } from './product.model';
import { ProductFormComponent } from './product-form/product-form.component';
import { NgFor, TitleCasePipe } from '@angular/common';
import { ProductComponent } from './product/product.component';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-store',
  imports: [ProductFormComponent, NgFor, ProductComponent, TitleCasePipe],
  template: ` <app-product-form
      [mode]="'create'"
      (createdOrUpdated)="updateProducts()"
    ></app-product-form>
    <table>
      <thead>
        <tr>
          <td *ngFor="let k of objectKeys(products.getValue()[0] || {})">
            {{ k | titlecase }}
          </td>
        </tr>
      </thead>
      <tbody>
        @for (product of products.getValue(); track product.id) {
        <app-product
          [product]="product"
          (productDeleteId)="onProductDelete($event)"
          (updated)="updateProducts()"
        />
        }
      </tbody>
    </table>`,
  styleUrl: './store.component.css',
})
export class StoreComponent implements OnInit {
  constructor(private storeService: StoreService) {}
  products = new BehaviorSubject<Product[]>([]);

  ngOnInit(): void {
    this.updateProducts();
  }
  updateProducts() {
    this.storeService.getProducts()?.subscribe((product) => {
      this.products.next(product.results);
    });
  }
  objectKeys(obj: Product) {
    let keys = Object.keys(obj);
    keys = keys.filter((key) => key != 'id');
    return keys;
  }
  onProductDelete(productId: number) {
    this.storeService
      .deleteProduct(productId)
      ?.subscribe(() => this.updateProducts());
  }
}
