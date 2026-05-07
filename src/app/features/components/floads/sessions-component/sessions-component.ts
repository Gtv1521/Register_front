import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LogoutUseCase } from 'src/app/core/aplication/use-cases/session-usecase/logout.useCase';
import { SessionesUseCase } from 'src/app/core/aplication/use-cases/session-usecase/sessiones.useCase';
import { SessionInfo } from 'src/app/core/domain/entitys/session.entity';
import { LoaderComponent } from '../loader-component/loader-component';
import { DataSessionComponent } from '../../data-session-component/data-session-component';
import { lastValueFrom } from 'rxjs';
import { AuthService } from 'src/app/core/infrastructure/http/interceptors/auth.service';
import { RemoveSessionUseCase } from 'src/app/core/aplication/use-cases/session-usecase/remove-session.useCase';

@Component({
  selector: 'app-sessions-component',
  imports: [LoaderComponent, DataSessionComponent],
  templateUrl: './sessions-component.html',
  styleUrl: './sessions-component.scss',
})
export class SessionsComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private session = inject(SessionesUseCase);
  private logout = inject(RemoveSessionUseCase);
  private auth = inject(AuthService);

  sessiomsList = signal<SessionInfo[]>([]);
  user = signal<string | null>(this.route.snapshot.paramMap.get('id'));
  loader = signal<boolean>(false);
  loaderLogout = signal<boolean>(false);
  successLogout = signal<boolean>(false);
  errores = signal<HttpErrorResponse | null>(null);
  sessionOn = signal<boolean>(this.auth.sessionId() === null ? false : true);

  async ngOnInit(): Promise<void> {
    try {
      this.loader.set(true);
      this.sessiomsList.set(
        await lastValueFrom(this.session.execute(this.user()!)),
      );
    } catch (error) {
      console.error('Error loading sessions:', error);
    } finally {
      this.loader.set(false);
    }
  }

  // elimina una session activa
  onLogout(id: string) {
    this.loaderLogout.set(true);
    this.logout.execute(this.user()!, id).subscribe({
      next: (res) => {
        this.successLogout.set(res);
        this.sessiomsList.update((sessions) =>
          sessions.filter((session) => session.id !== id),
        );
        this.loaderLogout.set(false);
      },
      error: (err) => {
        this.errores.set(err);
        this.loaderLogout.set(false);
      },
    });
  }

  onExit() {
    this.router.navigate(['/login']);
  }
}
