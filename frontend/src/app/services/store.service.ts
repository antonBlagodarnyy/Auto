import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { IProduct } from '../Interfaces/IProduct';
import { BehaviorSubject, map, switchMap, take, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  constructor(private http: HttpClient) {}

  private productsSubject = new BehaviorSubject<IProduct[]>([]);

  readonly products$ = this.productsSubject.asObservable();

  setProducts(products: IProduct[]) {
    this.productsSubject.next(products);
  }

  getStoredProducts$() {
    return this.http
      .get<{
        results: IProduct[];
      }>(environment.apiUrl + '/store/get')
      .pipe(map((res) => this.setProducts(res.results)));
  }

  addNewProduct$(newProduct: {
    title: string;
    description: string;
    stock: number;
    price: number;
  }) {
    return this.http
      .post<{
        productId: number;
      }>(environment.apiUrl + '/store/create', newProduct)
      .pipe(
        map((res) => {
          const current = this.productsSubject.value;
          this.productsSubject.next([
            { id: res.productId, ...newProduct },
            ...current,
          ]);
        })
      );
  }

  deleteProduct$(productId: number) {
    return this.http
      .delete(environment.apiUrl + '/store/delete', {
        body: { productId: productId },
        responseType: 'text',
      })
      .pipe(
        switchMap(() => this.productsSubject.pipe(take(1))),
        tap((products) => {
          this.productsSubject.next(products.filter((p) => p.id !== productId));
        })
      );
  }

  updateProduct$(
    productId: number,
    changedValues: { key: string; value: string }[]
  ) {
    return this.http
      .put(
        environment.apiUrl + '/store/update',
        { productId: productId, changedValues: changedValues },
        {
          responseType: 'text',
        }
      )
      .pipe(
        tap(() => {
          // Update local state directly
          const products = this.productsSubject.value;
          const updatedProducts = products.map((p) => {
            if (p.id === productId) {
              return {
                ...p,
                ...Object.fromEntries(
                  changedValues.map((cv) => [
                    cv.key,
                    cv.key === 'stock' || cv.key === 'price'
                      ? +cv.value
                      : cv.value,
                  ])
                ),
              };
            }
            return p;
          });
          this.productsSubject.next(updatedProducts);
        })
      );
  }
}
