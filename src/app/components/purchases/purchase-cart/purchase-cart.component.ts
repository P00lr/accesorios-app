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
import { AccessoryService } from '../../../services/accessory.service';
import Swal from 'sweetalert2';
import { AuthService } from '../../../auth/auth.service';
import { SupplierService } from '../../../services/supplier.service';

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
  supplierControl = new FormControl('');
  filteredAccessories$: Observable<WarehouseDetail[]> = new Observable();
  filteredSuppliers$: Observable<{ id: number; name: string }[]> = new Observable();

  selectedAccessoryName: string = '';
  quantity: number | null = null;
  selectedSupplierId: number | null = null;

  suppliers: { id: number; name: string }[] = [];

  cart: { accessoryId: number; accessoryName: string; quantity: number }[] = [];

  constructor(
    private warehouseService: WarehouseService,
    private purchaseService: PurchaseService,
    private accessoriesServices: AccessoryService,
    private authService: AuthService,
    private supplierService: SupplierService
  ) { }

  ngOnInit(): void {
    this.warehouseService.getWarehouses(0).subscribe((page) => {
      this.warehouses = page.content;
    });

    this.supplierService.getSuppliers(0).subscribe((page) => {
      this.suppliers = page.content;
      this.filteredSuppliers$ = this.supplierControl.valueChanges.pipe(
        startWith(''),
        map(value => {
          const filterValue = value?.toLowerCase() || '';
          return this.suppliers.filter(s => s.name.toLowerCase().includes(filterValue));
        })
      );
    });

    this.warehouseService.getWarehouseDetails().subscribe((details) => {
      this.warehouseDetails = details;

      this.accessoriesServices.getAllAccessories().subscribe((accessories) => {
        this.accessoryOptions = accessories.map(accessory => ({
          id: accessory.id,
          warehouseId: 0,
          warehouseName: '',
          accessoryId: accessory.id,
          accessoryName: accessory.name,
          stock: 0,
          state: 'AVAILABLE'
        }));

        this.filteredAccessories$ = this.accessoryControl.valueChanges.pipe(
          startWith(''),
          map(value => {
            const filterValue = value?.toLowerCase() || '';
            return this.accessoryOptions.filter(option =>
              option.accessoryName.toLowerCase().includes(filterValue)
            );
          })
        );
      });

    });
  }

  onAccessorySelected(name: string): void {
    this.selectedAccessoryName = name;
  }

  onSupplierSelected(name: string): void {
    const selected = this.suppliers.find(s => s.name === name);
    this.selectedSupplierId = selected?.id || null;
  }

  agregarAlCarrito(): void {
    const detail = this.accessoryOptions.find(acc => acc.accessoryName === this.selectedAccessoryName);
    if (!detail) return;

    this.cart.push({
      accessoryId: detail.accessoryId,
      accessoryName: detail.accessoryName,
      quantity: this.quantity!,
    });

    this.accessoryControl.setValue('');
    this.selectedAccessoryName = '';
    this.quantity = null;
  }

  registrarCompra(): void {
    const userId = this.authService.getUserId();
    if (!this.selectedWarehouseId || !userId || !this.selectedSupplierId) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Selecciona almacén, proveedor y asegúrate de estar autenticado.',
      });
      return;
    }

    const payload: CreatePurchase = {
      supplierId: this.selectedSupplierId,
      userId: userId,
      warehouseId: this.selectedWarehouseId,
      purchaseDetails: this.cart.map(item => ({
        accessoryId: item.accessoryId,
        quantityType: item.quantity,
      })),
    };

    this.purchaseService.createPurchase(payload).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: '¡Compra registrada!',
          text: 'La compra se registró correctamente.',
          showConfirmButton: false,
          timer: 1450
        });
        this.cart = [];
        this.supplierControl.setValue('');
        this.selectedSupplierId = null;
      },
      error: (error) => {
        console.error(error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al registrar la compra.',
        });
      }
    });
  }

  eliminarDelCarrito(index: number): void {
    this.cart.splice(index, 1);
  }

}




