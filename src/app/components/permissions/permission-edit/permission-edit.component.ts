import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PermissionService } from '../../../services/permission.service';
import { Permission } from '../../../models/permission.model';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-permission-edit',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './permission-edit.component.html',
  styleUrl: './permission-edit.component.css'
})
export class PermissionEditComponent {
  permissionForm!: FormGroup;
  permissionId!: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private permissionService: PermissionService
  ) { }

  ngOnInit(): void {
    this.permissionId = +this.route.snapshot.paramMap.get('id')!;

    this.permissionForm = this.fb.group({
      name: ['', Validators.required]
    });

    this.permissionService.getPermissionById(this.permissionId).subscribe((permission: Permission) => {
      this.permissionForm.patchValue(permission);
    });
  }

  onSubmit(): void {
  if (this.permissionForm.valid) {
    const updatedPermission = this.permissionForm.value;
    this.permissionService.updatePermission(this.permissionId, updatedPermission).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Permiso actualizado',
          text: 'El permiso se actualizó correctamente.',
          confirmButtonText: 'Aceptar'
        }).then(() => {
          this.router.navigate(['/permissions']);
        });
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo actualizar el permiso. Intenta nuevamente.',
          confirmButtonText: 'Aceptar'
        });
      }
    });
  }
}
}
