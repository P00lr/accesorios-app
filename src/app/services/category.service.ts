import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Category } from '../models/category.model';
import { Page } from '../models/page.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiUrl = 'http://localhost:8080/api/categories'; // Ruta de la API

  constructor(private http: HttpClient) { }

  getCategories(page: number): Observable<Page<Category>> {
    return this.http.get<Page<Category>>(`${this.apiUrl}/page/${page}`).pipe(
      tap((response) => this.setClientsToLocalStorage(response.content))
    );
  }

  setClientsToLocalStorage(categories: Category[]): void {
    localStorage.setItem('clients', JSON.stringify(categories));
  }

  createCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(this.apiUrl, category);
  }

  getCategoryById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/${id}`);
  }


  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateCategory(id: number, clientData: Category): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/${id}`, clientData);
  }
}
