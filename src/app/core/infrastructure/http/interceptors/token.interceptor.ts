// src/app/interceptors/auth.interceptor.ts
import {
  HttpClient,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  catchError,
  filter,
  from,
  switchMap,
  take,
  throwError,
} from 'rxjs';
import { environment } from '@environment';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { SignalRService } from '../../services/signalr/signal-r.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private Url = `${environment.apiUrl}/Session`;
  isRefreshing = signal<boolean>(false); // habilita refresh
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null,
  );

  private http = inject(HttpClient); // conexion con backend
  private route = inject(Router); // Rutas de la app
  private auth = inject(AuthService);
  private signalR = inject(SignalRService);

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    // const excludedRoutes = ['api/Session/login', 'api/Session/signin'];
    // if (excludedRoutes.some((url) => req.url.includes(url)))
    //   return next.handle(req);

    const authReq = req.clone({ withCredentials: true });

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return this.handle401Error(authReq, next);
        }
        return throwError(() => error);
      }),
    );
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing()) {
      this.isRefreshing.set(true);
      this.refreshTokenSubject.next(null);

      return this.http
        .post(
          `${this.Url}/refresh`,
          { id: this.auth.getUserId() },
          { withCredentials: true },
        )
        .pipe(
          switchMap((response: any) => {
            this.isRefreshing.set(false);
            if (!response?.success) {
              return this.handleLogout('Respuesta inválida de refresh');
            }

            this.refreshTokenSubject.next(true);

            return from(this.signalR.reiniciarConexion()).pipe(
              switchMap(() =>
                next.handle(request.clone({ withCredentials: true })),
              ),
            );
          }),

          catchError((err: HttpErrorResponse) => {
            this.isRefreshing.set(false);

            if (this.shouldLogout(err)) {
              return this.handleLogout('Error en refresh token');
            }

            return throwError(() => err);
          }),
        );
    } else {
      // SI YA SE ESTÁ REFRESCANDO: Esperamos a que termine
      return this.refreshTokenSubject.pipe(
        filter((result) => result !== null), // Bloquea hasta que sea true
        take(1),
        switchMap(
          switchMap((result) => {
            if (!result) {
              return throwError(() => new Error('Sesión expirada'));
            }
            return next.handle(request.clone({ withCredentials: true }));
          }),
        ),
      );
    }
  }

  private shouldLogout(err: HttpErrorResponse): boolean {
    console.log(err)
    return (
      err.status === 400 ||
      err.status === 401 ||
      err.error?.success === false
    );
  }

  private handleLogout(reason: string) {
    console.warn('Logout forzado:', reason);

    this.refreshTokenSubject.next(false); // 👈 libera los que esperan
    // this.auth.logout();
    this.route.navigate(['/logout']);

    return throwError(() => new Error(reason));
  }
}
