import { Component } from '@angular/core';
import { Permission } from '../../../models/permission.model';
import { PermissionService } from '../../../services/permission.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-permission-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './permission-list.component.html',
  styleUrl: './permission-list.component.css'
})
export class PermissionListComponent {
  permissions: Permission[] = [];
  currentPage: number = 0;
  totalPages: number = 0;

  constructor(private permissionService: PermissionService) {}

  ngOnInit(): void {
    this.loadPermissions(this.currentPage);
  }

  loadPermissions(page: number): void {
    this.permissionService.getPermissions(page).subscribe({
      next: (response) => {
        this.permissions = response.content;
        this.totalPages = response.totalPages;
        this.currentPage = response.number;
      },
      error: (err) => {
        console.error('Error cargando permisos:', err);
      }
    });
  }

  deletePermission(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Este permiso será eliminado permanentemente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.permissionService.deletePermission(id).subscribe({
          next: () => {
            this.permissions = this.permissions.filter(p => p.id !== id);
            Swal.fire('Eliminado', 'El permiso ha sido eliminado.', 'success');
          },
          error: (err) => {
            console.error(err);
            Swal.fire('Error', 'No se pudo eliminar el permiso.', 'error');
          }
        });
      }
    });
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.loadPermissions(page);
    }
  }
}
