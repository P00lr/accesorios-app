import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SupplierService } from '../../../services/supplier.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-supplier-create',
  templateUrl: './supplier-create.component.html',
  styleUrls: ['./supplier-create.component.css'],
  imports: [ReactiveFormsModule, CommonModule, RouterModule]

})
export class SupplierCreateComponent implements OnInit {
  supplierForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private supplierService: SupplierService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Inicializa el formulario con los campos necesarios
    this.supplierForm = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit(): void {
  if (this.supplierForm.valid) {
    this.supplierService.createSupplier(this.supplierForm.value).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Proveedor creado',
          text: 'El proveedor ha sido registrado correctamente.',
          confirmButtonText: 'OK'
        }).then(() => {
          this.router.navigate(['/proveedores']);
        });
      },
      error: (err) => {
        console.error('Error al crear proveedor:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al registrar el proveedor.',
          confirmButtonText: 'Cerrar'
        });
      }
    });
  } else {
    Swal.fire({
      icon: 'warning',
      title: 'Formulario inválido',
      text: 'Por favor, completa todos los campos requeridos.',
      confirmButtonText: 'Entendido'
    });
  }
}
}
