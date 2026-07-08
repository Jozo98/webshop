import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Product } from '../models/product.model';
import { CollectionModel } from '../models/EntityModel';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getAll(): Observable<CollectionModel<Product>> {
    return this.http.get<CollectionModel<Product>>(`${this.baseUrl}/products`);
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/products/${id}`);
  }

  create(product: Product): Observable<Product> {
    return this.http.post<Product>(`${this.baseUrl}/products`, product);
  }

  update(product: Product): Observable<Product> {
    return this.http.put<Product>(product._links!.self.href, product);
  }

  delete(product: Product): Observable<void> {
    return this.http.delete<void>(product._links!.self.href);
  }
}