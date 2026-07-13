import { Component, DestroyRef, signal, inject, computed, Output, EventEmitter } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'shop',
  imports: [],
  templateUrl: './shop.html',
  styleUrl: './shop.css',
})
export class Shop {

  @Output() cart = new EventEmitter<Product>();
  products = signal<Product[]>([]);
  displayedProducts = signal<Product[]>([]);
  product?: Product;
  selectedProduct?: Product;
  private destroyRef = inject(DestroyRef);

  categories = computed(() => {
    const allCategories = this.products().map(p => p.category);
    return [...new Set(allCategories)];
  });

  private readonly categoryImages: Record<string, string> = {
    'Audio': 'apple_kopfhörer.jpg',
    'Smartphones': 'phone.webp',
    'Laptops': 'laptop-3.webp',
    'Tablets': 'tablet.jpg',
    'Wearables': 'watch.webp',
    'Accessories': 'mouse.webp',
    'Monitors': 'monitor.webp',
    'Gaming': 'gaming.jpg',
    'Drones': 'drone.webp',
    'Cameras': 'camera.jpg',
    'E-Readers': 'ereader.avif',
  };

  constructor(private productService: ProductService) { }

  closeFilter() {
    const container = document.getElementById('filter-container');
    if (container) { container.classList.remove('visible'); }
    const self = document.getElementById('action-container');
    if (self) { self.style.display = 'flex'; }
    this.loadProducts();
  }
  openFilter() {
    const container = document.getElementById('filter-container');
    if (container) { container.classList.add('visible'); }
    const self = document.getElementById('action-container');
    if (self) { self.style.display = 'none'; }
  }

  startFilter(name: string, price: string, category: string) {
    let sorted: Product[] = [];
    sorted = [...this.products()];
    sorted = sorted.filter(sorted => sorted.name.toLowerCase().includes(name.toLowerCase()))
      .filter(sorted => sorted.category.toLowerCase().includes(category.toLowerCase()));
    if (price == "asc") {
      sorted.sort((a, b) => a.price - b.price )
    } else if (price == "dsc") {
        sorted.sort((a, b) => b.price - a.price )
    }
    this.displayedProducts.set(sorted);
    console.log("filtering done");
  }

  openUpdateProduct() {
    const container = document.getElementById('updateProduct-container');
    if (container) { container.classList.add('visible'); }
    const self = document.getElementById('action-container');
    if (self) { self.style.display = 'none'; }
  }

  closeUpdateProduct() {
    const container = document.getElementById('updateProduct-container');
    if (container) { container.classList.remove('visible'); }
    this.selectedProduct = undefined;
    const self = document.getElementById('action-container');
    if (self) { self.style.display = 'flex'; }
  }

  updateSelectedProduct(name: string, category: string, price: number, description: string) {
    if (!this.selectedProduct) return;

    const updated: Product = {
      ...this.selectedProduct,
      name, category, price, description
    };

    this.productService.update(updated).subscribe({
      next: (result) => {
        console.log('Updated:', result);
        this.loadProducts();
      },
      error: (err) => console.error('Failed to update', err)
    });
  }

  onProductSelected(idStr: string) {
    const id = Number(idStr);
    this.selectedProduct = this.products().find(p => p.id === id);
    console.log('Selected:', this.selectedProduct);
  }

  closeNewProduct() {
    const container = document.getElementById('newProduct-container');
    if (container) { container.style.display = 'none'; }
    const self = document.getElementById('action-container');
    if (self) { self.style.display = 'flex'; }
  }

  openNewProduct() {
    const container = document.getElementById('newProduct-container');
    if (container) { container.style.display = 'flex'; }
    const self = document.getElementById('action-container');
    if (self) { self.style.display = 'none'; }
  }

  imageFor(product: Product): string {
    const filename = this.categoryImages[product.category] ?? 'placeholder.webp';
    return `/resources/${filename}`;
  }

  onRightClick(event: MouseEvent, product: Product): void {
    event.preventDefault();
    this.deleteProduct(product);
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  //getAll
  loadProducts(): void {
    const subscription = this.productService.getAll().subscribe({
      next: (data) => {
        this.products.set(data._embedded.productList);
        this.displayedProducts.set(data._embedded.productList);
      },
      error: (err) => console.error('Failed to load products:', err)
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    })
  }

  //getOne
  loadProduct(id: number): void {
    const subscription = this.productService.getProduct(id).subscribe({
      next: (product) => this.product = product,
      error: (err) => console.error('Failed to load product:', err)
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    })
  }

  //post
  createProduct(product: Product): void {
    const { id, ...productData } = product;
    console.log('Creating from:', productData);

    const subscription = this.productService.create(productData as Product).subscribe({
      next: (result) => {
        console.log('Created:', result);
        this.loadProducts();
      },
      error: (err) => console.error('Failed:', err)
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    })
  }

  //delete
  deleteProduct(product: Product): void {
    if (product.id === undefined) {
      console.error('Product has no id.');
      return;
    }

    const subscription = this.productService.delete(product).subscribe({
      next: () => this.loadProducts(),
      error: (err: HttpErrorResponse) =>
        console.error('Failed to delete:', err)
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    })
  }

  //put
  updateProduct(product: Product): void {
    const subscription = this.productService.update(product).subscribe({
      next: (result) => {
        console.log('Updated:', result);
        this.loadProducts();
      },
      error: (err) => console.error('Failed:', err)
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    })
  }

  onSubmit(product: Product) {
    this.cart.emit(product);
  }
}