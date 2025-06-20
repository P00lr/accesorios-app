import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DashboardDTO } from '../models/dashboard.model';
import { Page } from '../models/page.model';
import { LowStockItem } from '../models/LowStockItem.model';
import { TopSellingAccessory } from '../models/TopSellingAccessor.model';
import { TopCustomer } from '../models/topCustomer.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private apiUrl = 'https://backend-api-gestion-accesorios.onrender.com/api/dashboard';

  constructor(private http: HttpClient) { }

  getDashboardData(): Observable<DashboardDTO> {
    return this.http.get<DashboardDTO>(this.apiUrl);
  }

  getLowStockItems(threshold: number = 5, page: number = 0, size: number = 15): Observable<Page<LowStockItem>> {
    const params = new HttpParams()
      .set('threshold', threshold)
      .set('page', page)
      .set('size', size);

    return this.http.get<Page<LowStockItem>>(`${this.apiUrl}/low-stock`, { params });
  }

  //los que mas compran
  getTopSellingAccessories(startDate?: Date, endDate?: Date, page: number = 0, size: number = 5): Observable<Page<TopSellingAccessory>> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size);

    if (startDate) {
      params = params.set('startDate', this.formatDateToIsoString(startDate, 'start'));
    }

    if (endDate) {
      params = params.set('endDate', this.formatDateToIsoString(endDate, 'end'));
    }

    return this.http.get<Page<TopSellingAccessory>>(`${this.apiUrl}/top-selling-accessories`, { params });
  }

  private formatDateToIsoString(date: Date, type: 'start' | 'end'): string {
    const pad = (n: number) => n.toString().padStart(2, '0');
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const time = type === 'start' ? '00:00:00' : '23:59:59';
    return `${year}-${month}-${day}T${time}`;
  }

  //top customers
  getTopCustomers(page: number = 0, size: number = 5): Observable<Page<TopCustomer>> {
  const params = new HttpParams()
    .set('page', page)
    .set('size', size);

  return this.http.get<Page<TopCustomer>>(`${this.apiUrl}/top-customers`, { params });
}

}
