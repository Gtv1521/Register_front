import { Component, inject, input, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { UserGetIdUseCase } from 'src/app/core/aplication/use-cases/user-usecase/user-get-id.useCase';
import { UserEntity } from 'src/app/core/domain/entitys/user.entity';
import { LoaderComponent } from 'src/app/features/components/floads/loader-component/loader-component';
import { MatIcon } from '@angular/material/icon';
import { CompanyGetUseCase } from 'src/app/core/aplication/use-cases/company-usecase/company-get.useCase';
import { AuthService } from 'src/app/core/infrastructure/http/interceptors/auth.service';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from 'node_modules/@angular/forms';
import { ConfirmAlertComponent } from '../../components/floads/confirm-alert-component/confirm-alert-component';
import {
  confirmPasswordValidator,
  regexValidator,
  strongPasswordValidator,
} from 'src/app/core/infrastructure/http/validators/password.validator';
import { UserUpdateMailUseCase } from 'src/app/core/aplication/use-cases/user-usecase/user-update-mail.useCase';
import { UserUpdateNameUseCase } from 'src/app/core/aplication/use-cases/user-usecase/user-update-name.useCase';
import { UserUpdatePasswordUseCase } from 'src/app/core/aplication/use-cases/user-usecase/user-update-password.useCase';
import { SignalRService } from 'src/app/core/infrastructure/services/signalr/signal-r.service';
import { CargandoAccionComponent } from '../../components/floads/cargando-accion-component/cargando-accion-component';
import {
  ESPECIAL_REGEX,
  MAYUSCULA_REGEX,
} from 'src/app/core/domain/reusables/estados.constant';

@Component({
  selector: 'app-datos-usuario-loged',
  imports: [
    LoaderComponent,
    MatIcon,
    ReactiveFormsModule,
    FormsModule,
    ConfirmAlertComponent,
    CargandoAccionComponent,
  ],
  templateUrl: './datos-usuario-loged.html',
  styleUrl: './datos-usuario-loged.scss',
})
export class DatosUsuarioLoged {
  private user = inject(UserGetIdUseCase);
  private route = inject(ActivatedRoute);
  private auth = inject(AuthService);
  private fb = inject(FormBuilder);
  private company = inject(CompanyGetUseCase);
  private updateEmail = inject(UserUpdateMailUseCase);
  private updateNombres = inject(UserUpdateNameUseCase);
  private updatePassword = inject(UserUpdatePasswordUseCase);
  private signalr = inject(SignalRService);

  // data entrada
  id = input<string>(this.route.snapshot.paramMap.get('id')!);

  // estados
  dataUser = signal<UserEntity | null>(null);
  loader = signal<boolean>(true);
  nameCompany = signal<string>('');
  editName = signal<boolean>(false);
  editMail = signal<boolean>(false);
  confirmaMail = signal<boolean>(false);
  confirmaUser = signal<boolean>(false);
  falloMail = signal<boolean>(false);
  falloUser = signal<boolean>(false);
  changePass = signal<boolean>(false);
  showPass = signal<boolean>(true);
  onUpdate = signal<boolean>(false);
  mensaje = signal<string>('Mensaje');

  inputUser = new FormControl('');
  inputMail = new FormControl('');

  formPass = this.fb.group({
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(8),
        regexValidator(MAYUSCULA_REGEX, 'sinMayuscula'),
        regexValidator(ESPECIAL_REGEX, 'sinCaracterEspecial'),
        strongPasswordValidator,
      ],
    ],
    confirmPassword: [
      '',
      [
        Validators.required,
        Validators.minLength(8),
        regexValidator(MAYUSCULA_REGEX, 'sinMayuscula'),
        regexValidator(ESPECIAL_REGEX, 'sinCaracterEspecial'),
        confirmPasswordValidator('password'),
        strongPasswordValidator,
      ],
    ],
  });

  constructor() {
    this.signalr.updateMail$.subscribe(async (update) =>
      this.dataUser.update((lista) => ({ ...lista!, email: update })),
    );
    this.signalr.updateName$.subscribe(async (update) =>
      this.dataUser.update((lista) => ({ ...lista!, name: update })),
    );
    this.signalr.updatePass$.subscribe();
  }

  // metodos
  async ngOnInit(): Promise<void> {
    try {
      this.loader.set(true);

      await Promise.all([this.LoadUsuario(), this.LoadCompany()]);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      this.loader.set(false);
    }
  }

  async LoadUsuario(): Promise<void> {
    this.dataUser.set(await lastValueFrom(this.user.execute(this.id()!)));
  }

  changeEditName(): void {
    this.editName.set(!this.editName());
    this.editMail.set(false);
    this.falloUser.set(false);
    this.inputUser.patchValue(this.dataUser()?.name!);
  }

  changeEditMail(): void {
    this.editMail.set(!this.editMail());
    this.editName.set(false);
    this.inputMail.patchValue(this.dataUser()?.email!);
  }

  changeContrasena(): void {
    this.changePass.set(!this.changePass());
  }

  togglePass(): void {
    this.showPass.set(!this.showPass());
  }

  clearPass(): void {
    this.formPass.patchValue({
      password: '',
      confirmPassword: '',
    });
  }

  async onSavePass(): Promise<void> {
    try {
      this.mensaje.set('Actualizando Contraseña !!!');
      this.onUpdate.set(true);
      await lastValueFrom(
        this.updatePassword.execute(
          this.auth.getUserId()!,
          this.formPass.value.password!,
        ),
      );
      this.clearPass();
    } catch (error) {
      throw new Error('Algo fallo al actualizar contraseña');
    } finally {
      this.changePass.set(false);
      this.onUpdate.set(false);
    }
  }

  async OnUpdateName(): Promise<void> {
    try {
      await lastValueFrom(
        this.updateNombres.execute(
          this.auth.getUserId()!,
          this.inputUser.value!,
        ),
      );
    } catch (error) {
      throw new Error('Algo salio mal al actualizar nombre');
    }
  }

  async OnUpdateMail(): Promise<void> {
    try {
      await lastValueFrom(
        this.updateEmail.execute(this.auth.getUserId()!, this.inputMail.value!),
      );
    } catch (error) {
      throw new Error('Algo salio mal actualizando correo');
    }
  }

  onConfirm(modo: string): void {
    const emailMatch =
      this.dataUser()?.email?.toString() === this.inputMail.value?.toString();
    const nameMatch =
      this.dataUser()?.name?.toString() === this.inputUser.value?.toString();

    switch (modo) {
      case 'mail':
        if (!emailMatch) {
          this.confirmaMail.set(true);
        } else {
          this.confirmaMail.set(false);
        }
        break;

      case 'user':
        if (!nameMatch) {
          this.confirmaUser.set(true);
        } else {
          this.confirmaUser.set(false);
          this.falloUser.set(true);
        }
        break;

      default:
        console.warn(`Modo no reconocido: ${modo}`);
        break;
    }
  }

  async onEditarMail($event: boolean): Promise<void> {
    if ($event) {
      await this.ChangeMail();
      this.confirmaMail.set(false);
    } else {
      this.confirmaMail.set(false);
    }
  }

  async onEditarUser($event: boolean): Promise<void> {
    if ($event) {
      await this.ChangeName();
      this.confirmaUser.set(false);
    } else {
      this.confirmaUser.set(false);
    }
  }

  async ChangeName(): Promise<void> {
    try {
      this.mensaje.set('Actualizando Nombre de usuario !!!');
      this.onUpdate.set(true);
      await lastValueFrom(
        this.updateNombres.execute(
          this.auth.getUserId()!,
          this.inputUser.value!,
        ),
      );
    } catch (error) {
      throw new Error('No se pudo actualizar nombre: ' + error);
    } finally {
      this.onUpdate.set(false);
      this.editName.set(false);
    }
  }

  async ChangeMail(): Promise<void> {
    try {
      this.mensaje.set('Actualizando correo !!');
      this.onUpdate.set(true);
      await lastValueFrom(
        this.updateEmail.execute(this.auth.getUserId()!, this.inputMail.value!),
      );
    } catch (error) {
      throw new Error('No se pudo actualizar correo' + error);
    } finally {
      this.editMail.set(false);
      this.onUpdate.set(false);
    }
  }

  async LoadCompany(): Promise<void> {
    try {
      const companyData = await lastValueFrom(
        this.company.execute(this.auth.companyId()!),
      );
      this.nameCompany.set(companyData.name || 'Empresa sin nombre');
    } catch (error) {
      console.error('Error loading company data:', error);
      this.nameCompany.set('Empresa no encontrada');
    }
  }
}
