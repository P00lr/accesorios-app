import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Accessory } from '../models/accessory.model';
import { Page } from '../models/page.model';
import { CreateAccessory } from '../models/CreateAccessory.model';
import { AccessoryCatalog } from '../models/accessory-catalog.model';

@Injectable({
  providedIn: 'root'
})
export class AccessoryService {

  private apiUrl = 'https://backend-api-gestion-accesorios.onrender.com/api/accessories';

  constructor(private http: HttpClient) { }

  //tap no modifa la respuesta pero puedo hacer acciones secundarioas en este caso 
  // guarda los accessories paginados en localStore tambien accion secundaria
  getAccesories(page: number): Observable<Page<Accessory>> {
    return this.http.get<Page<Accessory>>(`${this.apiUrl}/page/${page}`).pipe(
      tap((response) => this.setAccesoriesToLocalStorage(response.content))
    );  
  }

  getAccessoriesCatalog(page: number): Observable<Page<AccessoryCatalog>> {
    return this.http.get<Page<AccessoryCatalog>>(`${this.apiUrl}/page/catalog/${page}`);
  }

  getAllAccessories(): Observable<Accessory[]> {
    return this.http.get<Accessory[]>(`${this.apiUrl}`).pipe(
      tap((response) => this.setAccesoriesToLocalStorage(response))
    );
  }


  setAccesoriesToLocalStorage(accesories: Accessory[]): void {
    localStorage.setItem('accesories', JSON.stringify(accesories));
  }
  //Partial para enviar los datos requeridos no todos
  createAccessory(accessory: Partial<Accessory>): Observable<Accessory> {
    return this.http.post<Accessory>(this.apiUrl, accessory);
  }
  getAccessoryById(id: number): Observable<Accessory> {
    return this.http.get<Accessory>(`${this.apiUrl}/${id}`);
  }

  updateAccessory(id: number, accessoryData: CreateAccessory): Observable<Accessory> {
    return this.http.put<Accessory>(`${this.apiUrl}/${id}`, accessoryData);
  }


  deleteAccessory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}
