import { inject, Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpInterceptorFn,
} from '@angular/common/http';
import { catchError, Observable, retry, throwError, timer } from 'rxjs';
import { Router } from '@angular/router';
import { ConnectionService } from '../../services/data_navegador/connection.service';

export const conexionInterceptor: HttpInterceptorFn = (req, next) =>  {
    const router = inject(Router);
    const connectionService = inject(ConnectionService);

    return next(req).pipe(
      // Configuración de reintentos
      retry({
        count: 3, // Reintenta 3 veces
        delay: (error, retryCount) => {
          // Solo reintenta si es un error de red (status 0)
          if (error.status === 0) {
            console.log(`Reintento de conexión #${retryCount}...`);
            return timer(2000); // Espera 2 segundos entre reintentos
          }
          throw error; // Si es un error 404 o 500, no reintentes aquí
        },
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 0) {
          // Si después de los reintentos sigue en 0, actualizamos el estado global
          connectionService.isOnline.set(false);
          router.navigate(['/offline']);
        }
        return throwError(() => error);
      }),
    );
  }
