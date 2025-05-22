import { Injectable } from '@angular/core';
import { Purchase } from '../models/purchase.model';
import { Observable, tap } from 'rxjs';
import { Page } from '../models/page.model';
import { HttpClient } from '@angular/common/http';
import { CreatePurchase } from '../models/create-purchase.model';
import { GetPurchase } from '../models/get-purchase.model';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {

  private apiUrl = 'http://localhost:8080/api/purchases';

  constructor(private http: HttpClient) { }

  getPurchases(page: number): Observable<Page<Purchase>> {
    return this.http.get<Page<Purchase>>(`${this.apiUrl}/page/${page}`).pipe(
      tap((response) => this.setPurchasesToLocalStorage(response.content))
    );
  }

  setPurchasesToLocalStorage(clients: Purchase[]): void {
    localStorage.setItem('clients', JSON.stringify(clients));
  }

  createPurchase(purchase: CreatePurchase): Observable<any> {
    return this.http.post(this.apiUrl, purchase);
  }

  getPurchaseById(id: number): Observable<GetPurchase> {
  return this.http.get<GetPurchase>(`${this.apiUrl}/${id}`);
}


  deleteClient(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
