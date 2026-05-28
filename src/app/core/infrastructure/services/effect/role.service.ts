import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private readonly STORAGE_KEY = 'rol';

  private rol = signal<string>(localStorage.getItem(this.STORAGE_KEY) || '');

  rolState = this.rol.asReadonly();

  setRol(role: string): void {
    localStorage.setItem(this.STORAGE_KEY, role);
    this.rol.set(role);
  }

  clearRol(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.rol.set('');
  }
}
