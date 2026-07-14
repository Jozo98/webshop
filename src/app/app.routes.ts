import { Routes } from '@angular/router';
import { Main } from './pages/main/main';
import { Shop } from './pages/shop/shop';
import { Checkout } from './pages/checkout/checkout';
import { CheckoutSuccess } from './pages/checkout-success/checkout-success';

export const routes: Routes = [
  { path: '', component: Main },
  { path: 'shop', component: Shop },
  { path: 'checkout', component: Checkout },
  { path: 'checkout/success', component: CheckoutSuccess },
];