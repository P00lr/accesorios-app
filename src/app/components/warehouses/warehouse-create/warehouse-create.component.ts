import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { WarehouseService } from '../../../services/warehouse.service';
import { Router, RouterModule } from '@angular/router';

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
    if (this.warehouseForm.invalid) return;

    this.warehouseService.createWarehouse(this.warehouseForm.value).subscribe({
      next: () => this.router.navigate(['/warehouses']),
      error: (err) => {
        console.error('Error al crear cliente:', err);
        this.errorMessage = 'Hubo un error al crear el cliente';
      }
    });
  }
}
