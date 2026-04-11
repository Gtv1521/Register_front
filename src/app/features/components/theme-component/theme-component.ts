import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { UserUpdateThemeUseCase } from 'src/app/core/aplication/use-cases/user-usecase/use-update-theme.useCase';
import { AuthService } from 'src/app/core/infrastructure/http/interceptors/auth.service';
import { ThemesService } from 'src/app/core/infrastructure/services/themes/themes.service';

@Component({
  selector: 'app-theme-component',
  imports: [],
  templateUrl: './theme-component.html',
  styleUrl: './theme-component.scss',
})
export class ThemeComponent {
  private themeService = inject(ThemesService);
  private router = inject(Router);
  private auth = inject(AuthService);
  private themeCase = inject(UserUpdateThemeUseCase);

  selectedTheme = signal<string>('light');

  ngOnInit() {
    this.themeService.loadTheme();
    this.selectedTheme.set(this.themeService.actualtheme());
  }

  setTheme(theme: string) {
    this.themeService.setTheme(theme);
    this.selectedTheme.set(theme);
    this.updateTheme();
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }

  updateTheme() {
    lastValueFrom(
      this.themeCase.execute(this.auth.getUserId()!, this.selectedTheme()),
    );
  }
}
