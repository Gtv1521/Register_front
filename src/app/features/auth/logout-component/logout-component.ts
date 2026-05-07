import { IfStmt } from '@angular/compiler';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom, sample } from 'rxjs';
import { LogoutUseCase } from 'src/app/core/aplication/use-cases/session-usecase/logout.useCase';
import { AuthService } from 'src/app/core/infrastructure/http/interceptors/auth.service';
import { LogOutService } from 'src/app/core/infrastructure/services/_/log-out.service';

@Component({
  selector: 'app-logout-component',
  imports: [],
  templateUrl: './logout-component.html',
  styleUrl: './logout-component.scss',
})
export class LogoutComponent {
  private router = inject(Router);
  private states = inject(LogOutService);
  private logout = inject(LogoutUseCase);
  private auth = inject(AuthService);

  async ngOnInit() {
    try {
      if (!this.auth.getSession()) this.salir();
      const response = await lastValueFrom(
        this.logout.execute(this.auth.getSession()!),
      );

      if (response) {
        this.states.close();
        this.salir();
      }
    } catch (error) {
      console.error('Error al cerrar sesion', error);
    } finally {
      this.salir();
    }
  }

  salir() {
    this.router.navigate(['login']);
  }
}
