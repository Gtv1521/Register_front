import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userId: string | null = null;
  private sessionId: string | null = null;

  constructor() {
    this.userId = localStorage.getItem('userId');
    this.sessionId = localStorage.getItem('sessionId');
  }

  // inicia los datos de session
  setAuth(id: string, session: string): void {
    localStorage.setItem('userId', id);
    localStorage.setItem('sessionId', session);
    // this.userId = id;
    // this.sessionId = session;
  }

  // obtiene el id de usuario que ya esta en la session
  getUserId(): string | null {
    return this.userId;
  }

  // retorna id de session
  getSession(): string | null {
    return this.sessionId;
  }

  // Limpia y destruye la session
  clearUser(): void {
    this.userId = null;
    localStorage.removeItem('id');
  }
}
