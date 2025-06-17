import { Component, OnInit } from '@angular/core';
import { Warehouse } from '../../../models/warehouse.model';
import { Accessory } from '../../../models/accessory.model';
import { Category } from '../../../models/category.model';
import { WarehouseService } from '../../../services/warehouse.service';
import { AccessoryService } from '../../../services/accessory.service';
import { CategoryService } from '../../../services/category.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { debounceTime, map, Observable, startWith } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCard, MatCardModule, MatCardTitle } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../auth/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-inventory-report',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatCard,
    MatCardTitle,
    MatChipsModule,
    MatIconModule,
    NgxExtendedPdfViewerModule,
  ],
  templateUrl: './inventory-report.component.html',
  styleUrl: './inventory-report.component.css',

})
export class InventoryReportComponent implements OnInit {
  pdfBlob: Blob | null = null;
  pdfSrc: string | null = null;

  warehouses: Warehouse[] = [];
  accessories: Accessory[] = [];
  categories: Category[] = [];

  warehouseControl = new FormControl<Warehouse[]>([], { nonNullable: true });
  accessoryControl = new FormControl<Accessory[]>([], { nonNullable: true });
  categoryControl = new FormControl<Category[]>([], { nonNullable: true });

  warehouseInput = new FormControl('');
  accessoryInput = new FormControl('');
  categoryInput = new FormControl('');

  filteredWarehouses$!: Observable<Warehouse[]>;
  filteredAccessories$!: Observable<Accessory[]>;
  filteredCategories$!: Observable<Category[]>;

  emailRecipients: string[] = [];
  emailInput: string = '';

  emailSubject: string = 'Reporte de Inventario Detallado';
  emailMessage: string = 'Adjunto encontrarás el reporte de inventario solicitado.';



  constructor(
    private warehouseService: WarehouseService,
    private accessoryService: AccessoryService,
    private categoryService: CategoryService,
    private http: HttpClient,
    private userService: UserService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadFilters();
  }

  loadFilters(): void {
    this.warehouseService.getAllWarehouses().subscribe(data => {
      this.warehouses = data;
      this.filteredWarehouses$ = this.warehouseInput.valueChanges.pipe(
        startWith(''),
        debounceTime(300),
        map(value => this.filterOptions(value ?? '', this.warehouses, 'name'))
      );
    });

    this.accessoryService.getAllAccessories().subscribe(data => {
      this.accessories = data;
      this.filteredAccessories$ = this.accessoryInput.valueChanges.pipe(
        startWith(''),
        debounceTime(300),
        map(value => this.filterOptions(value ?? '', this.accessories, 'name'))
      );
    });

    this.categoryService.getAllCategories().subscribe(data => {
      this.categories = data;
      this.filteredCategories$ = this.categoryInput.valueChanges.pipe(
        startWith(''),
        debounceTime(300),
        map(value => this.filterOptions(value ?? '', this.categories, 'name'))
      );
    });
  }

  filterOptions(value: string, list: any[], key: string): any[] {
    const filterValue = value?.toLowerCase?.() || '';
    return list.filter(item => item[key].toLowerCase().includes(filterValue));
  }

  addItem<T extends { id: any }>(item: T, control: FormControl<T[]>): void {
    const current = control.value || [];
    if (!current.find(i => i.id === item.id)) {
      control.setValue([...current, item]);
    }
  }

  removeItem<T extends { id: any }>(item: T, control: FormControl<T[]>): void {
    control.setValue(control.value?.filter(i => i.id !== item.id) || []);
  }

  buildParams(): HttpParams {
    let params = new HttpParams();

    this.warehouseControl.value?.forEach(w => {
      params = params.append('warehouseIds', w.id);
    });

    this.accessoryControl.value?.forEach(a => {
      params = params.append('accessoryIds', a.id);
    });

    this.categoryControl.value?.forEach(c => {
      params = params.append('categoryIds', c.id);
    });

    return params;
  }

  generateReport(): void {
    const params = this.buildParams();

    this.http.get('https://backend-api-gestion-accesorios.onrender.com/api/warehouses/report', {
      params,
      responseType: 'blob'
    }).subscribe(blob => {
      this.pdfBlob = blob;
      this.pdfSrc = '';
      setTimeout(() => {
        this.pdfSrc = URL.createObjectURL(blob);
      }, 50);
    });
  }

  downloadReport(): void {
    const params = this.buildParams();

    this.http.get('https://backend-api-gestion-accesorios.onrender.com/api/warehouses/report', {
      params,
      responseType: 'blob'
    }).subscribe(blob => {
      const a = document.createElement('a');
      const url = URL.createObjectURL(blob);
      a.href = url;
      a.download = 'inventario.pdf';
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  onWarehouseInputTokenEnd(event: any, inputElem: HTMLInputElement): void {
    const value = event.value.trim();
    if (!value) return;
    const found = this.warehouses.find(w => w.name.toLowerCase() === value.toLowerCase());
    if (found) {
      this.addItem(found, this.warehouseControl);
    }
    inputElem.value = '';
    this.warehouseInput.setValue('');
  }

  onAccessoryInputTokenEnd(event: any, inputElem: HTMLInputElement): void {
    const value = event.value.trim();
    if (!value) return;
    const found = this.accessories.find(a => a.name.toLowerCase() === value.toLowerCase());
    if (found) {
      this.addItem(found, this.accessoryControl);
    }
    inputElem.value = '';
    this.accessoryInput.setValue('');
  }

  onCategoryInputTokenEnd(event: any, inputElem: HTMLInputElement): void {
    const value = event.value.trim();
    if (!value) return;
    const found = this.categories.find(c => c.name.toLowerCase() === value.toLowerCase());
    if (found) {
      this.addItem(found, this.categoryControl);
    }
    inputElem.value = '';
    this.categoryInput.setValue('');
  }

  addEmail(): void {
    const email = this.emailInput.trim();
    if (email && !this.emailRecipients.includes(email)) {
      this.emailRecipients.push(email);
    }
    this.emailInput = '';
  }

  removeEmail(email: string): void {
    this.emailRecipients = this.emailRecipients.filter(e => e !== email);
  }

  sendReport(): void {
    if (this.emailRecipients.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: '⚠️ Sin destinatarios',
        text: 'Debes agregar al menos un correo electrónico antes de enviar el reporte.',
      });
      return;
    }

    const userId = this.authService.getUserId();
    if (userId === null) {
      Swal.fire({
        icon: 'error',
        title: '❌ Error',
        text: 'No se pudo obtener el ID del usuario.',
      });
      return;
    }

    this.userService.getUserById(userId).subscribe({
      next: (user) => {
        const payload = {
          destinatarios: this.emailRecipients,
          warehouseIds: this.warehouseControl.value.map(w => w.id),
          accessoryIds: this.accessoryControl.value.map(a => a.id),
          categoryIds: this.categoryControl.value.map(c => c.id),
          generadoPor: user.email,
          asunto: this.emailSubject,
          mensaje: this.emailMessage
        };

        this.http.post('https://backend-api-gestion-accesorios.onrender.com/api/email/inventory', payload)
          .subscribe({
            next: () => {
              Swal.fire({
                icon: 'success',
                title: '📧 Enviado',
                text: 'Reporte enviado correctamente por correo electrónico.',
              });
            },
            error: (err) => {
              Swal.fire({
                icon: 'error',
                title: '❌ Error al enviar',
                text: err?.error || 'Ocurrió un error inesperado al enviar el correo.',
              });
            }
          });
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: '❌ Error',
          text: 'No se pudo obtener la información del usuario.',
        });
      }
    });
  }

  onEmailEnter(event: Event): void {
    event.preventDefault();  // Evita que se dispare el submit del form
    this.addEmail();
  }




}


