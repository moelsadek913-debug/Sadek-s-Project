import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Toast } from '../../services/toast';

@Component({
  standalone: true,
  selector: 'app-toasts',
  imports: [CommonModule],
  template: `
    <div class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 1080;">
      <div *ngFor="let m of toast.msgs()" class="toast show mb-2" role="alert" aria-live="assertive">
        <div [ngClass]="{'bg-success text-white': m.type==='success', 'bg-danger text-white': m.type==='error', 'bg-info text-dark': m.type==='info'}" class="toast-body">
          {{ m.text }}
          <button type="button" class="btn-close btn-close-white float-end ms-2" aria-label="Close" (click)="toast.dismiss(m.id)"></button>
        </div>
      </div>
    </div>
  `,
})
export class ToastsComponent {
  constructor(public toast: Toast) {}
}
