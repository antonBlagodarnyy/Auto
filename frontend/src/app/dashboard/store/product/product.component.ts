import { Component, input, output } from '@angular/core';
import { Product } from '../product.model';

@Component({
  selector: 'app-product',
  imports: [],
  template: `<tr>
    <td>{{ product()?.title }}</td>
    <td>{{ product()?.description }}</td>
    <td>{{ product()?.stock }}</td>
    <td>{{ product()?.price }}</td>
    <td>
      <button>Edit</button
      ><button (click)="deleteProduct(product()?.id)">Delete</button>
    </td>
  </tr> `,
  styleUrl: '../store.component.css',
})
export class ProductComponent {
  product = input<Product>();
  productDeleteId = output<number>();

  deleteProduct(productId: number|undefined){
    if(productId != undefined){
      this.productDeleteId.emit(productId);
    }
  }
}
