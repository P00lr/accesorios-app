import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SupplierService } from '../../../services/supplier.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-supplier-edit',
  templateUrl: './supplier-edit.component.html',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule]
})
export class SupplierEditComponent implements OnInit {
  supplierForm!: FormGroup;
  supplierId!: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private supplierService: SupplierService
  ) {}

  ngOnInit(): void {
    this.supplierId = Number(this.route.snapshot.paramMap.get('id'));

    this.supplierForm = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });

    this.loadSupplier();
  }

  loadSupplier(): void {
    this.supplierService.getSupplierById(this.supplierId).subscribe((supplier) => {
      this.supplierForm.patchValue(supplier);
    });
  }

  onSubmit(): void {
  if (this.supplierForm.valid) {
    this.supplierService.updateSupplier(this.supplierId, this.supplierForm.value).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Proveedor actualizado',
          text: 'El proveedor se actualizó correctamente.',
          confirmButtonText: 'Aceptar'
        }).then(() => {
          this.router.navigate(['/proveedores']);
        });
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo actualizar el proveedor. Intenta nuevamente.',
          confirmButtonText: 'Aceptar'
        });
      }
    });
  }
}
}
