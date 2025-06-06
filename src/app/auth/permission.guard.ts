import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';

export const permissionGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = localStorage.getItem('token');
  if (!token) {
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  const requiredPermissions: string[] = route.data['permissions'] || [];
  const hasAllPermissions = requiredPermissions.every(permission => authService.hasPermission(permission));

  if (!hasAllPermissions) {
    router.navigate(['/catalog-accessories']);
    return false;
  }

  return true;
};
