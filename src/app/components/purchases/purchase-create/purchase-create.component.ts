import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PurchaseService } from '../../../services/purchase.service';
import { CreatePurchase } from '../../../models/create-purchase.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-purchase-create',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './purchase-create.component.html',
  styleUrl: './purchase-create.component.css'
})
export class PurchaseCreateComponent {
  purchaseForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private purchaseService: PurchaseService
  ) {
    this.purchaseForm = this.fb.group({
      supplierId: [null, Validators.required],
      userId: [null, Validators.required],
      purchaseDetails: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.addPurchaseDetail(); // al menos un detalle al iniciar
  }

  get purchaseDetails(): FormArray {
    return this.purchaseForm.get('purchaseDetails') as FormArray;
  }

  addPurchaseDetail(): void {
  const lastDetail = this.purchaseDetails.at(this.purchaseDetails.length - 1);

  // Solo permitir agregar si el último está completo y válido
  if (this.purchaseDetails.length === 0 || (lastDetail && lastDetail.valid)) {
    const detailGroup = this.fb.group({
      warehouseDetailId: [null, Validators.required],
      quantityType: [null, [Validators.required, Validators.min(1)]]
    });

    this.purchaseDetails.push(detailGroup);
  } else {
    Swal.fire({
      icon: 'warning',
      title: 'Campos incompletos',
      text: 'Por favor completa los campos del detalle actual antes de agregar uno nuevo.',
      confirmButtonColor: '#3085d6'
    });
  }
}


  removePurchaseDetail(index: number): void {
    this.purchaseDetails.removeAt(index);
  }

  onSubmit(): void {
  if (this.purchaseForm.valid) {
    const purchase: CreatePurchase = this.purchaseForm.value;
    this.purchaseService.createPurchase(purchase).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: '¡Compra creada!',
          text: 'La compra se ha registrado correctamente.',
          confirmButtonColor: '#3085d6',
          showConfirmButton: false,
          timer: 1200
        });
        this.purchaseForm.reset();
        this.purchaseDetails.clear();
        this.addPurchaseDetail();
      },
      error: err => {
        console.error(err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al crear la compra.',
          confirmButtonColor: '#d33'
        });
      }
    });
  }
}

}
