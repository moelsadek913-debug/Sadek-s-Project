import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Cart } from '../../services/cart';
import { Orders } from '../../services/orders';
import { Auth } from '../../services/auth';
import { Toast } from '../../services/toast';

interface OrderForm {
  name: string;
  phone: string;
  address: string;
  payment: 'visa' | 'cash';
}

@Component({
  standalone: true,
  selector: 'app-checkout-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout-form.html',
  styleUrl: './checkout-form.css',
})
export class CheckoutForm {
  cart = inject(Cart);
  orders = inject(Orders);
  auth = inject(Auth);
  router = inject(Router);
  toast = inject(Toast);

  form: OrderForm = {
    name: '',
    phone: '',
    address: '',
    payment: 'visa',
  };

  readonly cartItems = computed(() => this.cart.getItems());
  readonly cartTotal = computed(() => this.cartItems().reduce((s, i) => s + i.qty * i.product.price, 0));

  onSubmit() {
    if (!this.form.name || !this.form.phone || !this.form.address) {
      this.toast.show('Please fill all fields', 'error');
      return;
    }

    if (this.cartItems().length === 0) {
      this.toast.show('Cart is empty', 'error');
      return;
    }

    const user = this.auth.getUser();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    const items = this.cartItems().map(i => ({
      product: i.product.title,
      qty: i.qty,
      price: i.product.price,
    }));

    this.orders.addOrder({
      ...this.form,
      items,
      total: this.cartTotal(),
      name: this.form.name,
    });

    this.cart.clear();
    this.toast.show('Order placed successfully!', 'success');
    this.router.navigate(['/orders']);
  }
}

