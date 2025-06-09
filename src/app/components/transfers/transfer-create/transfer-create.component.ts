import { Component, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { debounceTime, map, Observable, startWith } from 'rxjs';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { Warehouse } from '../../../models/warehouse.model';
import { WarehouseDetail } from '../../../models/warehouse-detail-model';
import { WarehouseService } from '../../../services/warehouse.service';
import { TransferService } from '../../../services/transfer.service';
import { CreateTransfer } from '../../../models/create-transfer';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-transfer-create',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    RouterModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './transfer-create.component.html',
  styleUrl: './transfer-create.component.css',
})
export class TransferCreateComponent implements OnInit {
  // Datos base
  warehouses: Warehouse[] = [];
  warehouseDetails: WarehouseDetail[] = [];

  // FormControls
  originWarehouseControl = new FormControl<Warehouse | string>('');
  accessoryControl = new FormControl<string>('');

  // Observables filtrados
  filteredWarehouses$!: Observable<Warehouse[]>;
  filteredAccessories$!: Observable<WarehouseDetail[]>;

  // Estado de formulario
  originWarehouseId: number | null = null;
  destinationWarehouseId: number | null = null;
  selectedOrigin: Warehouse | null = null;
  selectedAccessory: WarehouseDetail | null = null;
  description = '';
  quantity: number | null = null;

  // Items de transferencia
  transferItems: { warehouseDetailId: number; accessoryName: string; quantity: number }[] = [];

  constructor(
    private warehouseService: WarehouseService,
    private transferService: TransferService
  ) { }

  ngOnInit(): void {
    this.warehouseService.getWarehouses(0).subscribe(res => {
      this.warehouses = res.content;

      this.filteredWarehouses$ = this.originWarehouseControl.valueChanges.pipe(
        startWith(''),
        debounceTime(300),
        map(value => this.filterWarehouses(value || ''))
      );
    });

    this.warehouseService.getWarehouseDetails().subscribe(res => {
      this.warehouseDetails = res;
    });

    this.filteredAccessories$ = this.accessoryControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      map(value => this.filterAccessories(value || ''))
    );
  }

  onSelectOrigin(event: MatAutocompleteSelectedEvent): void {
    const warehouse = event.option.value as Warehouse;
    this.selectedOrigin = warehouse;
    this.originWarehouseId = warehouse.id;

    // Reset accesorios y cantidad
    this.accessoryControl.setValue('');
    this.selectedAccessory = null;
    this.quantity = null;
  }

  onSelectAccessory(accessoryName: string): void {
    this.selectedAccessory = this.warehouseDetails.find(
      wd =>
        wd.accessoryName === accessoryName &&
        wd.warehouseId === this.originWarehouseId
    ) || null;
  }

  agregarItem(): void {
    if (!this.selectedAccessory || !this.quantity || this.quantity <= 0) {
      Swal.fire('Error', 'Ingrese una cantidad válida mayor a cero.', 'error');
      return;
    }

    // Obtener stock disponible del accesorio seleccionado
    const stockDisponible = this.selectedAccessory.stock; // o el nombre de la propiedad que indica stock

    if (this.quantity > stockDisponible) {
      Swal.fire(
        'Error',
        `La cantidad excede el stock disponible (${stockDisponible}).`,
        'error'
      );
      return;
    }

    // Verificar si ya existe el accesorio en el carrito y sumar cantidades sin exceder stock
    const itemExistente = this.transferItems.find(
      item => item.warehouseDetailId === this.selectedAccessory!.id
    );

    if (itemExistente) {
      const nuevaCantidad = itemExistente.quantity + this.quantity;
      if (nuevaCantidad > stockDisponible) {
        Swal.fire(
          'Error',
          `La cantidad total excede el stock disponible (${stockDisponible}).`,
          'error'
        );
        return;
      }
      itemExistente.quantity = nuevaCantidad;
    } else {
      this.transferItems.push({
        warehouseDetailId: this.selectedAccessory.id,
        accessoryName: this.selectedAccessory.accessoryName,
        quantity: this.quantity
      });
    }

    // Limpiar campos
    this.accessoryControl.setValue('');
    this.selectedAccessory = null;
    this.quantity = null;
  }


  eliminarItem(index: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡Se eliminara de la lista de transferencias!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.transferItems.splice(index, 1);
        Swal.fire(
          'Eliminado',
          'El accesorio ha sido eliminado.',
          'success'
        );
      }
    });
  }

  confirmarTransferencia(): void {
    if (
      !this.originWarehouseId ||
      !this.destinationWarehouseId ||
      !this.transferItems.length
    ) return;

    const payload: CreateTransfer = {
      description: this.description,
      userId: 1, // fijo por ahora
      originWarehouseId: this.originWarehouseId,
      destinationWarehouseId: this.destinationWarehouseId,
      transferDetails: this.transferItems.map(item => ({
        warehouseDetailId: item.warehouseDetailId,
        quantity: item.quantity,
      })),
    };

    this.transferService.createTransfer(payload).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'Transferencia registrada exitosamente',
          confirmButtonText: 'Aceptar'
        });
        this.transferItems = [];
        this.description = '';
        this.originWarehouseControl.reset();
        this.destinationWarehouseId = null;
        this.accessoryControl.reset();
        this.quantity = null;
        this.selectedAccessory = null;
        this.originWarehouseId = null;
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo registrar la transferencia. Intenta de nuevo.',
          confirmButtonText: 'Aceptar'
        });
        console.error('Error en transferencia:', err);
      }
    });
  }


  /**
   * Función para mostrar el nombre del almacén seleccionado en el input.
   */
  displayWarehouse(warehouse: Warehouse): string {
    return warehouse ? warehouse.name : '';
  }

  /**
   * Filtra almacenes por nombre.
   */
  private filterWarehouses(value: string | Warehouse): Warehouse[] {
    const filterValue =
      typeof value === 'string'
        ? value.toLowerCase()
        : value?.name?.toLowerCase() || '';

    return this.warehouses.filter(wh =>
      wh.name.toLowerCase().includes(filterValue)
    );
  }

  /**
   * Filtra accesorios disponibles en el almacén origen por nombre.
   */
  private filterAccessories(value: string): WarehouseDetail[] {
    const filterValue = value.toLowerCase();
    return this.warehouseDetails
      .filter(wd => wd.warehouseId === this.originWarehouseId)
      .filter(wd =>
        wd.accessoryName.toLowerCase().includes(filterValue)
      );
  }
}
