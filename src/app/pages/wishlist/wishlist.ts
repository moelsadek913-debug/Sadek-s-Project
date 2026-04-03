import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Wishlist } from '../../services/wishlist';
import { Cart } from '../../services/cart';
import { ProductItem } from '../../services/product';

@Component({
  standalone: true,
  selector: 'app-wishlist',
  imports: [CommonModule, RouterModule],
  templateUrl: './wishlist.html',
  styleUrl: './wishlist.css',
})
export class WishlistPage {
  wishlist = inject(Wishlist);
  cart = inject(Cart);

  readonly items = computed(() => this.wishlist.itemsSignal());

  addToCart(item: ProductItem) {
    this.cart.add(item, 1);
  }

  trackById(index: number, item: ProductItem) {
    return item.id;
  }
}

