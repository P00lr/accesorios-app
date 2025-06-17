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

  private apiUrl = 'https://backend-api-gestion-accesorios.onrender.com/api/purchases';

  constructor(private http: HttpClient) { }

  getPurchases(page: number): Observable<Page<Purchase>> {
    return this.http.get<Page<Purchase>>(`${this.apiUrl}/page/${page}`).pipe(
      tap((response) => this.setPurchasesToLocalStorage(response.content))
    );
  }
  //VERIFICAR QUE TODO ESTE BIEN
  setPurchasesToLocalStorage(purchases: Purchase[]): void {
    localStorage.setItem('purchases', JSON.stringify(purchases));
  }

  createPurchase(purchase: CreatePurchase): Observable<any> {
    console.log('Datos que se enviarán:', purchase);
    return this.http.post(this.apiUrl, purchase);
  }

  getPurchaseById(id: number): Observable<GetPurchase> {
    return this.http.get<GetPurchase>(`${this.apiUrl}/${id}`);
  }


  deletePurchase(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
