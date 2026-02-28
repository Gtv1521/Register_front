import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
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

  constructor() {}

  // Inicia los datos de session y NOTIFICA a la app
  setAuth(id: string, session: string, idCompany: string): void {
    localStorage.setItem('userId', id);
    localStorage.setItem('sessionId', session);
    localStorage.setItem('CompanyId', idCompany);

    // Actualizamos los signals para que toda la app se entere
    this._userId.set(id);
    this._sessionId.set(session);
    this._companyId.set(idCompany);
  }

  // Limpia los datos y NOTIFICA a la app (esto vacía tus consultas)
  clean(): void {
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
