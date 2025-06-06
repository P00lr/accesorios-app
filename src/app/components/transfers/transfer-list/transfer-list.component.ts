import { Component } from '@angular/core';
import { Page } from '../../../models/page.model';
import { ListTransfer } from '../../../models/transfer.model';
import { TransferService } from '../../../services/transfer.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../../auth/auth.service';

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
  permissions: string[] = [];


  constructor(
    private transferService: TransferService,
    private router: Router,
    private authService: AuthService
  ) {
    this.authService.permissions$.subscribe(perms => {
        this.permissions = perms;
      });
  }

  ngOnInit(): void {
    this.loadTransfers(this.currentPage);
  }
  hasPermission(permission: string): boolean {
      return this.permissions.includes(permission);
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
  deleteTransfer(id: number) {
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
      this.transferService.deleteTransfer(id).subscribe(() => {
      this.transfers = this.transfers.filter(transfer => transfer.id !== id);
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
      this.loadTransfers(page);
    }
  }
}
