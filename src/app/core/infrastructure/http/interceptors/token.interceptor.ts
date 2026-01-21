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

export class TokenInterceptor implements HttpInterceptor {
  private Url = `${environment.apiUrl}/Session`;
  isRefreshing: boolean = false; // habilita refresh

  private http = inject(HttpClient); // conexion con backend
  private route = inject(Router); // Rutas de la app

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
            .get(`${this.Url}/refresh`, { withCredentials: true })
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
