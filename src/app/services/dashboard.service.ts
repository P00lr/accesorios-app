import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DashboardData } from '../models/dashboard-data.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor() { }

  getDashboardData(): Observable<DashboardData> {
    const mockData: DashboardData = {
      totalClientes: 152,
      totalVentas: 1250,
      totalCompras: 880,
      productosEnStock: 320,
      productosBajosStock: 18,
      gananciasMes: 47500,
    };

    return of(mockData);
  }
}
