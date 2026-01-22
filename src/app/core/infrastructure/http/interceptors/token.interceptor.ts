import { inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpInterceptor,
  HttpClient,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { environment } from '@environment';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

export class TokenInterceptor implements HttpInterceptor {
  private Url = `${environment.apiUrl}/Session`;
  isRefreshing: boolean = false;

  private http = inject(HttpClient); 
  private route = inject(Router);
  private auth = inject(AuthService);

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    const excludedRoutes = ['/api/Session/login', '/Session/signin'];

    if (excludedRoutes.some((url) => req.url.includes(url))) {
      return next.handle(req); // sale limpio, no toca headers ni cookies
    }
    // Clona la petición y añade el token de autenticación
    const authReq = req.clone({ withCredentials: true });

    // Envía la petición modificada
    return next.handle(authReq).pipe(
      // Manejo global de errores
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && !this.isRefreshing) {
          this.isRefreshing = true;
          console.warn('🔄 Token expirado, intentando refrescar...');

          return this.http
            .post(
              `${this.Url}/refresh`,
              { id: this.auth.getUserId() },
              {
                withCredentials: true,
              },
            )
            .pipe(
              switchMap(() => {
                this.isRefreshing = false;
                const retryReq = req.clone({ withCredentials: true });
                return next.handle(retryReq);
              }),
              catchError((refreshError) => {
                this.isRefreshing = false;
                console.error('❌ Error al refrescar el token', refreshError);
                this.route.navigate(['/login']); // cierra session
                return throwError(() => refreshError);
              }),
            );
        }
        return throwError(() => error);
      }),
    );
  }
}
