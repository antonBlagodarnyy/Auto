import { Component, input } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { StoreService } from '../store.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-product-form',
  imports: [ReactiveFormsModule],
  styleUrl: './product-form.component.css',
  template: ` <form

    [formGroup]="productForm"
    (ngSubmit)="onSubmit()"
  >
    <label for="title">Title:</label>
    <input id="title" name="title" type="text" formControlName="title" />

    <label for="description">Description:</label>
    <input
      id="description"
      name="description"
      type="text"
      formControlName="description"
    />

    <label for="stock">Stock:</label>
    <input id="stock" name="stock" type="number" formControlName="stock" />

    <label for="price">Price:</label>
    <input
      id="price"
      name="price"
      type="number"
      step="any"
      formControlName="price"
    />
    <button type="submit">Save</button>
  </form>`,
})
export class ProductFormComponent {
  constructor(private storeService: StoreService) {}

  mode = input<'edit' | 'create'>();

  productForm = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl(''),
    stock: new FormControl('' , Validators.required),
    price: new FormControl('' , Validators.required),
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
            console.log(product);
          });
      }
    }
  }
}
