import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { WarehouseService } from '../../../services/warehouse.service';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-warehouse-create',
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './warehouse-create.component.html',
  styleUrl: './warehouse-create.component.css'
})
export class WarehouseCreateComponent {
  warehouseForm!: FormGroup;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private warehouseService: WarehouseService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.warehouseForm = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required]
    });
  }

  onSubmit(): void {
  if (this.warehouseForm.invalid) {
    Swal.fire({
      icon: 'warning',
      title: 'Formulario inválido',
      text: 'Por favor, completa todos los campos requeridos.',
      confirmButtonText: 'Entendido'
    });
    return;
  }

  this.warehouseService.createWarehouse(this.warehouseForm.value).subscribe({
    next: () => {
      Swal.fire({
        icon: 'success',
        title: 'Almacén creado',
        text: 'El almacén ha sido registrado correctamente.',
        confirmButtonText: 'OK'
      }).then(() => {
        this.router.navigate(['/warehouses']);
      });
    },
    error: (err) => {
      console.error('Error al crear almacén:', err);
      this.errorMessage = 'Hubo un error al crear el almacén';
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al registrar el almacén.',
        confirmButtonText: 'Cerrar'
      });
    }
  });
}
}
