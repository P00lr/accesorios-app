import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SupplierService } from '../../../services/supplier.service';
import { CommonModule } from '@angular/common';

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

  // Función para manejar el envío del formulario
  onSubmit(): void {
    if (this.supplierForm.valid) {
      // Envía el nuevo proveedor al servicio
      this.supplierService.createSupplier(this.supplierForm.value).subscribe(() => {
        // Redirige a la lista de proveedores después de la creación exitosa
        this.router.navigate(['/proveedores']);
      });
    }
  }
}
