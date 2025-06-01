import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { WarehouseService } from '../../../services/warehouse.service';
import { CommonModule } from '@angular/common';
import { Warehouse } from '../../../models/warehouse.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-warehouse-edit',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './warehouse-edit.component.html',
  styleUrl: './warehouse-edit.component.css'
})
export class WarehouseEditComponent {
  warehouseForm!: FormGroup;
  warehouseId!: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private warehouseService: WarehouseService
  ) {}

  ngOnInit(): void {
    this.warehouseId = +this.route.snapshot.paramMap.get('id')!;
    
    this.warehouseForm = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required]
    });

    this.warehouseService.getWarehouseById(this.warehouseId).subscribe((warehouse: Warehouse) => {
      this.warehouseForm.patchValue(warehouse);
    });
  }

  onSubmit(): void {
  if (this.warehouseForm.valid) {
    const updatedWarehouse = this.warehouseForm.value;
    this.warehouseService.updateWarehouse(this.warehouseId, updatedWarehouse).subscribe(() => {
      Swal.fire({
        icon: 'success',
        title: 'Almacén actualizado',
        text: 'El almacén se actualizó correctamente.',
        confirmButtonText: 'Aceptar'
      }).then(() => {
        this.router.navigate(['/warehouses']);
      });
    });
  }
}
}
