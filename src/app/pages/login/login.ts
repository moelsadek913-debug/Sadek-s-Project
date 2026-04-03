import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';
import { CommonModule } from '@angular/common';
import { Toast } from '../../services/toast';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  error = '';
  emailError = '';
  passwordError = '';
  constructor(private auth: Auth, private router: Router, private toast: Toast) {}

  async login(email: string, password: string) {
    this.error = '';
    this.emailError = '';
    this.passwordError = '';
    if (!email) this.emailError = 'Email is required';
    if (!password) this.passwordError = 'Password is required';
    if (this.emailError || this.passwordError) return;

    try {
      await this.auth.login(email, password);
      this.toast.show('Logged in successfully', 'success');
      this.router.navigate(['/dashboard']);
    } catch (err: any) {
      const msg = err?.message || 'Login failed';
      this.error = msg;
      this.toast.show(msg, 'error');
    }
  }
}
