import { Component, computed, input, output } from '@angular/core';
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
  templateUrl: './product-form.component.html',
})
export class ProductFormComponent {
  constructor(private storeService: StoreService) {}
  product = input<Product | undefined>();
  productId: number | undefined = undefined;

  mode = input<'edit' | 'create'>();
  createdOrUpdated = output();

  productForm = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl(''),
    stock: new FormControl('', Validators.required),
    price: new FormControl('', Validators.required),
  });

  onSubmit() {
    if (this.mode() == 'create') {
      if (
        this.productForm.valid &&
        this.productForm.value.title != undefined &&
        this.productForm.value.description != undefined &&
        this.productForm.value.stock != undefined &&
        this.productForm.value.price != undefined
      ) {
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
    } else if (this.mode() == 'edit') {
      this.productId = this.product()?.id;


      let title = this.productForm.value.title
        ? this.productForm.value.title
        : this.product()?.title;

      let description = this.productForm.value.description
        ? this.productForm.value.description
        : this.product()?.description;

      let stock = this.productForm.value.stock
        ? +this.productForm.value.stock
        : this.product()?.stock;

      let price = this.productForm.value.price
        ? +this.productForm.value.price
        : this.product()?.price;

      if (title && description && stock && price && this.productId) {
        this.storeService
          .updateProduct(this.productId, title, description, stock, price)
          ?.subscribe(() => this.createdOrUpdated.emit());
      }
    }
  }
}
