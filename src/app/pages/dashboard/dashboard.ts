import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';
import { Orders } from '../../services/orders';
import { Wishlist } from '../../services/wishlist';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  orders = inject(Orders);
  userEmail = '';
  userRole: 'buyer' | 'seller' = 'buyer';
  recentOrders: any[] = [];

  wishlistItems: any[] = [];
  wishlistService = inject(Wishlist);
  auth = inject(Auth);
  router = inject(Router);
  statsLabels = [
    { label: 'Total Sales', value: '' },
    { label: 'Total Orders', value: '' },
    { label: 'Total Revenue', value: '' },
    { label: 'Total Users', value: '' }
  ];
  salesChart: any[] = [];

  ngOnInit() {
    const u = this.auth.getUser();
    if (!u) {
      this.router.navigate(['/login']);
      return;
    }
    this.userEmail = u.email;
    this.userRole = u.role;

    this.wishlistItems = this.wishlistService.getItems();
    this.recentOrders = this.orders.getOrders().slice(0, 3);

    if (this.userRole === 'seller') {
      const allOrders = this.orders.getAllOrders();
      const totalOrders = allOrders.length;
      const totalRevenue = allOrders.reduce((sum: number, o: any) => sum + o.total, 0).toFixed(0);
      const totalSales = allOrders.reduce((sum: number, o: any) => sum + o.items.reduce((s: number, i: any) => s + i.qty, 0), 0);
      const totalUsers = Object.keys((this.orders as any)()).length;
      this.statsLabels = [
        { label: 'Total Sales', value: totalSales.toString() },
        { label: 'Total Orders', value: totalOrders.toString() },
        { label: 'Total Revenue', value: `$${totalRevenue}` },
        { label: 'Total Users', value: totalUsers.toString() }
      ];
    }
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  removeFromWishlist(id: number) {
    this.wishlistService.remove(id);
    this.wishlistItems = this.wishlistService.getItems();
  }

}
