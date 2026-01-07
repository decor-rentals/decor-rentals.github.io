import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ContentService } from '../services/content.service';

@Component({
  standalone: true,
  selector: 'app-products-list',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.css'
})
export class ProductsListComponent implements OnInit {
  private content = inject(ContentService);
  private cdr = inject(ChangeDetectorRef);
  allProducts: any[] = [];
  products: any[] = [];
  searchQuery: string = '';

  async ngOnInit() {
    const fetchedProducts = await this.content.getProductsIndex();
    this.allProducts = fetchedProducts.filter((p: any) => p.status === 'published');
    this.products = [...this.allProducts];
    this.cdr.detectChanges();
  }

  onSearchChange() {
    if (!this.searchQuery.trim()) {
      this.products = [...this.allProducts];
      return;
    }

    const query = this.searchQuery.trim();
    const regex = new RegExp(query, 'i'); // case-insensitive regex

    this.products = this.allProducts.filter((p: any) => {
      const matchName = regex.test(p.name || '');
      const matchDescription = regex.test(p.description || '');
      return matchName || matchDescription;
    });
  }
}
