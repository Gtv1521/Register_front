import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../http/interceptors/auth.service';
import { inject } from '@angular/core';

export const logedGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isLoggedIn = authService.isAuthenticated();

  console.log(isLoggedIn);
  if (!isLoggedIn) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};
