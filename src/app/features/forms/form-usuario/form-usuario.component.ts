import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/core/infrastructure/http/interceptors/auth.service';
import { Rol } from 'src/app/core/infrastructure/dto/request/sig-in-request.dto';
import { confirmPasswordValidator, strongPasswordValidator } from 'src/app/core/infrastructure/http/interceptors/password.validator';
import { ValidaEmailUseCase } from 'src/app/core/aplication/use-cases/session-usecase/valida-email.useCase';
import { UserCreateUseCase } from 'src/app/core/aplication/use-cases/user-usecase/user-create.useCase';
import { UserRequestDto } from 'src/app/core/infrastructure/dto/request/user/user-request.dto';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-form-usuario',
  templateUrl: './form-usuario.component.html',
  styleUrls: ['./form-usuario.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class FormUsuarioComponent implements OnInit {
  usuarioForm: FormGroup;
  rolesOptions = [
    { label: 'Administrador', value: Rol.Administrador },
    { label: 'Usuario', value: Rol.Usuario },
  ];
  emailExiste: boolean = false;
  loadingEmail: boolean = false;
  loadingSubmit: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';
  pass: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private validaEmail: ValidaEmailUseCase,
    private userCreateUseCase: UserCreateUseCase,
  ) {
    this.usuarioForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), strongPasswordValidator()]],
      confPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          confirmPasswordValidator('password'),
        ],
      ],
      rol: ['', Validators.required],
    });
  }

  ngOnInit(): void {
  }

  async validarEmail(): Promise<void> {
    const emailControl = this.usuarioForm.get('email');
    const emailValue = emailControl?.value;
    
    if (emailValue && emailValue !== '' && emailControl?.valid) {
      await this.consultarEmail(emailValue);
    }
  }

  async consultarEmail(email: string): Promise<void> {
    try {
      this.loadingEmail = true;
      const response = await lastValueFrom(this.validaEmail.execute(email));
      this.emailExiste = response;
      
      if (response) {
        this.usuarioForm.get('email')?.setErrors({ 'emailExists': true });
      }
    } catch (error) {
      console.error('Error al validar email:', error);
      throw error;
    } finally {
      this.loadingEmail = false;
    }
  }

  async changePass() {
    this.pass = !this.pass;
  }

  async onSubmit(): Promise<void> {
    if (this.usuarioForm.valid && !this.emailExiste) {
      try {
        this.loadingSubmit = true;
        this.errorMessage = '';
        this.successMessage = '';
        
        const idCompany = this.authService.getCompany()!;
        const usuarioData: UserRequestDto = {
          id: '', // El backend generará el ID
          name: this.usuarioForm.get('name')?.value,
          email: this.usuarioForm.get('email')?.value,
          password: this.usuarioForm.get('password')?.value,
          idCompany: idCompany,
          rol: this.usuarioForm.get('rol')?.value,
        };
        
        const response = await lastValueFrom(this.userCreateUseCase.execute(usuarioData));
        this.successMessage = 'Usuario creado exitosamente!';
        console.log('Usuario creado:', response);
        this.usuarioForm.reset();
        
        setTimeout(() => {
          this.successMessage = '';
        }, 5000);
      } catch (error) {
        this.errorMessage = 'Error al crear el usuario. Intente nuevamente.';
        console.error('Error al crear usuario:', error);
      } finally {
        this.loadingSubmit = false;
      }
    }
  }

  onReset(): void {
    this.usuarioForm.reset();
  }
}
