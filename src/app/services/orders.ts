import { Injectable, signal, computed } from '@angular/core';
import { Auth } from './auth';

export interface Order {
  id: number;
  items: Array<{
    product: string;
    qty: number;
    price: number;
  }>;
  total: number;
  payment: 'visa' | 'cash';
  name: string;
  address: string;
  phone: string;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  date: string;
}

@Injectable({ providedIn: 'root' })
export class Orders {
  private key = 'ecom_orders';
  private orders = signal<Record<string, Order[]>>(this.load());

  constructor(private auth: Auth) {}

  private load(): Record<string, Order[]> {
    try {
      const raw = localStorage.getItem(this.key);
      return raw ? JSON.parse(raw) as Record<string, Order[]> : {};
    } catch {
      return {};
    }
  }

  private persist() {
    localStorage.setItem(this.key, JSON.stringify(this.orders()));
  }

  getOrders(): Order[] {
    const user = this.auth.getUser();
    if (!user) return [];
    const userOrders = this.orders()[user.email] || [];
    return userOrders;
  }

  addOrder(orderData: Omit<Order, 'id' | 'date' | 'status'>) {
    const user = this.auth.getUser();
    if (!user) return;
    const userOrders = this.orders()[user.email] || [];
    const newId = userOrders.length > 0 ? Math.max(...userOrders.map(o => o.id)) + 1 : 1;
    const newOrder: Order = {
      ...orderData,
      id: newId,
      date: new Date().toLocaleDateString(),
      status: 'Processing'
    };
    const updated = { ...this.orders(), [user.email]: [...userOrders, newOrder] };
    this.orders.set(updated);
    this.persist();

    // Auto update status after 10s
    setTimeout(() => {
      const currentOrders = this.orders();
      const userOrders = currentOrders[user.email] || [];
      const updatedUserOrders = userOrders.map(o => o.id === newId ? { ...o, status: 'Delivered' as const } : o);
      const updatedAll = { ...currentOrders, [user.email]: updatedUserOrders };
      this.orders.set(updatedAll);
      this.persist();
    }, 10000);
  }

  updateStatus(orderId: number, status: Order['status']) {
    const user = this.auth.getUser();
    if (!user) return;
    const userOrders = this.orders()[user.email] || [];
    const updatedOrders = userOrders.map(o => o.id === orderId ? { ...o, status } : o);
    const updated = { ...this.orders(), [user.email]: updatedOrders };
    this.orders.set(updated);
    this.persist();
  }

  getAllOrders(): Order[] {
    return Object.values(this.orders()).flat();
  }
}
