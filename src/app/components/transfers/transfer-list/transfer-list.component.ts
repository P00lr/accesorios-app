import { Component } from '@angular/core';
import { Page } from '../../../models/page.model';
import { ListTransfer } from '../../../models/transfer.model';
import { TransferService } from '../../../services/transfer.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-transfer-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './transfer-list.component.html',
  styleUrl: './transfer-list.component.css'
})
export class TransferListComponent {
  transfers: ListTransfer[] = [];
  currentPage = 0;
  totalPages = 0;

  loading = false;
  errorMessage = '';

  constructor(
    private transferService: TransferService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTransfers(this.currentPage);
  }

  loadTransfers(page: number): void {
    this.loading = true;
    this.transferService.getTransfersByPage(page).subscribe({
      next: (response: Page<ListTransfer>) => {
        this.transfers = response.content;
        this.totalPages = response.totalPages;
        this.currentPage = response.number;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar transferencias:', error);
        this.errorMessage = 'Hubo un error al cargar las transferencias.';
        this.loading = false;
      }
    });
  }
  viewDetails(id: number) {
    this.router.navigate(['/transfers/detail', id]);
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.loadTransfers(page);
    }
  }
}
