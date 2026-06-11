import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CargandoAccionComponent } from '../../components/floads/cargando-accion-component/cargando-accion-component';
import { SendMailUseCase } from 'src/app/core/aplication/use-cases/session-usecase/send-mail.useCase';
import { lastValueFrom } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-reset-component',
  imports: [ReactiveFormsModule, CargandoAccionComponent],
  templateUrl: './reset-component.html',
  styleUrl: './reset-component.scss',
})
export class ResetComponent {
  // constructor
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private sendMail = inject(SendMailUseCase);

  // estados
  estado = signal<boolean>(false);
  loading = signal<boolean>(false);
  hecho = signal<boolean>(false);
  err = signal<HttpErrorResponse | null>(null);

  // inicializacion
  reset = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  // metodos
  goLogin() {
    this.router.navigate(['/login']);
  }

  async onSubmit(): Promise<void> {
    if (this.reset.valid) {
      try {
        const baseUrl = window.location.origin;

        this.loading.set(true);
        const mail = this.reset.value;
        var response = await lastValueFrom(
          this.sendMail.execute(mail.email!, `${baseUrl}/new_password`),
        );
        this.hecho.set(response);
      } catch (error) {
        this.err.set(error as HttpErrorResponse);
      } finally {
        this.loading.set(false);
      }
    }
  }
}
