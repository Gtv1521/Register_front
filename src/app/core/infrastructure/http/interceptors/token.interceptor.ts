import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
     const authReq = this.addTokenToRequest(request);
    
    // Envía la petición modificada
    return next.handle(authReq).pipe(
      // Manejo global de errores
      catchError((error: HttpErrorResponse) => {
        console.error('Error en la petición:', error);
        return throwError(() => error);
      })
    );
  }

  private addTokenToRequest(req: HttpRequest<any>): HttpRequest<any> {
    // Obtén el token de localStorage
    const token = localStorage.getItem('token');
    
    // Si existe el token, clona la petición y añade el header
    if (token) {
      return req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
    
    return req;
  }
}
