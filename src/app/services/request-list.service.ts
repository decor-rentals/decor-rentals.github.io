import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type RequestItem = {
  kind: 'product' | 'collection';
  id: string;
  name: string;
  variantKey: string; // stable key for selected product variant / collection tier
  variantName?: string; // display label for variant/tier
  quantity: number;
  price?: number | null;
  currency?: string | null;
  image?: string | null;
};

const STORAGE_KEY = 'request-list-v1';

@Injectable({ providedIn: 'root' })
export class RequestListService {
  private itemsSubject = new BehaviorSubject<RequestItem[]>(this.load());
  readonly items$ = this.itemsSubject.asObservable();

  get items(): RequestItem[] {
    return this.itemsSubject.value;
  }

  has(kind: RequestItem['kind'], id: string, variantKey: string): boolean {
    return this.itemsSubject.value.some((it) => this.keyFor(it) === this.keyForParts(kind, id, variantKey));
  }

  toggle(item: RequestItem): boolean {
    // Returns true if item is now present, false if removed.
    const key = this.keyFor(item);
    const existingIndex = this.itemsSubject.value.findIndex((it) => this.keyFor(it) === key);
    if (existingIndex >= 0) {
      this.remove(existingIndex);
      return false;
    }
    this.add(item);
    return true;
  }

  add(item: RequestItem) {
    const key = this.keyFor(item);
    if (this.itemsSubject.value.some((it) => this.keyFor(it) === key)) return;
    const items = [...this.itemsSubject.value, item];
    this.itemsSubject.next(items);
    this.save(items);
  }

  remove(index: number) {
    const items = this.itemsSubject.value.slice();
    items.splice(index, 1);
    this.itemsSubject.next(items);
    this.save(items);
  }

  clear() {
    this.itemsSubject.next([]);
    this.save([]);
  }

  private save(items: RequestItem[]) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }

  private load(): RequestItem[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      // Back-compat: older items might not have variantKey; derive it.
      return Array.isArray(parsed)
        ? parsed
            .filter(Boolean)
            .map((it: any) => ({
              kind: it.kind,
              id: it.id,
              name: it.name,
              variantKey: it.variantKey || it.variantName || 'default',
              variantName: it.variantName,
              quantity: Number.isFinite(it.quantity) && it.quantity > 0 ? it.quantity : 1,
              price: it.price ?? null,
              currency: it.currency ?? null,
              image: it.image ?? null
            }))
        : [];
    } catch {
      return [];
    }
  }

  private keyFor(it: RequestItem): string {
    return this.keyForParts(it.kind, it.id, it.variantKey);
  }

  private keyForParts(kind: RequestItem['kind'], id: string, variantKey: string): string {
    return `${kind}|${id}|${variantKey}`;
  }

  buildWhatsAppLink(phone: string): string {
    const lines = this.items.map((it, i) => {
      const v = it.variantName ? ` – ${it.variantName}` : '';
      const qty = Number.isFinite(it.quantity) && it.quantity > 0 ? it.quantity : 1;
      const p =
        it.price != null && it.currency
          ? ` (${qty} × ${it.currency} ${it.price} = ${it.currency} ${Number((it.price ?? 0) * qty).toFixed(2)})`
          : '';
      return `${i + 1}. ${it.name}${v} × ${qty}${p}`;
    });
    const text = encodeURIComponent(`Hello! I'd like to request the following items:\n\n${lines.join('\n')}\n\nThanks!`);
    const num = phone.replace(/[^0-9]/g, '');
    return `https://wa.me/${num}?text=${text}`;
  }
}
