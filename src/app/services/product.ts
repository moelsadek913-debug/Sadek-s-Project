import { Injectable } from '@angular/core';
import { Auth } from './auth';

export interface ProductItem {
  id: number;
  title: string;
  price: number;
  description?: string;
  image?: string;
}

@Injectable({
  providedIn: 'root',
})
export class Product {
  // Local fallback dataset (used if remote API fails)
  private products: ProductItem[] = [
    {
      id: 1,
      title: 'Classic Sneakers',
      price: 59.99,
      description: 'Comfortable everyday sneakers.',
      image: 'https://source.unsplash.com/600x400/?sneakers',
    },
    {
      id: 2,
      title: 'Leather Backpack',
      price: 129.99,
      description: 'Durable leather backpack for work and travel.',
      image: 'https://source.unsplash.com/600x400/?backpack,leather',
    },
    {
      id: 3,
      title: 'Wireless Headphones',
      price: 89.99,
      description: 'Noise-cancelling over-ear headphones.',
      image: 'https://source.unsplash.com/600x400/?headphones,audio',
    },
  ];

private api = 'https://dummyjson.com/products';

  constructor(private auth: Auth) {}

  async list(): Promise<ProductItem[]> {
    try {
      const res = await fetch(this.api);
      if (!res.ok) throw new Error('Failed to fetch products');
      const data = await res.json();
      return (data.products || []).map((p: any) => ({
        id: p.id,
        title: p.title,
        price: p.price,
        description: p.description,
        image: p.image || `https://source.unsplash.com/600x400/?product,${p.title.toLowerCase().replace(/\s+/g, ',')}`,
      })) as ProductItem[];
    } catch (e) {
      console.error('Product fetch error:', e);
      return this.products;
    }
  }


  async getById(id: number | string): Promise<ProductItem | undefined> {
    const nid = typeof id === 'string' ? parseInt(id, 10) : id;
    try {
      const headers: any = { 'Content-Type': 'application/json' };
      const token = this.auth.getToken?.();
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const res = await fetch(`${this.api}/${nid}`, { headers });
      if (!res.ok) throw new Error('Failed to fetch product');
      const p = await res.json(); if (p.message === 'Product not found') throw new Error('Product not found');
      return {
        id: p.id,
        title: p.title,
        price: p.price,
        description: p.description,
        image: p.image,
      } as ProductItem;
    } catch (e) {
      return Promise.resolve(this.products.find(p => p.id === nid));
    }
  }
}
