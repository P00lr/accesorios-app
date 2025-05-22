import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Accessory } from '../models/accessory.model';
import { Page } from '../models/page.model';
import { CreateAccessory } from '../models/CreateAccessory.model';

@Injectable({
  providedIn: 'root'
})
export class AccessoryService {

  private apiUrl = 'http://localhost:8080/api/accessories';

  constructor(private http: HttpClient) { }

  //tap no modifa la respuesta pero puedo hacer acciones secundarioas en este caso 
  // guarda los accessories paginados en localStore tambien accion secundaria
  getAccesories(page: number): Observable<Page<Accessory>> {
    return this.http.get<Page<Accessory>>(`${this.apiUrl}/page/${page}`).pipe(
      tap((response) => this.setAccesoriesToLocalStorage(response.content))
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
