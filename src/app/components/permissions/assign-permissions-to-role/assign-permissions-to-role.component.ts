import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RoleWithPermissions } from '../../../models/role-with-permissions.model';
import { Permission } from '../../../models/permission.model';
import { debounceTime, map, startWith, tap } from 'rxjs';
import { RoleService } from '../../../services/role.service';
import { PermissionService } from '../../../services/permission.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCard } from '@angular/material/card';
import Swal from 'sweetalert2';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-assign-permissions-to-role',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatIconModule,
    MatCard,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatCheckboxModule,
    MatDividerModule,
    RouterModule
  ],
  templateUrl: './assign-permissions-to-role.component.html',
  styleUrls: ['./assign-permissions-to-role.component.css']
})
export class AssignPermissionsToRoleComponent implements OnInit {

  roleControl = new FormControl<string | RoleWithPermissions>('');
  roles: RoleWithPermissions[] = [];
  filteredRoles: RoleWithPermissions[] = [];
  permissions: Permission[] = [];
  groupedPermissions: { entityName: string; permissions: Permission[] }[] = [];

  selectedRole: RoleWithPermissions | null = null;
  selectedPermissionIds = new Set<number>();

  constructor(
    private roleService: RoleService,
    private permissionService: PermissionService
  ) { }

  ngOnInit(): void {
    this.roleService.getAllRolesWithPermissions().subscribe(roles => {
      this.roles = roles;
      this.filteredRoles = roles;
    });

    this.permissionService.getAllPermissions().subscribe(allPermissions => {
      this.permissions = allPermissions;
      this.groupPermissions();
    });


    this.roleControl.valueChanges.pipe(
      debounceTime(300),
      startWith(''),
      map(value => typeof value === 'string' ? value.toLowerCase() : ''),
      tap(value => {
        this.filteredRoles = this.roles.filter(role =>
          role.name.toLowerCase().includes(value)
        );
      })
    ).subscribe();
  }

  onSelectRole(role: RoleWithPermissions) {
    this.selectedRole = role;
    this.roleControl.setValue(role.name);
    this.selectedPermissionIds = new Set(
      role.permissions.map(p => p.id)
    );
  }

  togglePermission(permissionId: number) {
    if (this.selectedPermissionIds.has(permissionId)) {
      this.selectedPermissionIds.delete(permissionId);
    } else {
      this.selectedPermissionIds.add(permissionId);
    }
  }

  onAssignPermissions() {
    if (!this.selectedRole) return;

    const payload = {
      roleId: this.selectedRole.id,
      permissionIds: Array.from(this.selectedPermissionIds)
    };
    console.log('Payload a enviar:', payload);
    this.permissionService.assignPermissionsToRole(payload).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Permisos actualizados',
          text: `Los permisos fueron asignados correctamente.`,
          showConfirmButton: false,
          timer: 1500
        });
      },
      error: (err) => {
        console.error('Error al asignar permisos:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al asignar los permisos. Intenta nuevamente.',
          confirmButtonColor: '#d33'
        });
      }
    });
  }

  groupPermissions() {
    const groups: { [entity: string]: Permission[] } = {};

    this.permissions.forEach(permission => {
      const [entity] = permission.name.split('_').slice(-1); // Extrae parte final como entidad (puedes ajustar esto)
      const entityKey = permission.name.split('_')[1]; // Ej: "ACCESORIO", "CLIENTE", etc.

      if (!groups[entityKey]) {
        groups[entityKey] = [];
      }

      groups[entityKey].push(permission);
    });

    this.groupedPermissions = Object.keys(groups).map(key => ({
      entityName: key.charAt(0).toUpperCase() + key.slice(1).toLowerCase(),
      permissions: groups[key]
    }));
  }
  displayRoleFn(role: string | RoleWithPermissions): string {
  return typeof role === 'string' ? role : role?.name;
}

}