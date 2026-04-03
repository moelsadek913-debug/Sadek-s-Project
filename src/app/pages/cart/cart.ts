import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Cart, CartItem } from '../../services/cart';

@Component({
  standalone: true,
  selector: 'app-cart',
  imports: [CommonModule],
  templateUrl: './cart.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartPage {
  cart = inject(Cart);
  readonly itemsList = this.cart.itemsSignal;
  readonly items = computed(() => this.itemsList());
  readonly total = computed(() => this.itemsList().reduce((s: number, i: CartItem) => s + i.qty * (i.product.price || 0), 0));

  remove(id: number) {
    this.cart.remove(id);
  }

  clear() {
    this.cart.clear();
  }

  increase(id: number) {
    const it = this.itemsList().find(i => i.product.id === id);
    if (!it) return;
    this.cart.updateQty(id, it.qty + 1);
  }

  decrease(id: number) {
    const it = this.itemsList().find(i => i.product.id === id);
    if (!it) return;
    this.cart.updateQty(id, it.qty - 1);
  }
}

