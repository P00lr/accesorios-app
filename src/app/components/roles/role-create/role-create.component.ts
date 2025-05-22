import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RoleService } from '../../../services/role.service';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-role-create',
  imports: [ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './role-create.component.html',
  styleUrl: './role-create.component.css'
})
export class RoleCreateComponent {
  roleForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private roleService: RoleService,
    private router: Router
  ) {
    this.roleForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.roleForm.invalid) return;

    const roleData = this.roleForm.value;

    this.roleService.createRole(roleData).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Rol creado',
          text: 'El rol fue creado exitosamente',
          timer: 1500,
          showConfirmButton: false
        });
        this.router.navigate(['/roles-with-permissions']);
      },
      error: err => {
        console.error(err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo crear el rol'
        });
      }
    });
  }
}
