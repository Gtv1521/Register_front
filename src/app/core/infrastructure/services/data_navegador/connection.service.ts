import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, firstValueFrom, retry } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ConnectionService {
  private http = inject(HttpClient);
  private router = inject(Router);

  // Signal para que tus componentes reaccionen al estado
  isOnline = signal<boolean>(navigator.onLine);

  constructor() {
    // Detectar cambios inmediatos del navegador
    window.addEventListener('online', () => this.validarEnlaceReal());
    window.addEventListener('offline', () => this.isOnline.set(false));
  }

  async validarEnlaceReal() {
    // Usamos un endpoint ligero para confirmar salida a internet
    const checkUrl = 'https://jsonplaceholder.typicode.com/posts/1';

    try {
      await firstValueFrom(
        this.http.get(checkUrl).pipe(
          retry({ count: 3, delay: 2000 }), // Reintenta 3 veces cada 2 segundos
          catchError((err): never => {
            this.router.navigate(['/offline']); // Si falla tras reintentos, redirige
            throw err;
          }),
        ),
      );
      this.isOnline.set(true);
    } catch (error) {
      this.isOnline.set(false);
    }
  }
}
