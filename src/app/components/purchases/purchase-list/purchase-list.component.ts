import { Component } from '@angular/core';
import { Page } from '../../../models/page.model';
import { Purchase } from '../../../models/purchase.model';
import { PurchaseService } from '../../../services/purchase.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-purchase-list',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './purchase-list.component.html',
  styleUrl: './purchase-list.component.css'
})
export class PurchaseListComponent {
  purchases: Purchase[] = [];
  currentPage = 0;
  totalPages = 0;
  isLoading = false;
  error: string | null = null;
  permissions: string[] = [];


  constructor(
    private purchaseService: PurchaseService,
    private router: Router,
    private authService: AuthService
  ) {
    this.authService.permissions$.subscribe(perms => {
        this.permissions = perms;
      });
   }

  ngOnInit(): void {
    this.loadPurchases(this.currentPage);
  }

  hasPermission(permission: string): boolean {
      return this.permissions.includes(permission);
    }

  loadPurchases(page: number): void {
    this.isLoading = true;
    this.purchaseService.getPurchases(page).subscribe({
      next: (response: Page<Purchase>) => {
        this.purchases = response.content;
        this.totalPages = response.totalPages;
        this.currentPage = response.number;
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Error al cargar las compras.';
        this.isLoading = false;
      },
    });
  }
  viewDetails(id: number) {
    this.router.navigate(['/purchases/detail', id]);
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
        this.purchaseService.deletePurchase(id).subscribe(() => {
          this.purchases = this.purchases.filter(purchase => purchase.id !== id);
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
      this.loadPurchases(page);
    }
  }
}
