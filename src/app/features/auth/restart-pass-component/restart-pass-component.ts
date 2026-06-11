import { Component, inject, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  Validators,
  ɵInternalFormsSharedModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  confirmPasswordValidator,
  regexValidator,
  strongPasswordValidator,
} from 'src/app/core/infrastructure/http/validators/password.validator';
import {
  ESPECIAL_REGEX,
  MAYUSCULA_REGEX,
} from 'src/app/core/domain/reusables/estados.constant';
import { ChangeContrasenaUseCase } from 'src/app/core/aplication/use-cases/session-usecase/change-contrasena.useCase';
import { lastValueFrom } from 'rxjs';
import { CargandoAccionComponent } from '../../components/floads/cargando-accion-component/cargando-accion-component';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-restart-pass-component',
  imports: [
    MatIcon,
    ɵInternalFormsSharedModule,
    ReactiveFormsModule,
    CargandoAccionComponent,
  ],
  templateUrl: './restart-pass-component.html',
  styleUrl: './restart-pass-component.scss',
})
export class RestartPassComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private update = inject(ChangeContrasenaUseCase);

  toggleView = signal<boolean>(false);
  token = signal<string>('');
  id = signal<string>('');
  onUpdate = signal<boolean>(false);
  actualizado = signal<boolean>(false);
  err = signal<HttpErrorResponse | any | null>(null);

  inputs = this.fb.group({
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(8),
        regexValidator(MAYUSCULA_REGEX, 'sinMayuscula'),
        regexValidator(ESPECIAL_REGEX, 'sinCaracterEspecial'),
        strongPasswordValidator(),
      ],
    ],
    confirma: [
      '',
      [
        Validators.required,
        Validators.minLength(8),
        regexValidator(MAYUSCULA_REGEX, 'sinMayuscula'),
        regexValidator(ESPECIAL_REGEX, 'sinCaracterEspecial'),
        confirmPasswordValidator('password'),
        strongPasswordValidator(),
      ],
    ],
  });

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.token.set(params['token']);
      this.id.set(params['id']);
    });
  }

  OnVolver() {
    this.router.navigate(['/login']);
  }

  onToggle() {
    this.toggleView.set(!this.toggleView());
  }

  async onSubmit() {
    if (this.inputs.invalid) return;

    const contraseña = this.inputs.value.password!;
    try {
      this.onUpdate.set(true);
      const response = await lastValueFrom(
        this.update.execute(this.id(), contraseña, this.token()),
      );
      this.actualizado.set(response);
    } catch (error) {
      const errors = error as HttpErrorResponse;
      this.err.set(errors);
    } finally {
      this.onUpdate.set(false);
      setTimeout(() => {
        this.OnVolver();
      }, 1100);
    }
  }
}
