import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginUseCase } from 'src/app/core/aplication/use-cases/session-usecase/login.useCase';
import { LoginRequestDto } from 'src/app/core/infrastructure/dto/request/login-request.dto';
import { AuthService } from 'src/app/core/infrastructure/http/interceptors/auth.service';
import { LoaderComponent } from '../../components/floads/loader-component/loader-component';
import { DataNavService } from 'src/app/core/infrastructure/services/data_navegador/data-nav.service';
import { ThemesService } from 'src/app/core/infrastructure/services/themes/themes.service';

@Component({
  selector: 'app-login-component',
  imports: [ReactiveFormsModule, LoaderComponent],
  templateUrl: './login-component.html',
  styleUrl: './login-component.scss',
})
export class LoginComponent {
  estado = signal<boolean>(false);
  loading = signal<boolean>(false);
  error = signal<HttpErrorResponse | null>(null);
  success = signal<boolean>(false);

  private router = inject(Router);
  private fb = inject(FormBuilder);
  private loginSession = inject(LoginUseCase);
  private auth = inject(AuthService);
  private dataNav = inject(DataNavService);
  private theme = inject(ThemesService)

  login = this.fb.group({
    email: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  togglePassword() {
    this.estado.set(!this.estado());
  }

  goSigIn() {
    this.router.navigate(['/sigin']);
  }

  goReset() {
    this.router.navigate(['/reset']);
  }

  goSessions() {
    this.router.navigate([`/sessions/${this.error()?.error?.id}`]);
  }

  async onSubmit() {
    if (this.login.valid) {
      this.loading.set(true);
      const datos = await this.dataNav.GoData();

      const data = this.login.value as LoginRequestDto;
      data.navegador = datos.navegador;
      data.versionNavegador = datos.versionNavegador;
      data.sistemaOperativo = datos.sistemaOperativo;

      this.loginSession.execate(data).subscribe({
        next: (res) => {
          this.auth.setAuth(res.idUser, res.idSession, res.idCompany);
          this.loading.set(false);
          this.error.set(null);
          this.success.set(true);
          this.theme.setTheme(res.theme);
          
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 1500);
        },
        error: (err: HttpErrorResponse) => {
          if (err.status === 401) {
            this.error.set(err);
          } else if (err.status === 400) {
            this.error.set(err);
            this.goSessions();
          } else {
            this.error.set(
              new HttpErrorResponse({
                status: err.status,
                statusText: 'Error en el servidor',
              }),
            );
          }

          this.error.set(err);
          this.loading.set(false);
        },
      });
    }
  }
}
