import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { CommonModule } from '@angular/common';
import { DashboardDTO } from '../../models/dashboard.model';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { LowStockItem } from '../../models/LowStockItem.model';
import { Page } from '../../models/page.model';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { TopSellingAccessory } from '../../models/TopSellingAccessor.model';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { TopCustomer } from '../../models/topCustomer.model';
import { MatProgressBarModule } from '@angular/material/progress-bar';


@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatTableModule,
    MatPaginatorModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressBarModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  //global
  dashboardData!: DashboardDTO;
  isLoading: boolean = true;

  // Low Stock Section
  lowStockItems: LowStockItem[] = [];
  lowStockPage: Page<LowStockItem> | null = null;
  page: number = 0;
  size: number = 5;
  lowStockThreshold: number = 20;

  // top selling accessories
  topSellingAccessories: TopSellingAccessory[] = [];
  pageData!: Page<TopSellingAccessory>;

  pageIndex = 0;
  pageSize = 5;
  pageSizeOptions = [5, 10, 15];

  startDate = new FormControl<Date | null>(null);
  endDate = new FormControl<Date | null>(null);

  isLoadingSelling = false;
  errorMsg = '';

  //top customers
  // Propiedades en la clase DashboardComponent
  topCustomers: TopCustomer[] = [];
  pageDataCustomers!: Page<TopCustomer>;
  isLoadingCustomers = false;
  pageIndexCustomers = 0;
  pageSizeCustomers = 5;
  errorMsgCustomers = '';


  constructor(private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.fetchDashboardData();
    this.fetchLowStockItems();
    this.fetchTopSellingAccessories();
    this.fetchTopCustomers();
  }

  fetchDashboardData(): void {
    this.dashboardService.getDashboardData().subscribe(data => {
      this.dashboardData = data;
      this.isLoading = false;
    });
  }

  fetchLowStockItems(pageIndex: number = 0, pageSize: number = 5): void {
    this.dashboardService.getLowStockItems(this.lowStockThreshold, pageIndex, pageSize)
      .subscribe(response => {
        this.lowStockItems = response.content;
        this.lowStockPage = response;
      });
  }

  changePage(event: PageEvent): void {
    this.page = event.pageIndex;
    this.size = event.pageSize;
    this.fetchLowStockItems(this.page, this.size);
  }


  //top selling accessories
  fetchTopSellingAccessories(pageIndex: number = this.pageIndex, pageSize: number = this.pageSize): void {
    this.isLoadingSelling = true;
    this.errorMsg = '';

    const start: Date | undefined = this.startDate.value ?? undefined;
    const end: Date | undefined = this.endDate.value ?? undefined;

    this.dashboardService.getTopSellingAccessories(start, end, pageIndex, pageSize).subscribe({
      next: response => {
        this.topSellingAccessories = response.content;
        this.pageData = response;
        this.pageIndex = pageIndex;
        this.pageSize = pageSize;
        this.isLoadingSelling = false;
      },
      error: err => {
        this.errorMsg = 'Error al cargar accesorios más vendidos.';
        this.isLoadingSelling = false;
      }
    });
  }


  onPageChange(event: any): void {
    this.fetchTopSellingAccessories(event.pageIndex, event.pageSize);
  }

  onFilterApply(): void {
    this.pageIndex = 0;
    this.fetchTopSellingAccessories(0, this.pageSize);
  }

  onFilterClear(): void {
    this.startDate.setValue(null);
    this.endDate.setValue(null);
    this.onFilterApply();
  }

  fetchTopCustomers(pageIndex: number = this.pageIndexCustomers, pageSize: number = this.pageSizeCustomers): void {
    this.isLoadingCustomers = true;
    this.errorMsgCustomers = '';

    this.dashboardService.getTopCustomers(pageIndex, pageSize).subscribe({
      next: response => {
        this.topCustomers = response.content;
        this.pageDataCustomers = response;
        this.pageIndexCustomers = pageIndex;
        this.pageSizeCustomers = pageSize;
        this.isLoadingCustomers = false;
      },
      error: err => {
        this.errorMsgCustomers = 'Error al cargar los clientes más frecuentes.';
        this.isLoadingCustomers = false;
      }
    });
  }

  // Evento para el paginado
  onPageChangeCustomers(event: any): void {
    this.fetchTopCustomers(event.pageIndex, event.pageSize);
  }

}
