import { Injectable, signal, computed, effect } from '@angular/core';
import { ProductItem } from './product';

@Injectable({ providedIn: 'root' })
export class Wishlist {
  private key = 'ecom_wishlist';
  private items = signal<ProductItem[]>(this.load());
  readonly itemsSignal = this.items.asReadonly();
  readonly count = computed(() => this.items().length);

  private persistTimeout: any = null;

  constructor() {
    effect(() => {
      if (this.persistTimeout) clearTimeout(this.persistTimeout);
      this.persistTimeout = setTimeout(() => this.persist(), 300);
    });
  }

  private load(): ProductItem[] {
    try {
      const raw = localStorage.getItem(this.key);
      return raw ? JSON.parse(raw) as ProductItem[] : [];
    } catch {
      return [];
    }
  }

  private persist() {
    localStorage.setItem(this.key, JSON.stringify(this.items()));
  }

  getItems() { return this.itemsSignal(); }

  toggle(product: ProductItem) {
    const existing = this.items().find(i => i.id === product.id);
    if (existing) {
      this.items.set(this.items().filter(i => i.id !== product.id));
    } else {
      this.items.set([...this.items(), product]);
    }
  }

  remove(productId: number) {
    this.items.set(this.items().filter(i => i.id !== productId));
  }

  isInWishlist(productId: number) {
    return this.items().some(i => i.id === productId);
  }
}
