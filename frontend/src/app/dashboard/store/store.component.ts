import { Component, Injector, input, OnInit } from '@angular/core';
import { StoreService } from './store.service';
import { Product } from './product.model';
import { ProductFormComponent } from './product-form/product-form.component';
import { NgFor } from '@angular/common';
import { ProductComponent } from './product/product.component';

@Component({
  selector: 'app-store',
  imports: [ProductFormComponent, NgFor, ProductComponent],
  template: ` <app-product-form [mode]="'create'"></app-product-form>
    <table>
      <thead>
        <tr>
          <td *ngFor="let k of objectKeys(products[0] || {})">{{ k }}</td>
        </tr>
      </thead>
      <tbody>
        @for (product of products; track product) {
        <app-product [product]="product" (productDeleteId)="onProductDelete($event)" />
        }
      </tbody>
    </table>`,
  styleUrl: './store.component.css',
})
export class StoreComponent implements OnInit {
  constructor(private storeService: StoreService) {}
  //TODO refactor products in to beahavioral subject
  products: Product[] = [];

  ngOnInit(): void {
    this.storeService.getProducts()?.subscribe((products) => {
      this.products = products.results;
      console.log(products.results);
    });
  }
  objectKeys(obj: Product) {
    return Object.keys(obj);
  }
  onProductDelete(productId:number){

  }
}
