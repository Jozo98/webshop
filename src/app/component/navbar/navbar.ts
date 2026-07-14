import { Component, computed, effect, EventEmitter, Input, Output, signal, SimpleChanges } from '@angular/core';
import { Product } from '../../models/product.model';
import { Router } from '@angular/router';

interface CartItem {
  product: Product;
  quantity: number;
}

@Component({
  selector: 'navbar',
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  @Input() product?: Product;

  cartItems = signal<CartItem[]>(this.loadCart());
  isCartOpen = signal(false);
  @Output() checkout = new EventEmitter<number>();

  totalPrice = computed(() =>
    this.cartItems().reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  );

  totalCount = computed(() =>
    this.cartItems().reduce((sum, item) => sum + item.quantity, 0)
  );

  constructor(private router: Router) {
    // 2. Automatically save to sessionStorage whenever cartItems changes
    effect(() => {
      sessionStorage.setItem('cartItems', JSON.stringify(this.cartItems()));
    });
  }

  // Helper method to safely read and parse the session data
  private loadCart(): CartItem[] {
    const saved = sessionStorage.getItem('cartItems');
    return saved ? JSON.parse(saved) : [];
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['product'] && this.product) {
      this.addProduct(this.product);
    }

  }

  addProduct(product: Product) {
    this.cartItems.update(items => {
      const existing = items.find(i => i.product.id === product.id);
      if (existing) {
        return items.map(i =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...items, { product, quantity: 1 }];
    });
  }

  removeItem(product: Product) {
    this.cartItems.update(items => items.filter(i => i.product.id !== product.id));
  }

  resetCart() {
    this.cartItems.update(items => items.filter(i => i.product.id == -10));
  }

  decrementItem(product: Product) {
    this.cartItems.update(items =>
      items
        .map(i => i.product.id === product.id ? { ...i, quantity: i.quantity - 1 } : i)
        .filter(i => i.quantity > 0)
    );
  }

  toggleCart() {
    this.isCartOpen.update(open => !open);
  }

  closeCart() {
    this.isCartOpen.set(false);
  }

  onSubmit() {
  this.checkout.emit(this.totalPrice());
  this.resetCart();
  this.closeCart();
}
}