import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemesService } from './core/infrastructure/services/themes/themes.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  constructor(private themesService: ThemesService) {}

  protected readonly title = signal('Register_front');

  ngOnInit() {
    this.themesService.loadTheme();
  }
}
