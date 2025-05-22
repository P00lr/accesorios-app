import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PermissionService } from '../../../services/permission.service';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-permission-create',
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './permission-create.component.html',
  styleUrl: './permission-create.component.css'
})
export class PermissionCreateComponent {
  permissionForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private permissionService: PermissionService,
    private router: Router
  ) {
    this.permissionForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.permissionForm.invalid) return;

    this.permissionService.createPermission(this.permissionForm.value).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Permiso creado',
          text: 'El permiso fue creado exitosamente'
        });
        this.router.navigate(['/permissions']);
      },
      error: (err) => {
        console.error(err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo crear el permiso'
        });
      }
    });
  }
}
