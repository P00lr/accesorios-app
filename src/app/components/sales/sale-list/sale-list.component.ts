import { Component } from '@angular/core';
import { Sale } from '../../../models/list-sale.model';
import { SaleService } from '../../../services/sale.service';
import { Page } from '../../../models/page.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sale-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './sale-list.component.html',
  styleUrl: './sale-list.component.css'
})
export class SaleListComponent {
  sales: Sale[] = [];
  currentPage = 0;
  totalPages = 0;
  loading = true;
  error: string | null = null;

  constructor(private saleService: SaleService) {}

  ngOnInit(): void {
    this.loadSales(this.currentPage);
  }

  loadSales(page: number): void {
    this.loading = true;
    this.saleService.getSalesByPage(page).subscribe({
      next: (response: Page<Sale>) => {
        this.sales = response.content;
        this.totalPages = response.totalPages;
        this.currentPage = response.number;
        this.saleService.setSalesToLocalStorage(this.sales);
        this.loading = false;
      },
      error: () => {
        this.error = 'No se pudieron cargar las ventas.';
        this.loading = false;
      }
    });
  }
  viewDetails(id: number) {
    
  }

  deletePurchase(id: number) {

  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.loadSales(page);
    }
  }
}
