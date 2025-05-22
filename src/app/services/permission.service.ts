import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Page } from '../models/page.model';
import { Permission } from '../models/permission.model';
import { RolePermissionAssignment } from '../models/assignment-permissions-to-role.mode';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  private apiUrl: string = 'http://localhost:8080/api/permissions';



  constructor(private http: HttpClient) { }

  getPermissions(page: number): Observable<Page<Permission>> {
    return this.http.get<Page<Permission>>(`${this.apiUrl}/page/${page}`).pipe(
      tap((response) => this.setPermissionsToLocalStorage(response.content))
    )
  }
  setPermissionsToLocalStorage(permissions: Permission[]) {
    localStorage.setItem('permissions', JSON.stringify(permissions));
  }

  getPermissionById(id: number): Observable<Permission> {
    return this.http.get<Permission>(`${this.apiUrl}/${id}`);
  }

  createPermission(permission: { name: string }): Observable<Permission> {
    return this.http.post<Permission>(`${this.apiUrl}`, permission);
  }

  deletePermission(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Asignación de permisos a un rol
  assignPermissionsToRole(data: RolePermissionAssignment): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/assign-to-role`, data);
  }


}
