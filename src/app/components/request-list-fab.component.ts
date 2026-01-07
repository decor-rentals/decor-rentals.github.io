import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RequestListService } from '../services/request-list.service';

@Component({
  standalone: true,
  selector: 'app-request-list-fab',
  imports: [CommonModule],
  template: `
    <button class="fab" (click)="toggle()">
      📝<span class="count" *ngIf="count() > 0">{{ count() }}</span>
    </button>

    <div class="modal-backdrop" *ngIf="open()" (click)="toggle()"></div>
    <div class="modal" *ngIf="open()">
      <header>
        <h3>Request List</h3>
        <button class="close" (click)="toggle()">×</button>
      </header>
      <ul class="items" *ngIf="items().length; else empty">
        <li *ngFor="let it of items(); let i = index">
          <div class="meta">
            <strong>{{ it.name }}</strong>
            <span class="muted" *ngIf="it.variantName">{{ it.variantName }}</span>
          </div>
          <div class="price" *ngIf="it.price != null && it.currency">
            <span class="muted">× {{ it.quantity || 1 }}</span>
            {{ it.price | currency: it.currency : 'symbol' : '1.2-2' }}
            <span class="muted">= {{ ((it.price || 0) * (it.quantity || 1)) | currency: it.currency : 'symbol' : '1.2-2' }}</span>
          </div>
          <button class="remove" (click)="remove(i)">Remove</button>
        </li>
      </ul>
      <ng-template #empty>
        <div class="empty">No items added yet.</div>
      </ng-template>
      <footer>
        <button class="clear" (click)="clear()" [disabled]="items().length === 0">Clear</button>
        <a class="whatsapp" [attr.href]="waLink()" target="_blank" rel="noopener" [class.disabled]="items().length === 0">Request over WhatsApp</a>
      </footer>
    </div>
  `,
  styles: [`
    .fab {
      position: fixed; right: 16px; bottom: 16px; z-index: 1000;
      background: linear-gradient(to right, #E94E3B, #2CA8D9);
      transform: scale(1.05);
      color: #FFF7E8; border: 0; border-radius: 999px;
      padding: 12px 16px; box-shadow: 0 6px 18px rgba(0,0,0,0.2); cursor: pointer;
      font-size: 18px; display: inline-flex; align-items: center; gap: 8px;
    }
    .fab .count { background: #F86A2E; color: white; border-radius: 999px; padding: 2px 8px; font-size: 12px; }
    .modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.45); z-index: 1000; }
    .modal { position: fixed; right: 16px; bottom: 70px; width: 360px; max-width: calc(100vw - 32px); background: #FFF7E8; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.25); z-index: 1001; }
    header { display:flex; align-items:center; justify-content: space-between; padding: 12px 16px; border-bottom: 1px solid rgba(31,61,58,0.15); }
    header h3 { margin: 0; color:#1F3D3A; }
    header .close { background: transparent; border: 0; font-size: 20px; cursor: pointer; color: #1F3D3A; }
    .items { list-style: none; margin: 0; padding: 8px 0; max-height: 50vh; overflow: auto; }
    .items li { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 10px 16px; border-bottom: 1px solid rgba(31,61,58,0.08); }
    .items .meta { display:flex; flex-direction: column; }
    .items .muted { color: rgba(31,61,58,0.7); font-size: 12px; }
    .items .price { color: #1F3D3A; font-weight: 600; font-size: 14px; }
    .items .remove { background: transparent; border: 1px solid rgba(31,61,58,0.3); color: #1F3D3A; padding: 6px 8px; border-radius: 6px; cursor: pointer; }
    .empty { padding: 20px; color: rgba(31,61,58,0.8); }
    footer { display:flex; justify-content: space-between; gap: 10px; padding: 12px 16px; border-top: 1px solid rgba(31,61,58,0.15); }
    .clear { background: transparent; border: 1px solid rgba(31,61,58,0.3); color:#1F3D3A; padding: 8px 12px; border-radius: 6px; cursor:pointer; }
    .whatsapp { background: #25D366; color: white; text-decoration: none; padding: 8px 12px; border-radius: 6px; flex: 1; text-align: center; }
    .whatsapp.disabled { opacity: 0.5; pointer-events: none; }
    @media (max-width: 480px) {
      .modal { right: 8px; left: 8px; width: auto; }
      .fab { right: 8px; bottom: 8px; }
    }
  `]
})
export class RequestListFabComponent {
  private svc = inject(RequestListService);
  open = signal(false);

  count = () => this.svc.items.length;
  items = () => this.svc.items;

  toggle() { this.open.set(!this.open()); }
  remove(i: number) { this.svc.remove(i); }
  clear() { this.svc.clear(); }

  // TODO: set target number here or via config
  private phone = '+353899737746';
  waLink() { return this.svc.buildWhatsAppLink(this.phone); }
}
