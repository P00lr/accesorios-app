import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { RoleService } from '../../../services/role.service';
import { Role } from '../../../models/role.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-role-edit',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './role-edit.component.html',
  styleUrl: './role-edit.component.css'
})
export class RoleEditComponent {
  roleForm!: FormGroup;
  roleId!: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private roleService: RoleService
  ) {}

  ngOnInit(): void {
    this.roleId = +this.route.snapshot.paramMap.get('id')!;

    this.roleForm = this.fb.group({
      name: ['', Validators.required]
    });

    this.roleService.getRoleById(this.roleId).subscribe((role: Role) => {
      this.roleForm.patchValue(role);
    });
  }

  onSubmit(): void {
  if (this.roleForm.valid) {
    const updatedRole = this.roleForm.value;
    this.roleService.updateRole(this.roleId, updatedRole).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Rol actualizado',
          text: 'El rol se actualizó correctamente.',
          confirmButtonText: 'Aceptar'
        }).then(() => {
          this.router.navigate(['/roles-with-permissions']);
        });
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo actualizar el rol. Intenta nuevamente.',
          confirmButtonText: 'Aceptar'
        });
      }
    });
  }
}
}
