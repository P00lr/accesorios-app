import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Page } from '../models/page.model';
import { Role } from '../models/role.model';
import { RoleWithPermissions } from '../models/role-with-permissions.model';
import { RolePermissionAssignment } from '../models/assignment-permissions-to-role.mode';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  private apiUrl: string = 'http://localhost:8080/api/roles';


  constructor(private http: HttpClient) { }

  getRolesWithPermissions(page: number): Observable<Page<RoleWithPermissions>> {
    return this.http.get<Page<RoleWithPermissions>>(`${this.apiUrl}/with-permissions/page/${page}`);
  }


  getPermissions(page: number): Observable<Page<Role>> {
    return this.http.get<Page<Role>>(`${this.apiUrl}/page/${page}`).pipe(
      tap((response) => this.setRolesToLocalStorage(response.content))
    )
  }
  setRolesToLocalStorage(roles: Role[]) {
    localStorage.setItem('roles', JSON.stringify(roles));
  }

  getRoleById(id: number): Observable<Role> {
    return this.http.get<Role>(`${this.apiUrl}/${id}`);
  }

  createRole(permission: { name: string }): Observable<Role> {
    return this.http.post<Role>(`${this.apiUrl}`, permission);
  }

  deleteRole(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  

}
