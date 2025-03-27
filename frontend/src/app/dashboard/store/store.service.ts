import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../../Auth/Auth.service';
import { environment } from '../../../environments/environment.development';
import { Product } from './product.model';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  getProducts() {
    const userId = this.authService.user.getValue()?.userId;
    if (userId) {
      return this.http.get<{
        results: Product[];
      }>(environment.apiUrl + '/store/get', { params: { userId: userId } });
    } else return null;
  }

  createProduct(
    title: string,
    description: string,
    stock: number,
    price: number
  ) {
    const userId = this.authService.user.getValue()?.userId;
    if (userId) {
      const productData = {
        userId: userId,
        title: title,
        description: description,
        stock: stock,
        price: price,
      };
      return this.http.post<{
        product: {
          productId: number;
          title: string;
        //TODO may be needed userId: number;
          description: string;
          stock: number;
          price: number;
        };
      }>(environment.apiUrl + '/store/create', productData);
    } else {
      return null;
    }
  }
}
