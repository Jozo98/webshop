import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './component/navbar/navbar';
import {Sidemenu} from './component/sidemenu/sidemenu';
import {Main} from './pages/main/main';
import {Footer} from './component/footer/footer';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Sidemenu, Main, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('webshop');
}
