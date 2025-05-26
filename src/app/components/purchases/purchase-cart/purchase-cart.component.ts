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

  cart: { accessoryId: number; accessoryName: string; quantity: number }[] = [];


  constructor(
    private warehouseService: WarehouseService,
    private purchaseService: PurchaseService,
    private accessoriesServices: AccessoryService
  ) { }

  ngOnInit(): void {
    // Cargar almacenes
    this.warehouseService.getWarehouses(0).subscribe((page) => {
      this.warehouses = page.content;
    });

    // Cargar todos los WarehouseDetails (contienen accessory + warehouse info)
    this.warehouseService.getWarehouseDetails().subscribe((details) => {
      this.warehouseDetails = details;
      // Asignamos todos los warehouseDetails a accessoryOptions para autocompletado
      this.accessoryOptions = details;

      // Aquí cargas todos los accesorios desde la base de datos con AccessoryService
      this.accessoriesServices.getAccesories(0).subscribe((page) => {
        // Mapea los accesorios a WarehouseDetail para que encaje con accessoryOptions
        this.accessoryOptions = page.content.map(accessory => ({
          id: accessory.id,                  // usar id del accesorio para warehouseDetailId provisional
          warehouseId: 0,                   // valor dummy porque no depende de almacén
          warehouseName: '',
          accessoryId: accessory.id,
          accessoryName: accessory.name,
          stock: 0,                        // no tienes stock aquí, pon 0 o ajusta si tienes otro dato
          state: 'AVAILABLE'
        }));
      });

      // Inicializar el filtro para el autocompletado
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
  }

  onAccessorySelected(name: string): void {
    this.selectedAccessoryName = name;
  }

  agregarAlCarrito(): void {
    const detail = this.accessoryOptions.find(acc => acc.accessoryName === this.selectedAccessoryName);
    if (!detail) return;

    this.cart.push({
      accessoryId: detail.accessoryId, // ← si viene anidado
      accessoryName: detail.accessoryName,
      quantity: this.quantity!,
    });

    this.accessoryControl.setValue('');
    this.selectedAccessoryName = '';
    this.quantity = null;
  }


  registrarCompra(): void {
  if (!this.selectedWarehouseId) {
    Swal.fire({
      icon: 'warning',
      title: 'Almacén no seleccionado',
      text: 'Selecciona un almacén antes de registrar la compra',
    });
    return;
  }

  const payload: CreatePurchase = {
    supplierId: 1,
    userId: 2,
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
        showConfirmButton:false,
        timer: 1450,
        text: 'La compra se registró correctamente.',
      });
      this.cart = [];
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

}



