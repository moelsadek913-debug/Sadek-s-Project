import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: number;
  text: string;
  type: ToastType;
}

@Injectable({ providedIn: 'root' })
export class Toast {
  private nextId = 1;
  msgs = signal<ToastMessage[]>([]);

  show(text: string, type: ToastType = 'info', duration = 3500) {
    const id = this.nextId++;
    const msg: ToastMessage = { id, text, type };
    this.msgs.set([...this.msgs(), msg]);
    setTimeout(() => this.dismiss(id), duration);
  }

  dismiss(id: number) {
    this.msgs.set(this.msgs().filter(m => m.id !== id));
  }
}

