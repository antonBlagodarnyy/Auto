import { Component, inject, input, output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { StoreService } from '../../../services/store.service';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

export interface DialogData {
  id: number;
  title: string;
  description: string;
  stock: string;
  price: string;
}

@Component({
  selector: 'app-product-form',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
  ],
  templateUrl: './product-form.component.html',
  styles: `form {
  display: flex;
  justify-content: space-around;
}
`,
})
export class ProductFormComponent {
  constructor(private storeService: StoreService) {}
  private dialogRef = inject(MatDialogRef, { optional: true });
  data = inject<DialogData>(MAT_DIALOG_DATA, { optional: true });

  isDialog = !!this.dialogRef;

  createdOrUpdated = output();

  productForm = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl(''),
    stock: new FormControl('', Validators.required),
    price: new FormControl('', Validators.required),
  });

  ngOnInit() {
    if (this.isDialog && this.data) {
      // Initialize form with dialog data
      this.productForm.patchValue(this.data);
    }
  }

  onSubmit() {
    if (this.productForm.valid) {
      if (!this.data) {
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
      } else {
        let productId = this.data?.id;

        let title = this.productForm.value.title
          ? this.productForm.value.title
          : this.data?.title;

        let description = this.productForm.value.description
          ? this.productForm.value.description
          : this.data?.description;

        let stock = this.productForm.value.stock
          ? +this.productForm.value.stock
          : this.data?.stock;

        let price = this.productForm.value.price
          ? +this.productForm.value.price
          : this.data?.price;

        if (title && description && stock && price && productId) {
          this.storeService
            .updateProduct(productId, title, description, +stock, +price)
            ?.subscribe(() => this.dialogRef?.close());
        }
      }
    }
  }
}
