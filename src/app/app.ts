import { Component } from '@angular/core';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Cart } from './services/cart';
import { Auth } from './services/auth';
import { ToastsComponent } from './components/toasts/toasts';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [CommonModule, RouterModule, RouterOutlet, ToastsComponent],
  template: `
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container-fluid">
        <a class="navbar-brand" routerLink="/">E-Shop</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="#navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto align-items-center">
            <li class="nav-item"><a class="nav-link" routerLink="/">Home</a></li>
            <li class="nav-item"><a class="nav-link" routerLink="/cart">Cart <span class="badge bg-primary ms-1">{{ cart.count() }}</span></a></li>
            <li class="nav-item"><a class="nav-link" routerLink="/login">Login</a></li>
            <li class="nav-item"><a class="nav-link" routerLink="/register">Register</a></li>
            <li class="nav-item"><a class="nav-link" routerLink="/dashboard">Dashboard</a></li>
          </ul>
        </div>
      </div>
    </nav>

    <main class="container mt-4">
      <router-outlet></router-outlet>
    </main>
    <app-toasts></app-toasts>
  `
})
export class App {
  constructor(public cart: Cart, public auth: Auth, private router: Router) {}
}

