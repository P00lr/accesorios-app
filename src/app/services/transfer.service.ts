import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ListTransfer } from '../models/transfer.model';
import { Page } from '../models/page.model';
import { CreateTransfer } from '../models/create-transfer';
import { GetTransfer } from '../models/get-transfer.model';

@Injectable({
  providedIn: 'root'
})
export class TransferService {

  private apiUrl = 'http://localhost:8080/api/transfers';

  constructor(private http: HttpClient) { }

  getTransfersByPage(page: number): Observable<Page<ListTransfer>> {
    return this.http.get<Page<ListTransfer>>(`${this.apiUrl}/page/${page}`).pipe(
      tap(response => this.setTransfersToLocalStorage(response.content))
    );
  }

  setTransfersToLocalStorage(transfers: ListTransfer[]): void {
    localStorage.setItem('transfers', JSON.stringify(transfers));
  }

  createTransfer(dto: CreateTransfer): Observable<any> {
    return this.http.post<any>(this.apiUrl, dto);
  }

  getTransferById(id: number): Observable<GetTransfer> {
  return this.http.get<GetTransfer>(`${this.apiUrl}/${id}`);
}

}
