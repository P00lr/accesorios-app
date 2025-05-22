import { Component } from '@angular/core';
import { CreateSale } from '../../../models/create-sale.model';
import { SaleService } from '../../../services/sale.service';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sale-create',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './sale-create.component.html',
  styleUrl: './sale-create.component.css'
})
export class SaleCreateComponent {
  saleForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private saleService: SaleService
  ) {
    this.saleForm = this.fb.group({
      clientId: [null, Validators.required],
      userId: [null, Validators.required],
      saleDetails: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.addSaleDetail(); // al menos un detalle al iniciar
  }

  get saleDetails(): FormArray {
    return this.saleForm.get('saleDetails') as FormArray;
  }

  addSaleDetail(): void {
  if (this.saleDetails.invalid) {
    this.saleDetails.markAllAsTouched(); // Para mostrar los errores en pantalla

    Swal.fire({
      icon: 'warning',
      title: 'Campos incompletos',
      text: 'Por favor, completa todos los detalles actuales antes de agregar uno nuevo.',
    });

    return;
  }

  const detailGroup = this.fb.group({
    accessoryId: [null, Validators.required],
    quantityType: [null, [Validators.required, Validators.min(1)]]
  });

  this.saleDetails.push(detailGroup);
}


  removeSaleDetail(index: number): void {
    this.saleDetails.removeAt(index);
  }

  onSubmit(): void {
  if (this.saleForm.valid) {
    const sale: CreateSale = this.saleForm.value;
    this.saleService.createSale(sale).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: '¡Venta registrada!',
          text: 'La venta se ha creado correctamente.',
          confirmButtonColor: '#3085d6',
          showConfirmButton: false,
          timer: 1500
        });
        this.saleForm.reset();
        this.saleDetails.clear();
        this.addSaleDetail();
      },
      error: err => {
        console.error(err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al registrar la venta.',
          confirmButtonColor: '#d33'
        });
      }
    });
  }
}

}
