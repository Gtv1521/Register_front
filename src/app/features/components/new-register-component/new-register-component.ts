import { Component, inject, SimpleChanges } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { LoaderComponent } from '../floads/loader-component/loader-component';
import { ClientFilterUseCase } from 'src/app/core/aplication/use-cases/client-useCase/client-filter.useCase';
import { ClientEntity } from 'src/app/core/domain/entitys/client.entity';
import { HttpErrorResponse } from '@angular/common/http';
import { EstadoRegistro } from 'src/app/core/domain/entitys/register.entity';
import { ClientCreateUseCase } from 'src/app/core/aplication/use-cases/client-useCase/client-create.useCase';
import { ClientRequestDto } from 'src/app/core/infrastructure/dto/request/client/client-request.dto';
import { RegisterCreateUseCase } from 'src/app/core/aplication/use-cases/register-usecase/register-create.useCase';
import { RegisterRequestDto } from 'src/app/core/infrastructure/dto/request/register/register-request.dto';
import { AuthService } from 'src/app/core/infrastructure/http/interceptors/auth.service';
import { Router } from '@angular/router';
import { ResponseCreatedDto } from 'src/app/core/infrastructure/dto/response/response-created.dto';

@Component({
  selector: 'app-new-register-component',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, LoaderComponent],
  templateUrl: './new-register-component.html',
  styleUrl: './new-register-component.scss',
})
export class NewRegisterComponent {
  private fb = inject(FormBuilder);
  private filterClient = inject(ClientFilterUseCase);
  private newCliente = inject(ClientCreateUseCase);
  private registerNew = inject(RegisterCreateUseCase);
  private auth = inject(AuthService);
  private router = inject(Router);

  loader_mail: boolean = false;
  client!: ClientEntity[] | null;
  errores!: HttpErrorResponse | null;
  Type = Object.values(EstadoRegistro);
  idClient: string = '';
  idRegister!: ResponseCreatedDto;
  cargado: boolean = false;

  register = this.fb.group({
    email: ['', [Validators.email, Validators.required]],
    name: ['', [Validators.minLength(3), Validators.required]],
    phone: ['', [Validators.minLength(10), Validators.required]],
    type: ['', [Validators.required]],
  });

  readonly estados = [
    { value: EstadoRegistro.Pending, label: 'Pending' },
    { value: EstadoRegistro.InProgress, label: 'In Progress' },
    { value: EstadoRegistro.Completed, label: 'Completed' },
    { value: EstadoRegistro.Cancelled, label: 'Cancelled' },
  ];

  goEmail(): void {
    if (
      this.register.value.email !== '' ||
      this.register.value.email !== null ||
      this.register.value.email !== undefined
    ) {
      this.loader_mail = true;
      const email = this.register.value.email?.toString();
      if (email !== undefined) {
        this.resetForm(email);
        this.filterClient.execute(email).subscribe({
          next: (res: ClientEntity[]) => {
            this.errores = null;
            this.client = res;
            this.loader_mail = false;
            this.cargado = true;
            this.loadData();
            this.onDesabled();
            this.idClient = res[0].id;
          },
          error: (err) => {
            this.resetForm(email);
            this.client = null;
            this.cargado = false;
            this.errores = err;
            this.loader_mail = false;
          },
        });
      }
    }
  }

  // carga los datos de usuario ya registrados
  loadData(): void {
    if (this.client !== null) {
      const clientes = this.client[0];
      this.register.setValue({
        email: clientes.email,
        name: clientes.name,
        phone: clientes.phone.toString(),
        type: '',
      });
    }
  }

  resetForm(email: string): void {
    this.register.setValue({
      email: email,
      name: '',
      phone: '',
      type: '',
    });
    this.register.get('name')?.enable();
    this.register.get('phone')?.enable();
  }

  onDesabled(): void {
    this.register.get('name')?.disable();
    this.register.get('phone')?.disable();
  }

  async newClient() {
    const cliente = this.register.value;

    const data = {
      Name: cliente.name,
      Email: cliente.email,
      Phone: cliente.phone?.toString(),
    };

    const insert = data as ClientRequestDto;

    return this.newCliente.execute(insert).subscribe({
      next: (res: any) => {
        this.idClient = res.id;
        this.newRegister();
      },
      error: (err) => console.log(err),
    });
  }

  async newRegister() {
    let data = {
      idClient: this.idClient,
      idUser: `${this.auth.getUserId()}`,
      statusRegister: this.register.value.type,
      url: '',
    };

    const insert = data as RegisterRequestDto;
    console.log(insert);
    this.registerNew.execute(insert).subscribe({
      next: (res: any) => {
        this.idRegister = res.id;
        this.router.navigate([`dashboard/see-observation/${this.idRegister}`]);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  onSubmit() {
    if (this.register.valid) {
      if (!this.cargado) {
        this.newClient(); // guarda un nuevo cliente
      } else {
        this.newRegister();
      }
    }
  }
}
