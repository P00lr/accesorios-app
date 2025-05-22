import { Component } from '@angular/core';
import { RoleWithPermissions } from '../../../models/role-with-permissions.model';
import { RoleService } from '../../../services/role.service';
import { Page } from '../../../models/page.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-role-with-permissions',
  imports: [CommonModule, RouterModule],
  templateUrl: './list-role-with-permissions.component.html',
  styleUrl: './list-role-with-permissions.component.css'
})
export class ListRoleWithPermissionsComponent {
  roles: RoleWithPermissions[] = [];
  currentPage: number = 0;
  totalPages: number = 0;

  constructor(private roleService: RoleService) {}

  ngOnInit(): void {
    this.getRoles(this.currentPage);
  }

  getRoles(page: number): void {
    this.roleService.getRolesWithPermissions(page).subscribe((response: Page<RoleWithPermissions>) => {
      this.roles = response.content;
      this.currentPage = response.number;
      this.totalPages = response.totalPages;
    });
  }

  deleteRole(id: number): void {
  Swal.fire({
    title: '¿Estás seguro?',
    text: 'No podrás revertir esta acción.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      this.roleService.deleteRole(id).subscribe({
        next: () => {
          this.roles = this.roles.filter(role => role.id !== id);
          Swal.fire('Eliminado!', 'El rol ha sido eliminado.', 'success');
        },
        error: (err) => {
          console.error('Error al eliminar el rol', err);
          Swal.fire('Error', 'No se pudo eliminar el rol.', 'error');
        }
      });
    }
  });
}


  nextPage(): void {
    if (this.currentPage + 1 < this.totalPages) {
      this.getRoles(this.currentPage + 1);
    }
  }

  prevPage(): void {
    if (this.currentPage > 0) {
      this.getRoles(this.currentPage - 1);
    }
  }
}
