import { Injectable } from '@angular/core';

export interface User {
  email: string;
  name?: string;
  role: 'buyer' | 'seller';
}

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private storageKey = 'ecom_user';
  private usersKey = 'ecom_users';
  private useRemoteAuth = true;
  private remoteLogin = 'https://dummyjson.com/auth/login';
  private remoteRegister = 'https://dummyjson.com/auth/register';
  private tokenKey = 'ecom_token';

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.storageKey);
  }

  async login(email: string, password: string): Promise<User> {
    // Try remote mock auth first. Default to 'buyer' role for remote.
    if (this.useRemoteAuth) {
      try {
        const res = await fetch(this.remoteLogin, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        if (res.ok) {
          const j = await res.json();
          const token = j?.token;
          if (token) {
            this.setToken(token);
            const user: User = { email, role: 'buyer' };
            localStorage.setItem(this.storageKey, JSON.stringify(user));
            return user;
          }
        } else {
          try {
            const errBody = await res.json();
            const msg = errBody?.error || errBody?.message || 'Invalid login credentials';
            return Promise.reject(new Error(msg));
          } catch (_e) {
            return Promise.reject(new Error('Invalid login credentials'));
          }
        }
      } catch (e) {
        // network error — continue to local fallback
      }
    }

    // Local fallback
    const usersRaw = localStorage.getItem(this.usersKey);
    const users = usersRaw ? JSON.parse(usersRaw) as Record<string, {password: string, role: 'buyer'|'seller'}> : {};
    const userCreds = users[email];
    if (!userCreds) return Promise.reject(new Error('No user found with that email'));
    if (userCreds.password !== password) return Promise.reject(new Error('Invalid password'));
    const user: User = { email, role: userCreds.role };
    const localToken = `local:${btoa(email)}`;
    this.setToken(localToken);
    localStorage.setItem(this.storageKey, JSON.stringify(user));
    return Promise.resolve(user);
  }

  async register(email: string, password: string, role: 'buyer' | 'seller'): Promise<User> {
    try {
      if (this.useRemoteAuth) {
        const res = await fetch(this.remoteRegister, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        if (res.ok) {
          const j = await res.json();
          const token = j?.token || `reg:${Date.now()}`;
          this.setToken(token);
          const user: User = { email, role: 'buyer' };
          localStorage.setItem(this.storageKey, JSON.stringify(user));
          return user;
        }
      }
    } catch (remoteErr) {
      console.warn('Remote register failed:', remoteErr);
    }
    // Local fallback
    const usersRaw = localStorage.getItem(this.usersKey);
    const users = usersRaw ? JSON.parse(usersRaw) as Record<string, {password: string, role: 'buyer'|'seller'}> : {};
    if (users[email]) return Promise.reject(new Error('User already exists'));
    users[email] = { password, role };
    localStorage.setItem(this.usersKey, JSON.stringify(users));
    const user: User = { email, role };
    localStorage.setItem(this.storageKey, JSON.stringify(user));
    const localToken = `local:${btoa(email)}`;
    this.setToken(localToken);
    return Promise.resolve(user);
  }

  setToken(token: string) {
    try { localStorage.setItem(this.tokenKey, token); } catch {}
  }

  getToken(): string | null {
    try { return localStorage.getItem(this.tokenKey); } catch { return null; }
  }

  clearToken() { try { localStorage.removeItem(this.tokenKey); } catch {} }

  logout() {
    localStorage.removeItem(this.storageKey);
    this.clearToken();
  }

  getUser(): User | null {
    const raw = localStorage.getItem(this.storageKey);
    return raw ? JSON.parse(raw) as User : null;
  }
}
