import { computed, inject, Injectable, signal } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { UserGetUseCase } from 'src/app/core/aplication/use-cases/user-usecase/user-get.useCase';
import { SignalRService } from '../../services/signalr/signal-r.service';
import { Router } from '@angular/router';
import { RoleService } from '../../services/effect/role.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _getMeUseCase = inject(UserGetUseCase); // Tu caso de uso que llama a /me
  private _heartbeatSub?: Subscription;
  private _signalR = inject(SignalRService);
  private router = inject(Router);

  // 1. Definimos los Signals privados
  // Los inicializamos leyendo directamente de localStorage
  private _userId = signal<string | null>(localStorage.getItem('userId'));
  private _sessionId = signal<string | null>(localStorage.getItem('sessionId'));
  private _companyId = signal<string | null>(localStorage.getItem('CompanyId'));

  // 2. Exponemos versiones de solo lectura para los componentes
  public userId = this._userId.asReadonly();
  public sessionId = this._sessionId.asReadonly();
  public companyId = this._companyId.asReadonly();

  // 3. Computed signal para saber si el usuario está logueado
  public isAuthenticated = computed(() => !!this._sessionId());

  constructor() {
    if (this.isAuthenticated()) {
      this.activarTodoElSistema();
    }
    this._signalR.revokeSession$.subscribe((id) => {
      const currentUserId = this.getSession();
      console.log(id, 'ID recibido para revocar sesión', currentUserId);

      if (id === currentUserId) {
        this.router.navigate(['/logout']);
      }
    });
  }

  private iniciarDespertador(): void {
    this._heartbeatSub?.unsubscribe();

    // Como tu token dura 2 min (120s), disparamos cada 90s (1.5 min)
    // para que el Interceptor tenga 30s de margen para renovar.
    this._heartbeatSub = timer(0, 120000).subscribe(() => {
      this.ejecutarRefrescoSilencioso();
    });
  }

  private ejecutarRefrescoSilencioso(): void {
    console.log('💓 Heartbeat: Tocando la puerta del servidor...');

    // Ejecutamos tu caso de uso. No nos importa mucho el resultado,
    // lo que queremos es que la petición pase por el INTERCEPTOR.
    this._getMeUseCase.execute().subscribe({
      next: (res) => {
        console.log('✅ Sesión validada/refrescada con éxito');
      },
      error: (err) => {
        console.error('💔 Error crítico en el latido:', err);
        if (err.status === 401) this.clean(); // Si el refresh falla, limpiamos
      },
    });
  }
  // Inicia los datos de session y NOTIFICA a la app
  setAuth(id: string, session: string, idCompany: string): void {
    localStorage.setItem('userId', id);
    localStorage.setItem('sessionId', session);
    localStorage.setItem('CompanyId', idCompany);

    // Actualizamos los signals para que toda la app se entere
    this._userId.set(id);
    this._sessionId.set(session);
    this._companyId.set(idCompany);

    this.activarTodoElSistema();
  }

  private activarTodoElSistema() {
    // 1. Iniciamos el latido cada 90s (porque tu token dura 2min)
    this.iniciarDespertador();
    // 2. Conectamos el Hub de SignalR
    this._signalR.conectar();
  }

  // Limpia los datos y NOTIFICA a la app (esto vacía tus consultas)
  clean(): void {
    this._heartbeatSub?.unsubscribe();
    this._signalR.detenerConexion();

    localStorage.removeItem('userId');
    localStorage.removeItem('sessionId');
    localStorage.removeItem('CompanyId');

    // Al resetear los signals a null, los componentes dejan de mostrar datos viejos
    this._userId.set(null);
    this._sessionId.set(null);
    this._companyId.set(null);
  }

  // Mantengo estos métodos por si tus UseCases los usan,
  // pero ahora leen el valor actual del Signal
  getUserId(): string | null {
    return this._userId();
  }

  getCompany(): string | null {
    return this._companyId();
  }

  getSession(): string | null {
    return this._sessionId();
  }
}
