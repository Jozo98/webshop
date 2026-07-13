import { Component, Input, signal, SimpleChanges } from '@angular/core';
import { Product } from '../../models/product.model';

@Component({
  selector: 'navbar',
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
removeItem(product: Product) {
  this.products.update(products => products.filter(p => p.id !== product.id));
}

  @Input() product?: Product;
  products = signal<Product[]>([]);
  isCartOpen = signal(false);

  ngOnChanges(changes: SimpleChanges) {
    if (changes['product'] && this.product) {
      this.products.update(products => [...products, this.product!]);
      console.log(this.products().length);
    }
  }

  toggleCart() {
    this.isCartOpen.update(open => !open);
  }

  closeCart() {
    this.isCartOpen.set(false);
  }

  removeProduct(id: number) {
    this.products.update(products => products.filter(p => p.id !== id));
  }
}
