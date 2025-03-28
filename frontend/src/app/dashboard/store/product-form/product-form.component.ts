import { Component, input, output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { StoreService } from '../store.service';
import { Product } from '../product.model';

@Component({
  selector: 'app-product-form',
  imports: [ReactiveFormsModule],
  styleUrl: './product-form.component.css',
  template: `
    <form [formGroup]="productForm" (ngSubmit)="onSubmit()">
      <label for="title">Title:</label>
      <input
        id="title"
        name="title"
        type="text"
        formControlName="title"
        [placeholder]="product()?.title ? product()?.title : ''"
      />

      <label for="description">Description:</label>
      <input
        id="description"
        name="description"
        type="text"
        formControlName="description"
        [placeholder]="product()?.description ? product()?.description : ''"
      />

      <label for="stock">Stock:</label>
      <input
        id="stock"
        name="stock"
        type="number"
        formControlName="stock"
        [placeholder]="product()?.stock ? product()?.stock : ''"
      />

      <label for="price">Price:</label>
      <input
        id="price"
        name="price"
        type="number"
        step="any"
        formControlName="price"
        [placeholder]="product()?.price ? product()?.price : ''"
      />
      <button type="submit">Save</button>
    </form>
  `,
})
export class ProductFormComponent {
  constructor(private storeService: StoreService) {}
  product = input<Product | undefined>();
  mode = input<'edit' | 'create'>();
  createdOrUpdated = output();

  productForm = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl(''),
    stock: new FormControl('', Validators.required),
    price: new FormControl('', Validators.required),
  });

  onSubmit() {
    if (
      this.productForm.valid &&
      this.productForm.value.title != undefined &&
      this.productForm.value.description != undefined &&
      this.productForm.value.stock != undefined &&
      this.productForm.value.price != undefined
    ) {
      if (this.mode() == 'create') {
        this.storeService
          .createProduct(
            this.productForm.value.title,
            this.productForm.value.description,
            +this.productForm.value.stock,
            +this.productForm.value.price
          )
          ?.subscribe((product) => {
            //TODO may be better to emit the product and update only one product
            this.createdOrUpdated.emit();
          });
      }
    }
  }
}
