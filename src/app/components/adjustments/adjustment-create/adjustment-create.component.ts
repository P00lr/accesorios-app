import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdjustmentService } from '../../../services/adjustment.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-adjustment-create',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './adjustment-create.component.html',
  styleUrl: './adjustment-create.component.css'
})
export class AdjustmentCreateComponent {
  adjustmentForm!: FormGroup;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private adjustmentService: AdjustmentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.adjustmentForm = this.fb.group({
      date: [new Date().toISOString().slice(0,19), Validators.required], // fecha inicial en formato YYYY-MM-DDTHH:mm:ss
      type: ['', Validators.required],
      description: ['', Validators.required],
      userId: [null, Validators.required],
      adjustmentDetails: this.fb.array([this.createAdjustmentDetail()])
    });
  }

  get adjustmentDetails(): FormArray {
    return this.adjustmentForm.get('adjustmentDetails') as FormArray;
  }

  createAdjustmentDetail(): FormGroup {
    return this.fb.group({
      warehouseDetailId: [null, Validators.required],
      quantity: [null, [Validators.required, Validators.min(1)]]
    });
  }

  addAdjustmentDetail(): void {
    this.adjustmentDetails.push(this.createAdjustmentDetail());
  }

  removeAdjustmentDetail(index: number): void {
    if(this.adjustmentDetails.length > 1) {
      this.adjustmentDetails.removeAt(index);
    }
  }

  onSubmit(): void {
    if (this.adjustmentForm.invalid) return;

    // Enviar formulario completo (fecha ya está en formato ISO sin zona horaria)
    this.adjustmentService.createAdjustment(this.adjustmentForm.value).subscribe({
      next: () => this.router.navigate(['/adjustments']),
      error: err => {
        console.error('Error al crear ajuste:', err);
        this.errorMessage = 'Hubo un error al crear el ajuste';
      }
    });
  }

} 
