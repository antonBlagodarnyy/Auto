import { Component, inject, output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { IProduct } from '../../../Interfaces/IProduct';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';

type ProductFormModel = Omit<IProduct, 'stock' | 'price'> & {
  stock: string;
  price: string;
};

@Component({
  selector: 'app-product-form',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
  ],
  templateUrl: './product-form.component.html',
  styles: `form {
    display: flex;
     flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  mat-form-field{
     width:100%;
  padding: 0.5rem;
  }
  `,
})
export class ProductFormComponent {
  constructor(private snackBar: MatSnackBar) {}
  private dialogRef = inject(MatDialogRef<ProductFormComponent>, {
    optional: true,
  });
  readonly oldProduct = inject<IProduct>(MAT_DIALOG_DATA, { optional: true });
  readonly parsedOldProduct: ProductFormModel | null = this.oldProduct
    ? {
        ...this.oldProduct,
        stock: String(this.oldProduct.stock),
        price: String(this.oldProduct.price),
      }
    : null;

  //Outputs
  createdEvent = output<{
    title: string;
    description: string;
    stock: number;
    price: number;
  }>();

  //Should be edited or created
  editMode: boolean = !!this.oldProduct;

  productForm = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl(''),
    stock: new FormControl('', Validators.required),
    price: new FormControl('', Validators.required),
  });

  ngOnInit() {
    if (this.editMode && this.parsedOldProduct) {
      // Initialize form with dialog data
      this.productForm.patchValue(this.parsedOldProduct);
    }
  }

  onSubmit() {
    if (this.productForm.valid) {
      if (!this.editMode) {
        const { title, description, stock, price } = this.productForm.value;
        if (title && description && stock && price) {
          this.dialogRef?.close({
            newProduct: {
              title: title,
              description: description,
              stock: stock,
              price: price,
            },
          });
        }
      } else {
        if (this.parsedOldProduct) {
          const newValues = this.productForm.value;

          if (
            this.parsedOldProduct.title != newValues.title ||
            this.parsedOldProduct.description != newValues.description ||
            this.parsedOldProduct.stock != newValues.stock ||
            this.parsedOldProduct.price != newValues.price
          ) {
            const changedValues = [];
            if (
              newValues.title &&
              this.parsedOldProduct.title != newValues.title
            )
              changedValues.push({ key: 'title', value: newValues.title });
            if (
              newValues.description &&
              this.parsedOldProduct.description != newValues.description
            )
              changedValues.push({
                key: 'description',
                value: newValues.description,
              });
            if (
              newValues.stock &&
              this.parsedOldProduct.stock != newValues.stock
            )
              changedValues.push({ key: 'stock', value: newValues.stock });
            if (
              newValues.price &&
              this.parsedOldProduct.price != newValues.price
            )
              changedValues.push({ key: 'price', value: newValues.price });

            this.dialogRef?.close({
              productId: this.parsedOldProduct.id,
              changedValues,
            });
          } else
            this.snackBar.open('Form was not changed.', '', {
              duration: 1000,
            });
        }
      }
    }
  }
}
