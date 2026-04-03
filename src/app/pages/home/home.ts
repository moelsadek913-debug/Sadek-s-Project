import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { Product, ProductItem } from '../../services/product';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Cart } from '../../services/cart';
import { Wishlist } from '../../services/wishlist';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Home implements OnInit {
  private productSvc = inject(Product);
  cart = inject(Cart);
  wishlist = inject(Wishlist);
  products: ProductItem[] = [
    {
      id: 1,
      title: 'Classic Sneakers',
      price: 59.99,
      description: 'Comfortable everyday sneakers.',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff'
    },
    {
      id: 2,
      title: 'Leather Backpack',
      price: 129.99,
      description: 'Durable leather backpack.',
      image: 'https://kamrette.com/cdn/shop/products/Lyra-Camera-Bag-Front-Tan.jpg?v=1747189957'
    },
    {
      id: 3,
      title: 'Wireless Headphones',
      price: 89.99,
      description: 'Noise-cancelling headphones.',
      image: 'https://m.media-amazon.com/images/I/61kFsU+CYkL._AC_UF894,1000_QL80_.jpg'
    }
  ];

  filtered: ProductItem[] = [];
  loading = false;

  ngOnInit() {
    this.filtered = [...this.products];
  }

  trackById(index: number, item: ProductItem) {
    return item.id;
  }

  onSearch(value: string) {
    const q = value?.trim().toLowerCase() || '';
    if (!q) {
      this.filtered = [...this.products];
    } else {
      this.filtered = this.products.filter(p => p.title.toLowerCase().includes(q));
    }
  }

  addToCart(p: ProductItem) {
    this.cart.add(p, 1);
  }

  toggleWishlist(p: ProductItem) {
    this.wishlist.toggle(p);
  }
}

