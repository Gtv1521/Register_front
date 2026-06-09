import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../http/interceptors/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const auth = inject(AuthService);

  if (auth.isAuthenticated()) {
    router.navigate(['/dashboard']);
    return false;
  }

  return true;
};
