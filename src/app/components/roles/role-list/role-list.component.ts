import { Component } from '@angular/core';
import { Role } from '../../../models/role.model';
import { RoleService } from '../../../services/role.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-role-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './role-list.component.html',
  styleUrl: './role-list.component.css'
})
export class RoleListComponent {
  roles: Role[] = [];
  permissions: string[] = [];


  constructor(
    private roleService: RoleService,
    private authService: AuthService
  ) {
    this.authService.permissions$.subscribe(perms => {
        this.permissions = perms;
      });
  }

  ngOnInit(): void {
    this.loadRoles();
  }
  hasPermission(permission: string): boolean {
      return this.permissions.includes(permission);
    }

  loadRoles(): void {
    this.roleService.getPermissions(0).subscribe({
      next: (res) => this.roles = res.content,
      error: (err) => console.error('Error al cargar roles', err)
    });
  }

  deleteRole(id: number): void {
    if (!confirm('¿Estás seguro de eliminar este rol?')) return;

    this.roleService.deleteRole(id).subscribe({
      next: () => {
        this.roles = this.roles.filter(role => role.id !== id);
      },
      error: (err) => console.error('Error al eliminar el rol', err)
    });
  }
}
