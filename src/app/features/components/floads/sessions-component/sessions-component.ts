import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LogoutUseCase } from 'src/app/core/aplication/use-cases/session-usecase/logout.useCase';
import { SessionesUseCase } from 'src/app/core/aplication/use-cases/session-usecase/sessiones.useCase';
import { SessionInfo } from 'src/app/core/domain/entitys/session.entity';

@Component({
  selector: 'app-sessions-component',
  imports: [],
  templateUrl: './sessions-component.html',
  styleUrl: './sessions-component.scss',
})
export class SessionsComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private session = inject(SessionesUseCase);
  private logout = inject(LogoutUseCase);

  sessiomsList: SessionInfo[] = [];
  user: string | null = this.route.snapshot.paramMap.get('id');
  loader: boolean = false;
  successLogout: boolean = false;

  ngOnInit() {
    if (typeof this.user === 'string') {
      this.session.execute(this.user).subscribe({
        next: (res) => {
          this.sessiomsList = res;
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }

  onLogout(id: string) {
    this.logout.execute(id).subscribe({
      next: (res) => {
        this.successLogout = res;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  onExit() {
    this.router.navigate(['/login']);
  }
}
