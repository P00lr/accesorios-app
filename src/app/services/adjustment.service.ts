import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Page } from '../models/page.model';
import { Adjustment } from '../models/list-adjustment.model';
import { Observable, tap } from 'rxjs';
import { CreateAdjustment } from '../models/createAjustment.model';
import { GetAdjustment } from '../models/get-adjustmen.modl';

@Injectable({
  providedIn: 'root'
})
export class AdjustmentService {

  private apiUrl = 'http://localhost:8080/api/adjustments';

  constructor(private http: HttpClient) { }

  getAdjustments(page: number): Observable<Page<Adjustment>> {
    return this.http.get<Page<Adjustment>>(`${this.apiUrl}/page/${page}`).pipe(
      tap((response) => this.setAdjustmentsToLocalStorage(response.content))
    );
  }

  setAdjustmentsToLocalStorage(adjustments: Adjustment[]): void {
    localStorage.setItem('adjustments', JSON.stringify(adjustments));
  }

  createAdjustment(adjustment: CreateAdjustment): Observable<any> {
    return this.http.post(`${this.apiUrl}`, adjustment);

  }

  getAdjustmentById(id: number): Observable<GetAdjustment> {
    return this.http.get<GetAdjustment>(`${this.apiUrl}/${id}`);
  }

  deleteAdjustment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
