import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { environment } from '@environment';
import { catchError, map, of } from 'rxjs';
import { AuthService } from '../../http/interceptors/auth.service';

export const qrAccessGuard: CanActivateFn = (route, state) => {
  const Url = `${environment.apiUrl}`;
  const http = inject(HttpClient);
  const authService = inject(AuthService);
  // const cookieService = inject(CookieService); // O un helper de JS
  const router = inject(Router);

  // 1. Validamos la "bandera" localmente sin peticiones HTTP
  if (authService.getSession()!) {
    return true; // Pasa directo, el interceptor se encargará si el JWT interno expiró
  }

  // 2. Solo si NO existe la bandera, pedimos el acceso de invitado
  return http.get(`${Url}/Session/invitado`, { withCredentials: true }).pipe(
    map(() => true),
    catchError(() => {
      router.navigate(['/error-acceso']);
      return of(false);
    }),
  );
};
