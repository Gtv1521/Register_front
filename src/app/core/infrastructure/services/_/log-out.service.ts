import { inject, Injectable } from '@angular/core';
import { AuthService } from '../../http/interceptors/auth.service';
import { LogoutUseCase } from 'src/app/core/aplication/use-cases/session-usecase/logout.useCase';
import { RegisterStateService } from '../effect/register-state.service';
import { ThemesService } from '../themes/themes.service';

@Injectable({
  providedIn: 'root',
})
export class LogOutService {
  private auth = inject(AuthService);
  private register = inject(RegisterStateService);
  private theme = inject(ThemesService)

  close() {
    this.auth.clean();
    this.register.clear();
    this.theme.resetTheme();
  }
}
