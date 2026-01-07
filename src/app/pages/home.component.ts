import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ContentService } from '../services/content.service';

/**
 * CONTEXT:
 * - Home page displays preview carousels for Events, Collections, and Products
 * - Each carousel shows up to 4 items + a "See All" card
 * - Cards link to detail pages; "See All" links to list pages
 * - Horizontal scrollable on mobile, arrow navigation on desktop
 */
@Component({
  standalone: true,
  selector: 'app-home',
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  events: any[] = [];
  collections: any[] = [];
  products: any[] = [];

  constructor(private content: ContentService) {}

  async ngOnInit() {
    const [events, collections, products] = await Promise.all([
      this.content.getEventsIndex(),
      this.content.getCollectionsIndex(),
      this.content.getProductsIndex()
    ]);
    // Take first 4 items for preview
    this.events = (events || []).filter((e: any) => e.status !== 'draft').slice(0, 4);
    this.collections = (collections || []).filter((c: any) => c.status !== 'draft').slice(0, 4);
    this.products = (products || []).filter((p: any) => p.status !== 'draft').slice(0, 4);
  }

  normalizeAssetPath(url: string): string {
    if (!url) return '';
    return url.startsWith('/') ? url.slice(1) : url;
  }

  scroll(container: HTMLElement, direction: 'left' | 'right') {
    const scrollAmount = 300;
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  }
}
