import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Supplier } from '../models/supplier.model';
import { Observable, tap } from 'rxjs';
import { Page } from '../models/page.model';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {

  private apiUrl = 'https://backend-api-gestion-accesorios.onrender.com/api/suppliers';

  constructor(private http: HttpClient) { }

  // Obtener todos los proveedores
  getSuppliers(page: number): Observable<Page<Supplier>> {
    return this.http.get<Page<Supplier>>(`${this.apiUrl}/page/${page}`).pipe(
      tap((response) => this.setSuppliersToLocalStorage(response.content))
    );
  }

  getAllSuppliers(): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(`${this.apiUrl}`).pipe(
      tap((response) => this.setSuppliersToLocalStorage(response))
    );
  }

  setSuppliersToLocalStorage(suppliers: Supplier[]): void {
    localStorage.setItem('suppliers', JSON.stringify(suppliers));
  }

  // Crear un proveedor
  createSupplier(supplier: Supplier): Observable<Supplier> {
    return this.http.post<Supplier>(this.apiUrl, supplier);
  }

  // Obtener proveedor por ID
  getSupplierById(id: number): Observable<Supplier> {
    return this.http.get<Supplier>(`${this.apiUrl}/${id}`);
  }

  // Actualizar proveedor
  updateSupplier(id: number, supplierData: Supplier): Observable<Supplier> {
    return this.http.put<Supplier>(`${this.apiUrl}/${id}`, supplierData);
  }

  // Eliminar proveedor
  deleteSupplier(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
