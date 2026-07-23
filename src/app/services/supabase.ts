import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { from, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  // GET all products
  getProducts(): Observable<Product[]> {
    return from(
      this.supabase
        .from('products')
        .select('*')
        .then(({ data, error }) => {
          if (error) throw error;
          return data as Product[];
        })
    );
  }

  // GET products filtered by category
  getProductsByCategory(category: string): Observable<Product[]> {
    return from(
      this.supabase
        .from('products')
        .select('*')
        .eq('category', category)
        .then(({ data, error }) => {
          if (error) throw error;
          return data as Product[];
        })
    );
  }

  // GET single product by id
  getProduct(id: number): Observable<Product> {
    return from(
      this.supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()
        .then(({ data, error }) => {
          if (error) throw error;
          return data as Product;
        })
    );
  }

  // CREATE a product
  createProduct(product: Partial<Product>): Observable<Product> {
    return from(
      this.supabase
        .from('products')
        .insert(product)
        .select()
        .single()
        .then(({ data, error }) => {
          if (error) throw error;
          return data as Product;
        })
    );
  }

  // UPDATE a product
  updateProduct(product: Product): Observable<Product> {
    const { id, ...updateData } = product;
    return from(
      this.supabase
        .from('products')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()
        .then(({ data, error }) => {
          if (error) throw error;
          return data as Product;
        })
    );
  }

  // DELETE a product
  deleteProduct(id: number): Observable<void> {
    return from(
      this.supabase
        .from('products')
        .delete()
        .eq('id', id)
        .then(({ error }) => {
          if (error) throw error;
        })
    );
  }

  // Get public image URL from Supabase Storage
  getImageUrl(filename: string, bucket: string = 'webshop-pictures'): string {
    const { data } = this.supabase.storage.from(bucket).getPublicUrl(filename);
    return data.publicUrl;
  }
}