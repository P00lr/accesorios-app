import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TransferService } from '../../../services/transfer.service';
import { Router, RouterModule } from '@angular/router';
import { CreateTransfer } from '../../../models/create-transfer';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-transfer-create',
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './transfer-create.component.html',
  styleUrl: './transfer-create.component.css'
})
export class TransferCreateComponent {
  transferForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private transferService: TransferService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.transferForm = this.fb.group({
      description: ['', Validators.required],
      userId: [null, Validators.required],
      originWarehouseId: [null, Validators.required],
      destinationWarehouseId: [null, Validators.required],
      transferDetails: this.fb.array([])
    });

    this.addTransferDetail();
  }

  get transferDetails(): FormArray {
    return this.transferForm.get('transferDetails') as FormArray;
  }

  addTransferDetail(): void {
    const detailGroup = this.fb.group({
      warehouseDetailId: [null, Validators.required],
      quantity: [null, [Validators.required, Validators.min(1)]]
    });
    this.transferDetails.push(detailGroup);
  }

  removeTransferDetail(index: number): void {
    this.transferDetails.removeAt(index);
  }

  onSubmit(): void {
    if (this.transferForm.invalid) return;

    const dto: CreateTransfer = this.transferForm.value;
    this.transferService.createTransfer(dto).subscribe({
      next: () => {
        alert('Transferencia creada exitosamente');
        this.router.navigate(['/transfers']);
      },
      error: (err) => {
        console.error('Error al crear transferencia:', err);
        alert('Hubo un error al crear la transferencia');
      }
    });
  }
}
