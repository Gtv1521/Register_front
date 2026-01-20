import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SigInUseCase } from 'src/app/core/aplication/use-cases/session-usecase/sig-in.useCase';
import { SessionEntity } from 'src/app/core/domain/entitys/session.entity';
import { SigInRequestDto } from 'src/app/core/infrastructure/dto/request/sig-in-request.dto';
import { confirmPasswordValidator } from 'src/app/core/infrastructure/http/interceptors/password.validator';
import { BidiModule } from "@angular/cdk/bidi";
import { AuthService } from 'src/app/core/infrastructure/http/interceptors/auth.service';

@Component({
  selector: 'app-sig-in-component',
  imports: [ReactiveFormsModule, BidiModule],
  templateUrl: './sig-in-component.html',
  styleUrl: './sig-in-component.scss',
})
export class SigInComponent {
  // estados
  estado: boolean = false;
  error!: HttpErrorResponse;
  resonse!: SessionEntity;

  // constructor
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private singIn = inject(SigInUseCase);
  private auth = inject(AuthService);

  sigin = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confPassword: ['', [Validators.required, Validators.minLength(8), confirmPasswordValidator('password')]],
  });

  // metodos
  togglePassword() {
    this.estado = !this.estado;
  }

  goLogin() {
    this.router.navigate(['/login']);
  }

  onSubmit() {
    if (this.sigin.valid) {
      const user = this.sigin.value as SigInRequestDto;
      this.singIn.execute(user).subscribe({
        next: (res) => {
          this.resonse = res;
          this.auth.setAuth(res.idUser, res.idSession);
        },
        error: (err) => {
          this.error = err;
        },
      });
    }
  }
}
