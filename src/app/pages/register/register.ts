import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';
import { CommonModule } from '@angular/common';
import { Toast } from '../../services/toast';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  error = '';
  emailError = '';
  passwordError = '';
  constructor(private auth: Auth, private router: Router, private toast: Toast) {}

  async register(email: string, password: string, role: 'buyer' | 'seller') {
    this.error = '';
    this.emailError = '';
    this.passwordError = '';
    if (!email) this.emailError = 'Email is required';
    if (!password) this.passwordError = 'Password is required';
    if (this.emailError || this.passwordError) return;

    try {
      await this.auth.register(email, password, role);
      this.toast.show(`Account created as ${role}`, 'success');
      this.router.navigate(['/dashboard']);
    } catch (err: any) {
      const msg = err?.message || 'Registration failed';
      this.error = msg;
      this.toast.show(msg, 'error');
    }
  }
}
