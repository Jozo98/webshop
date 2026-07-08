import { Routes } from '@angular/router';
import { Main } from './pages/main/main';
import { Shop} from './pages/shop/shop'

export const routes: Routes = [
  { path: '', component: Main },
  { path: 'shop', component: Shop }
];