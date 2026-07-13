import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './component/navbar/navbar';
import {Sidemenu} from './component/sidemenu/sidemenu';
import {Main} from './pages/main/main';
import {Footer} from './component/footer/footer';
import { Product } from './models/product.model';
import { Shop } from './pages/shop/shop';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Sidemenu, Main, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  product?: Product;

updateProducts(product: Product) {
this.product = product;
}

  onActivate(component: any) {
    // Only Shop has a `cart` output — guard for other routed components
    if (component instanceof Shop) {
      component.cart.subscribe((product: Product) => {
        this.updateProducts(product);
      });
    }
  }
  protected readonly title = signal('webshop');
}
