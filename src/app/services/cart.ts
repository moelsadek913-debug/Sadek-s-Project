import { Injectable, signal, computed, effect } from '@angular/core';
import { ProductItem } from './product';

export interface CartItem {
  product: ProductItem;
  qty: number;
}

@Injectable({ providedIn: 'root' })
export class Cart {
  private key = 'ecom_cart';
  private items = signal<CartItem[]>(this.load());
  readonly itemsSignal = this.items.asReadonly();
  readonly count = computed(() => this.items().reduce((s, i) => s + i.qty, 0));

  private persistTimeout: any = null;

  constructor() {
    effect(() => {
      if (this.persistTimeout) clearTimeout(this.persistTimeout);
      this.persistTimeout = setTimeout(() => this.persist(), 300);
    });
  }

  private load(): CartItem[] {
    try {
      const raw = localStorage.getItem(this.key);
      return raw ? JSON.parse(raw) as CartItem[] : [];
    } catch {
      return [];
    }
  }

  private persist() {
    localStorage.setItem(this.key, JSON.stringify(this.items()));
  }

  getItems() { return this.itemsSignal(); }

  add(product: ProductItem, qty = 1) {
    const existing = this.items().find(i => i.product.id === product.id);
    if (existing) {
      this.items.set(this.items().map(i => i.product.id === product.id ? { ...i, qty: i.qty + qty } : i));
    } else {
      this.items.set([...this.items(), { product, qty }]);
    }
  }

  remove(productId: number) {
    this.items.set(this.items().filter(i => i.product.id !== productId));
  }

  clear() {
    this.items.set([]);
  }

  updateQty(productId: number, qty: number) {
    if (qty <= 0) {
      this.remove(productId);
      return;
    }
    this.items.set(this.items().map(i => i.product.id === productId ? { ...i, qty } : i));
  }
}
