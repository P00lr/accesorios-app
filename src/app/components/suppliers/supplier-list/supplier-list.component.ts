import { Component } from '@angular/core';
import { Supplier } from '../../../models/supplier.model';
import { SupplierService } from '../../../services/supplier.service';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../../auth/auth.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-supplier-list',
  imports: [RouterModule, CommonModule],
  templateUrl: './supplier-list.component.html',
  styleUrl: './supplier-list.component.css'
})
export class SupplierListComponent {
  permissions: string[] = [];

  constructor(
    private supplierService: SupplierService,
    private authService: AuthService
  ) {
    this.authService.permissions$.subscribe(perms => {
        this.permissions = perms;
      });
   }

  suppliers: Supplier[] = [];
  currentPage = 0;
  totalPages = 0;


  ngOnInit(): void {
    this.loadSuppliers(this.currentPage);
  }

  hasPermission(permission: string): boolean {
      return this.permissions.includes(permission);
  }

  loadSuppliers(page: number): void {
    this.supplierService.getSuppliers(page).subscribe({
      next: (response) => {
        this.suppliers = response.content;
        this.totalPages = response.totalPages;
        this.currentPage = response.number;
      },
      error: (err) => {
        console.error('Error al cargar proveedores', err);
      }
    });
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.loadSuppliers(page);
    }
  }

  deleteSupplier(id: number): void {
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
          this.supplierService.deleteSupplier(id).subscribe(() => {
          this.suppliers = this.suppliers.filter(supplier => supplier.id !== id);
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

 



}
