import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { User } from '../../../models/user.model';
import { Permission } from '../../../models/permission.model';
import { UserService } from '../../../services/user.service';
import { PermissionService } from '../../../services/permission.service';
import { debounceTime, map, startWith, tap } from 'rxjs';
import Swal from 'sweetalert2';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatListModule, MatSelectionList } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { RoleService } from '../../../services/role.service';
import { RoleWithPermissions } from '../../../models/role-with-permissions.model';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-assign-permissions-to-user',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatListModule,
    MatButtonModule,
    CommonModule,
    MatCardModule,
    MatSelectionList,
    MatExpansionModule,
    MatProgressSpinnerModule,
    RouterModule
  ],
  templateUrl: './assign-permissions-to-user.component.html',
  styleUrl: './assign-permissions-to-user.component.css'
})
export class AssignPermissionsToUserComponent implements OnInit {

  userControl = new FormControl<string>('');
  users: User[] = [];
  filteredUsers: User[] = [];
  rolesWithPermissions: RoleWithPermissions[] = [];

  selectedUser: User | null = null;
  selectedPermissionIds = new Set<number>();

  constructor(
    private userService: UserService,
    private permissionService: PermissionService,
    private roleService: RoleService
  ) { }

  ngOnInit(): void {
    this.userService.getAllusers().subscribe(data => {
      this.users = data;
      this.filteredUsers = this.users;
    });

    this.roleService.getAllRolesWithPermissions().subscribe(data => {
      this.rolesWithPermissions = data;
    });

    this.userControl.valueChanges.pipe(
      debounceTime(300),
      startWith(''),
      map(value => typeof value === 'string' ? value.toLowerCase() : ''),
      tap(value => {
        this.filteredUsers = this.users.filter(user =>
          user.name.toLowerCase().includes(value) || user.username.toLowerCase().includes(value)
        );
      })
    ).subscribe();
  }

  onSelectUser(user: User) {
    this.selectedUser = user;
    this.userControl.setValue(user.name);

    this.selectedPermissionIds.clear();

    this.userService.getUserWithPermissions(user.id).subscribe(userWithPerms => {
      this.selectedPermissionIds = new Set(
        userWithPerms.permissions.map(p => p.id)
      );
    });
  }

  togglePermission(permissionId: number) {
    if (this.selectedPermissionIds.has(permissionId)) {
      this.selectedPermissionIds.delete(permissionId);
    } else {
      this.selectedPermissionIds.add(permissionId);
    }
  }

  onAssignPermissions() {
    if (!this.selectedUser) return;

    const payload = {
      userId: this.selectedUser.id,
      permissionIds: Array.from(this.selectedPermissionIds)
    };

    this.permissionService.assignPermissionsToUser(payload).subscribe({
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
  selectAllPermissions(role: RoleWithPermissions): void {
    for (const permission of role.permissions) {
      this.selectedPermissionIds.add(permission.id);
    }
  }
  areAllPermissionsSelected(role: RoleWithPermissions): boolean {
    return role.permissions.every(p => this.selectedPermissionIds.has(p.id));
  }

  toggleAllPermissions(role: RoleWithPermissions): void {
    const allSelected = this.areAllPermissionsSelected(role);
    for (const permission of role.permissions) {
      if (allSelected) {
        this.selectedPermissionIds.delete(permission.id); // Deseleccionar
      } else {
        this.selectedPermissionIds.add(permission.id); // Seleccionar
      }
    }
  }

}
