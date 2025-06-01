import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Page } from '../models/page.model';
import { User } from '../models/user.model';
import { Observable, tap } from 'rxjs';
import { UserWihtPermissions } from '../models/user-with-permissions.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) { }

  getUsers(page: number): Observable<Page<User>> {
    return this.http.get<Page<User>>(`${this.apiUrl}/page/${page}`).pipe(
      tap((response) => this.setUsersToLocalStorage(response.content))
    );
  }

  getAllusers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}`);
  }

  getUserWithPermissions(id: number): Observable<UserWihtPermissions> {
    return this.http.get<UserWihtPermissions>(`${this.apiUrl}/with-permissions/${id}`);
  }

  setUsersToLocalStorage(users: User[]): void {
    localStorage.setItem('clients', JSON.stringify(users));
  }

  createUser(client: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, client);
  }

  // Obtener cliente por ID
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  // Actualizar cliente
  updateUser(id: number, userData: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, userData);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  changePassword(data: {
    userId: number;
    currentPassword: string;
    newPassword: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/change-password`, data);
  }

}
