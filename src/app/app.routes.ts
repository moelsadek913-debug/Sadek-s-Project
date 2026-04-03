import { Routes } from '@angular/router';
import { AuthGuard } from './services/auth-guard';

export const routes: Routes = [
	{ path: '', loadComponent: () => import('./pages/home/home').then(m => m.Home) },
	{ path: 'home', loadComponent: () => import('./pages/home/home').then(m => m.Home) },
	{ path: 'login', loadComponent: () => import('./pages/login/login').then(m => m.Login) },
	{ path: 'register', loadComponent: () => import('./pages/register/register').then(m => m.Register) },
	{ path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.Dashboard), canActivate: [AuthGuard] },
	{ path: 'product/:id', loadComponent: () => import('./pages/product-details/product-details').then(m => m.ProductDetails) },
	{ path: 'cart', loadComponent: () => import('./pages/cart/cart').then(m => m.CartPage) },
	{ path: 'checkout', redirectTo: '/checkout-form', pathMatch: 'full' },
	{ path: 'checkout-form', loadComponent: () => import('./pages/checkout-form/checkout-form').then(m => m.CheckoutForm) },
	{ path: 'wishlist', loadComponent: () => import('./pages/wishlist/wishlist').then(m => m.WishlistPage), canActivate: [AuthGuard] },
	{ path: 'orders', loadComponent: () => import('./pages/orders/orders').then(m => m.OrdersPage), canActivate: [AuthGuard] },
	{ path: '**', redirectTo: '' },
];
