import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  Validators,
  ɵInternalFormsSharedModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { confirmPasswordValidator } from 'src/app/core/infrastructure/http/interceptors/password.validator';
import { SigInRequestDto } from 'src/app/core/infrastructure/dto/request/sig-in-request.dto';
import { LoaderComponent } from '../../components/floads/loader-component/loader-component';
import { ValidaEmailUseCase } from 'src/app/core/aplication/use-cases/session-usecase/valida-email.useCase';
import { lastValueFrom } from 'rxjs';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-sig-in-form-component',
  imports: [
    ɵInternalFormsSharedModule,
    ReactiveFormsModule,
    LoaderComponent,
    MatIcon,
  ],
  templateUrl: './sig-in-form-component.html',
  styleUrl: './sig-in-form-component.scss',
})
export class SigInFormComponent {
  private fb = inject(FormBuilder);
  private validaEmail = inject(ValidaEmailUseCase);

  // estados
  estado: boolean = false;
  loader: boolean = false;
  loadEmail: boolean = false;
  email_exist!: boolean;

  // inicializacion de datos del formulario
  sigin = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confPassword: [
      '',
      [
        Validators.required,
        Validators.minLength(8),
        confirmPasswordValidator('password'),
      ],
    ],
  });

  // cambiar las tipos del password
  togglePassword() {
    this.estado = !this.estado;
  }

  async onValidate(): Promise<boolean> {
    if (this.sigin.invalid) {
      this.sigin.markAllAsTouched();
      return false;
    }
    return true;
  }

  async ValidaEmail() {
    const emailControl = this.sigin.value.email!;
    if (
      emailControl !== null &&
      emailControl !== undefined &&
      emailControl !== ''
    ) {
      await this.consultaEmail(emailControl);
    }
  }

  async consultaEmail(email: string): Promise<void> {
    try {
      this.loadEmail = true;
      const response = await lastValueFrom(this.validaEmail.execute(email));
      this.email_exist = response;
    } catch (error) {
      throw error;
    } finally {
      this.loadEmail = false;
    }
  }

  async onData(id: string): Promise<SigInRequestDto> {
    const data = this.sigin.value as SigInRequestDto;
    data.idCompany = id;
    console.log('Datos del formulario:', data);
    return data;
  }
}
