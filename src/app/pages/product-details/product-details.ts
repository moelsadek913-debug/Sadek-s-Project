import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Cart } from '../../services/cart';
import { Wishlist } from '../../services/wishlist';

interface ProductItem {
  id: number;
  title: string;
  price: number;
  description: string;
  image: string;
}

@Component({
  standalone: true,
  selector: 'app-product-details',
  imports: [CommonModule, RouterModule],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetails {
  route = inject(ActivatedRoute);
  cart = inject(Cart);
  wishlist = inject(Wishlist);

  qty = 1;

  get product(): ProductItem {
    const products: ProductItem[] = [
      {
        id: 1,
        title: 'Classic Sneakers',
        price: 59.99,
        description: 'Comfortable everyday sneakers with premium cushioning.',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff'
      },
      {
        id: 2,
        title: 'Leather Backpack',
        price: 129.99,
        description: 'Durable genuine leather backpack with multiple compartments.',
        image: 'https://kamrette.com/cdn/shop/products/Lyra-Camera-Bag-Front-Tan.jpg?v=1747189957'
      },
      {
        id: 3,
        title: 'Wireless Headphones',
        price: 89.99,
        description: 'Premium wireless headphones with active noise cancellation.',
        image: 'https://m.media-amazon.com/images/I/61kFsU+CYkL._AC_UF894,1000_QL80_.jpg'
      }
    ];

    const idStr = this.route.snapshot.paramMap.get('id') || '1';
    const id = parseInt(idStr, 10);
    return products.find(p => p.id === id) || products[0];
  }

  onQtyChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.qty = Math.max(1, parseInt(target.value) || 1);
  }

  addToCart() {
    this.cart.add(this.product, this.qty);
  }

  toggleWishlist(product: any) {
    this.wishlist.toggle(product);
  }
}

