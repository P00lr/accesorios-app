import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'https://backend-api-gestion-accesorios.onrender.com/login';

  private permissionsSubject = new BehaviorSubject<string[]>([]);
  permissions$ = this.permissionsSubject.asObservable();

  private isLoggedInSubject = new BehaviorSubject<boolean>(this.isLoggedIn());
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(
    private http: HttpClient,
  ) { }

  login(credentials: { username: string; password: string }): Observable<void> {
    return this.http.post<any>(this.apiUrl, credentials).pipe(
      tap(response => {
        if (response.token) {
          this.saveToken(response.token);
          this.extractAndStorePermissionsFromToken(response.token);
          this.isLoggedInSubject.next(true);
        }
      }),
      map(() => void 0)
    );
  }

  private extractAndStorePermissionsFromToken(token: string): void {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const authoritiesRaw = payload['authorities'];

      let authorities: string[] = [];

      if (typeof authoritiesRaw === 'string') {
        const parsed = JSON.parse(authoritiesRaw);
        authorities = parsed.map((a: any) => a.authority);
      }

      console.log('✅ Permisos extraídos del JWT:', authorities);
      this.permissionsSubject.next(authorities);
      localStorage.setItem('permissions', JSON.stringify(authorities));

    } catch (e) {
      console.error('❌ Error al extraer permisos del token:', e);
    }
  }

  hasPermission(permissionName: string): boolean {
    const currentPermissions = this.permissionsSubject.value;
    return currentPermissions.includes(permissionName);
  }

  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('permissions');
    localStorage.removeItem('cartItems');
    this.permissionsSubject.next([]);
    this.isLoggedInSubject.next(false);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  shouldShowSidebar$(): Observable<boolean> {
    return this.permissions$.pipe(
      map(perms => {
        const hasToken = !!this.getToken();
        return hasToken && perms.length > 0;
      })
    );
  }

  getUsername(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payloadBase64 = token.split('.')[1];
      const payload = JSON.parse(atob(payloadBase64));
      return payload.sub || null;
    } catch (error) {
      console.error('❌ Error al extraer el username del token:', error);
      return null;
    }
  }

  //Nuevo método para obtener el userId del token ===
  getUserId(): number | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payloadBase64 = token.split('.')[1];
      const payload = JSON.parse(atob(payloadBase64));
      return payload.userId ?? null;
    } catch (error) {
      console.error('❌ Error al extraer el userId del token:', error);
      return null;
    }
  }

}
