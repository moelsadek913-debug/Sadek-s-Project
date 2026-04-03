import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Orders } from '../../services/orders';
import { Auth } from '../../services/auth';

interface SimpleOrder {
  id: number;
  total: number;
  status: string;
  date: string;
}

@Component({
  standalone: true,
  selector: 'app-orders',
  imports: [CommonModule, RouterModule],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
})
export class OrdersPage {
  ordersSvc = inject(Orders);
  auth = inject(Auth);

  readonly orders = computed(() => this.ordersSvc.getOrders() as SimpleOrder[]);

  trackById(index: number, order: SimpleOrder) {
    return order.id;
  }

  getStatusBadge(status: string) {
    const badges = {
      'Processing': 'warning',
      'Shipped': 'info',
      'Delivered': 'success',
      'Cancelled': 'danger'
    };
    return `bg-${badges[status as keyof typeof badges] || 'secondary'}`;
  }
}

