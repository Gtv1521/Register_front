import { Injectable, signal } from '@angular/core';
import { LoginUseCase } from 'src/app/core/aplication/use-cases/session-usecase/login.useCase';

@Injectable({
  providedIn: 'root',
})
export class ThemesService {
  savedTheme = signal<string>('light');

  setTheme(theme: string): void {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }

  loadTheme(): void {
    const savedTheme = localStorage.getItem('theme') || 'light';
    this.setTheme(savedTheme);
    this.savedTheme.set(savedTheme);
  }

  actualtheme(): string {
    return this.savedTheme();
  }

  resetTheme(): void {
    this.setTheme('light');
    this.savedTheme.set('light');
  }
}
