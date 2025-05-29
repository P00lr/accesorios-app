import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Page } from '../models/page.model';
import { Sale } from '../models/list-sale.model';
import { CreateSale } from '../models/create-sale.model';
import { GetSale } from '../models/get-sale.model';

@Injectable({
  providedIn: 'root'
})
export class SaleService {

  private apiUrl = 'http://localhost:8080/api/sales';

  constructor(private http: HttpClient) { }

  getSalesByPage(page: number): Observable<Page<Sale>> {
    return this.http.get<Page<Sale>>(`${this.apiUrl}/page/${page}`).pipe(
      tap((response) => this.setSalesToLocalStorage(response.content))
    );
    
  }

  setSalesToLocalStorage(sales: Sale[]): void {
    localStorage.setItem('sales', JSON.stringify(sales));
  }

  createSale(sale: CreateSale): Observable<any> {
    return this.http.post(`${this.apiUrl}`, sale);
  }

  getSaleById(id: number): Observable<GetSale>  {
    return this.http.get<GetSale>(`${this.apiUrl}/${id}`);
  }

  deleteSaleById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
