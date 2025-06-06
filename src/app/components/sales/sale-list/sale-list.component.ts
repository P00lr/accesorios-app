import { Component } from '@angular/core';
import { Sale } from '../../../models/list-sale.model';
import { SaleService } from '../../../services/sale.service';
import { Page } from '../../../models/page.model';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-sale-list',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './sale-list.component.html',
  styleUrl: './sale-list.component.css'
})
export class SaleListComponent {
  sales: Sale[] = [];
  currentPage = 0;
  totalPages = 0;
  loading = true;
  error: string | null = null;
  permissions: string[] = [];


  constructor(
    private saleService: SaleService,
    private router: Router,
    private authService: AuthService
  ) { 
    this.authService.permissions$.subscribe(perms => {
        this.permissions = perms;
      });
  }

  ngOnInit(): void {
    this.loadSales(this.currentPage);
  }
  hasPermission(permission: string): boolean {
      return this.permissions.includes(permission);
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
    this.router.navigate(['/sales/detail', id]);
  }

  deletePurchase(id: number) {
    Swal.fire({
      title: "Estas seguro que deseas eliminar?",
      text: "Se eliminara de forma permanente!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "SI, Eliminar!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.saleService.deleteSaleById(id).subscribe(() => {
          this.sales = this.sales.filter(sale => sale.id !== id);
        });
        Swal.fire({
          title: "Eliminado!",
          text: "Eliminado exitosamente.",
          icon: "success",
          showConfirmButton: false,
          timer: 800
        });
      }
    });
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.loadSales(page);
    }
  }
}
