import { Component, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdjustmentService } from '../../../services/adjustment.service';
import { CommonModule } from '@angular/common';
import { WarehouseService } from '../../../services/warehouse.service';
import { AccessoryService } from '../../../services/accessory.service';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { Warehouse } from '../../../models/warehouse.model';
import { debounceTime, map, Observable, startWith } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import Swal from 'sweetalert2';
import { CreateAdjustment } from '../../../models/createAjustment.model';
import { Accessory } from '../../../models/accessory.model';


@Component({
  selector: 'app-adjustment-create',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatGridListModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    FormsModule,
    MatCardModule

  ],
  templateUrl: './adjustment-create.component.html',
  styleUrl: './adjustment-create.component.css'
})
export class AdjustmentCreateComponent implements OnInit {
  warehouses: Warehouse[] = [];
  accessories: Accessory[] = [];

  warehouseControl = new FormControl<Warehouse | string>('');
  accessoryControl = new FormControl<string>('');

  filteredWarehouses$!: Observable<Warehouse[]>;
  filteredAccessories$!: Observable<Accessory[]>;

  selectedWarehouse: Warehouse | null = null;
  selectedAccessory: Accessory | null = null;

  quantity: number | null = null;
  type: string = 'ADD';
  description: string = '';
  itemDescription: string = '';
  userId: number = 1; // fijo por ahora

  adjustmentItems: { accessoryId: number; accessoryName: string; quantity: number, itemDescription: string }[] = [];

  constructor(
    private warehouseService: WarehouseService,
    private accessoryService: AccessoryService,
    private adjustmentService: AdjustmentService
  ) { }

  ngOnInit(): void {
    this.warehouseService.getWarehouses(0).subscribe(res => {
      this.warehouses = res.content;
      this.filteredWarehouses$ = this.warehouseControl.valueChanges.pipe(
        startWith(''),
        debounceTime(300),
        map(value => this.filterWarehouses(value || ''))
      );
    });

    this.accessoryService.getAccesories(0).subscribe(res => {
      this.accessories = res.content;
      this.filteredAccessories$ = this.accessoryControl.valueChanges.pipe(
        startWith(''),
        debounceTime(300),
        map(value => this.filterAccessories(value || ''))
      );
    });
  }

  onSelectWarehouse(event: MatAutocompleteSelectedEvent): void {
    const warehouse = event.option.value as Warehouse;
    this.selectedWarehouse = warehouse;
    this.resetAccessoryInput();
  }

  onSelectAccessory(accessoryName: string): void {
    const accessory = this.accessories.find(acc => acc.name === accessoryName) || null;
    if (!accessory) {
      this.selectedAccessory = null;
      return;
    }

    const exists = this.adjustmentItems.some(item => item.accessoryId === accessory.id);
    if (exists) {
      Swal.fire('Error', 'Este accesorio ya fue agregado.', 'error');
      this.accessoryControl.reset();
      this.selectedAccessory = null;
      return;
    }

    this.selectedAccessory = accessory;
  }

  agregarItem(): void {
    if (!this.selectedAccessory || !this.quantity || this.quantity <= 0) {
      Swal.fire('Error', 'Ingrese un accesorio y cantidad válida.', 'error');
      return;
    }

    const exists = this.adjustmentItems.some(item =>
      item.accessoryId === this.selectedAccessory!.id
    );

    if (exists) {
      Swal.fire('Error', 'Este accesorio ya fue agregado.', 'error');
      return;
    }

    this.adjustmentItems.push({
      accessoryId: this.selectedAccessory.id,
      accessoryName: this.selectedAccessory.name,
      quantity: this.quantity,
      itemDescription: this.itemDescription
    });

    this.resetAccessoryInput();

    // Refrescar filtro para excluir el accesorio recién agregado
    this.filteredAccessories$ = this.accessoryControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      map(value => this.filterAccessories(value || ''))
    );
  }

  eliminarItem(index: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Este ítem se eliminará del ajuste.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.adjustmentItems.splice(index, 1);
        Swal.fire({
          icon: 'success',
          title: 'Eliminado',
          text: 'El ítem fue eliminado correctamente.',
          timer: 1300,
          showConfirmButton: false
        });
      }
    });
  }


  guardarAjuste(): void {
    if (!this.selectedWarehouse || this.adjustmentItems.length === 0) {
      Swal.fire('Error', 'Completa todos los campos requeridos.', 'error');
      return;
    }

    const payload: CreateAdjustment = {
      date: new Date().toISOString(),
      type: this.type,
      description: this.description,
      userId: this.userId,
      warehouseId: this.selectedWarehouse.id,
      adjustmentDetails: this.adjustmentItems.map(item => ({
        accessoryId: item.accessoryId,
        quantity: item.quantity,
        itemDescription: item.itemDescription
      }))
    };

    this.adjustmentService.createAdjustment(payload).subscribe({
      next: () => {
        Swal.fire('Éxito', 'Ajuste registrado correctamente.', 'success');
        this.resetFormulario();
      },
      error: () => {
        Swal.fire('Error', 'No se pudo registrar el ajuste.', 'error');
      }
    });
  }

  displayWarehouse(warehouse: Warehouse): string {
    return warehouse ? warehouse.name : '';
  }

  private filterWarehouses(value: string | Warehouse): Warehouse[] {
    const filterValue = typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase();
    return this.warehouses.filter(w => w.name.toLowerCase().includes(filterValue));
  }

  private filterAccessories(value: string): Accessory[] {
    const filterValue = value.toLowerCase();
    return this.accessories.filter(acc =>
      acc.name.toLowerCase().includes(filterValue) &&
      !this.adjustmentItems.some(item => item.accessoryId === acc.id)
    );
  }

  resetAccessoryInput(): void {
    this.selectedAccessory = null;
    this.quantity = null;
    this.itemDescription = '';
    this.accessoryControl.reset();
  }


  private resetFormulario(): void {
    this.description = '';
    this.itemDescription = '';
    this.type = 'ADD';
    this.warehouseControl.reset();
    this.selectedWarehouse = null;
    this.adjustmentItems = [];
    this.resetAccessoryInput();
  }
}
