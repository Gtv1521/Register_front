import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LoginUseCase } from 'src/app/core/aplication/use-cases/session-usecase/login.useCase';
import { LoginRequestDto } from 'src/app/core/infrastructure/dto/request/login-request.dto';
import { AuthService } from 'src/app/core/infrastructure/http/interceptors/auth.service';

@Component({
  selector: 'app-login-component',
  imports: [ReactiveFormsModule],
  templateUrl: './login-component.html',
  styleUrl: './login-component.scss',
})
export class LoginComponent {
  estado: boolean = false;
  loading: boolean = false;
  error!: HttpErrorResponse;

  private router = inject(Router);
  private fb = inject(FormBuilder);
  private loginSession = inject(LoginUseCase);
  private auth = inject(AuthService);

  login = this.fb.group({
    email: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  togglePassword() {
    this.estado = !this.estado;
  }

  goSigIn() {
    this.router.navigate(['/sigin']);
  }

  goReset() {
    this.router.navigate(['/reset']);
  }

  onSubmit() {
    if (this.login.valid) {
      this.loading = true;
      const data = this.login.value as LoginRequestDto;

      this.loginSession.execate(data).subscribe({
        next: (res) => {
          this.loading = false;
          this.auth.setAuth(res.idUser, res.idSession);
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.error = err; 
          this.loading = false;
        },
      });
    }
  }
}
