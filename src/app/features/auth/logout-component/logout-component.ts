import { IfStmt } from '@angular/compiler';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
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
    if (!this.auth.getSession()) this.salir();
    else {
      const response = await lastValueFrom(
        this.logout.execute(this.auth.getSession()!),
      );
      if (response) {
        this.states.close();

        setTimeout(() => {
          this.salir();
        }, 1000);
      }
    }
  }

  salir() {
    this.router.navigate(['login']);
  }
}
