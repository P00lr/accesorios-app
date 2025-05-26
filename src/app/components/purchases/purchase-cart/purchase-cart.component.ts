import { Component, OnInit } from '@angular/core';
import { WarehouseService } from '../../../services/warehouse.service';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { WarehouseDetail } from '../../../models/warehouse-detail-model';
import { PurchaseService } from '../../../services/purchase.service';
import { CreatePurchase } from '../../../models/create-purchase.model';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Observable, startWith, map } from 'rxjs';

@Component({
  selector: 'app-purchase-cart',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './purchase-cart.component.html',
  styleUrls: ['./purchase-cart.component.css']
})
export class PurchaseCartComponent implements OnInit {
  warehouses: { id: number; name: string }[] = [];
  warehouseDetails: WarehouseDetail[] = [];
  accessoryOptions: WarehouseDetail[] = [];

  selectedWarehouseId: number | null = null;
  accessoryControl = new FormControl('');
  filteredAccessories$: Observable<WarehouseDetail[]> = new Observable();

  selectedAccessoryName: string = '';
  quantity: number | null = null;

  cart: { warehouseDetailId: number; accessoryName: string; quantity: number }[] = [];

  constructor(
    private warehouseService: WarehouseService,
    private purchaseService: PurchaseService
  ) { }

  ngOnInit(): void {
    this.warehouseService.getWarehouses(0).subscribe((page) => {
      this.warehouses = page.content;
    });

    this.warehouseService.getWarehouseDetails().subscribe((details) => {
      this.warehouseDetails = details;
    });

    this.filteredAccessories$ = this.accessoryControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const filterValue = value?.toLowerCase() || '';
        return this.accessoryOptions.filter(option =>
          option.accessoryName.toLowerCase().includes(filterValue)
        );
      })
    );
  }

  onWarehouseChange(): void {
    this.accessoryOptions = this.warehouseDetails.filter(
      wd => wd.warehouseId === this.selectedWarehouseId
    );
    this.accessoryControl.setValue('');
    this.selectedAccessoryName = '';
    this.quantity = null;
  }

  onAccessorySelected(name: string): void {
    this.selectedAccessoryName = name;
  }

  agregarAlCarrito(): void {
    const detail = this.accessoryOptions.find(acc => acc.accessoryName === this.selectedAccessoryName);
    if (!detail) return;

    this.cart.push({
      warehouseDetailId: detail.id,
      accessoryName: detail.accessoryName,
      quantity: this.quantity!,
    });

    this.accessoryControl.setValue('');
    this.selectedAccessoryName = '';
    this.quantity = null;
  }

  registrarCompra(): void {
    const payload: CreatePurchase = {
      supplierId: 1,
      userId: 2,
      purchaseDetails: this.cart.map(item => ({
        warehouseDetailId: item.warehouseDetailId,
        quantityType: item.quantity,
      })),
    };

    this.purchaseService.createPurchase(payload).subscribe(() => {
      alert('Compra registrada correctamente');
      this.cart = [];
    });
  }
}


