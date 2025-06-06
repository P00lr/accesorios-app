import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (token) {
    return true;
  } else {
    // Redirige a login y pasa la url que el usuario quería para volver después
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
};
