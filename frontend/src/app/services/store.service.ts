import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';
import { Product } from '../dashboard/store/product.model';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  constructor(private http: HttpClient) {}

  getProducts() {
      return this.http.get<{
        results: Product[];
      }>(environment.apiUrl + '/store/get');
 
  }

  createProduct(
    title: string,
    description: string,
    stock: number,
    price: number
  ) {
      const productData = {
        title: title,
        description: description,
        stock: stock,
        price: price,
      };
      return this.http.post<{
        product: {
          productId: number;
          title: string;
          description: string;
          stock: number;
          price: number;
        };
      }>(environment.apiUrl + '/store/create', productData);
  }

  deleteProduct(id: number) {

      return this.http.delete<{ message: string }>(
        environment.apiUrl + '/store/delete',
        { params: { productId: id } }
      );
  }

  updateProduct(
    id: number,
    title: string,
    description: string,
    stock: number,
    price: number
  ) {
      const productData = {
        productId: id,
        title: title,
        description: description,
        stock: stock,
        price: price,
      };
      return this.http.put<{
        product: {
          productId: number;
          title: string;
          description: string;
          stock: number;
          price: number;
        };
      }>(environment.apiUrl + '/store/update', productData);
  }
}
