import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Client } from '../models/client.model';
import { Observable, tap } from 'rxjs';
import { Page } from '../models/page.model';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private apiUrl = 'https://backend-api-gestion-accesorios.onrender.com/api/clients';

  constructor(private http: HttpClient) { }

  getClients(page: number): Observable<Page<Client>> {
    return this.http.get<Page<Client>>(`${this.apiUrl}/page/${page}`).pipe(
          tap((response) => this.setClientsToLocalStorage(response.content))
        );
  }

  setClientsToLocalStorage(clients: Client[]): void {
    localStorage.setItem('clients', JSON.stringify(clients));
  }

  createClient(client: Client): Observable<Client> {
    return this.http.post<Client>(this.apiUrl, client);
  }

  // Obtener cliente por ID
  getClientById(id: number): Observable<Client> {
    return this.http.get<Client>(`${this.apiUrl}/${id}`);
  }

  // Actualizar cliente
  updateClient(id: number, clientData: Client): Observable<Client> {
    return this.http.put<Client>(`${this.apiUrl}/${id}`, clientData);
  }

  deleteClient(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}
