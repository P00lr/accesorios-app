import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Warehouse } from '../models/warehouse.model';
import { Page } from '../models/page.model';
import { WarehouseDetail } from '../models/warehouse-detail-model';

@Injectable({
  providedIn: 'root'
})
export class WarehouseService {
  private apiUrl: string = 'https://backend-api-gestion-accesorios.onrender.com/api/warehouses';
  constructor(private http: HttpClient) { }

  getWarehouses(page: number): Observable<Page<Warehouse>> {
    return this.http.get<Page<Warehouse>>(`${this.apiUrl}/page/${page}`).pipe(
      tap((response) => this.setWarehousesToLocalStorage(response.content))
    );
  }

  getAllWarehouses(): Observable<Warehouse[]> {
    return this.http.get<Warehouse[]>(`${this.apiUrl}`).pipe(
      tap((respose) => this.setWarehousesToLocalStorage(respose))
    );
  }

  getWarehouseDetails(): Observable<WarehouseDetail[]> {
    return this.http.get<WarehouseDetail[]>(`${this.apiUrl}/details`);
  }


  setWarehousesToLocalStorage(warehouses: Warehouse[]) {
    localStorage.setItem('warehouses', JSON.stringify(warehouses));
  }

  createWarehouse(warehouse: Warehouse): Observable<Warehouse> {
    return this.http.post<Warehouse>(this.apiUrl, warehouse);
  }

  getWarehouseById(id: number): Observable<Warehouse> {
    return this.http.get<Warehouse>(`${this.apiUrl}/${id}`);
  }

  updateWarehouse(id: number, WarehouseData: Warehouse): Observable<Warehouse> {
    return this.http.put<Warehouse>(`${this.apiUrl}/${id}`, WarehouseData);
  }

  deleteWarehouse(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  sendInventoryReportByEmail(payload: {
  destinatarios: string[],
  warehouseIds: number[],
  accessoryIds: number[],
  categoryIds: number[],
}): Observable<void> {
  return this.http.post<void>('https://backend-api-gestion-accesorios.onrender.com/api/email/inventory', payload);
}

}
