// src/app/interceptors/auth.interceptor.ts
import {
  HttpClient,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { environment } from '@environment';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private Url = `${environment.apiUrl}/Session`;
  isRefreshing: boolean = false; // habilita refresh

  private http = inject(HttpClient); // conexion con backend
  private route = inject(Router); // Rutas de la app
  private auth = inject(AuthService);

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    const excludedRoutes = ['api/Session/login', 'api/Session/signin'];

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
                headers: { 'Content-Type': 'application/json' },
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
                this.route.navigate(['/logout']); // cierra session
                return throwError(() => refreshError);
              }),
            );
        }
        return throwError(() => error);
      }),
    );
  }
}
