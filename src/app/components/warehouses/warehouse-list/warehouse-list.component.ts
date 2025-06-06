import { Component, OnInit } from '@angular/core';
import { Warehouse } from '../../../models/warehouse.model';
import { WarehouseService } from '../../../services/warehouse.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-warehouse-list',
  imports: [CommonModule, RouterModule,],
  templateUrl: './warehouse-list.component.html',
  styleUrl: './warehouse-list.component.css'
})
export class WarehouseListComponent implements OnInit {
  warehouses: Warehouse[] = [];
  isLoading = true;
  error: string | null = null;

  currentPage = 0;
  totalPages = 0;

  permissions: string[] = [];


  constructor(
    private warehouseService: WarehouseService,
    private router: Router,
    private authService: AuthService
  ) { 
    this.authService.permissions$.subscribe(perms => {
        this.permissions = perms;
      });
  }

  ngOnInit(): void {
    this.loadWarehouses(this.currentPage);
  }

  hasPermission(permission: string): boolean {
      return this.permissions.includes(permission);
  }

  loadWarehouses(page: number): void {
    this.isLoading = true;
    this.error = null;

    this.warehouseService.getWarehouses(page).subscribe({
      next: (response) => {
        this.warehouses = response.content;
        this.totalPages = response.totalPages;
        this.currentPage = response.number;
        this.isLoading = false;

        this.warehouseService.setWarehousesToLocalStorage(response.content);
      },
      error: (err) => {
        this.error = 'Error al cargar los almacenes.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  deleteWarehouse(id: number): void {
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
            this.warehouseService.deleteWarehouse(id).subscribe(() => {
            this.warehouses = this.warehouses.filter(warehouse => warehouse.id !== id);
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

  viewDetails(id: number): void {
    this.router.navigate(['/warehouses/detail', id]);
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.loadWarehouses(page);
    }
  }
}
