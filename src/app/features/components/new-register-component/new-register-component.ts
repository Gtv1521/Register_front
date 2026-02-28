import {
  Component,
  EventEmitter,
  inject,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
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
import { lastValueFrom } from 'rxjs';
import { NewObservation } from '../../observations/new-observation/new-observation';
import { ObservationCreateUseCase } from 'src/app/core/aplication/use-cases/observation-usecase/observation-create.useCase';
import { LISTA_ESTADOS } from 'src/app/core/domain/reusables/estados.constant';
import { ObservationRequestDto } from 'src/app/core/infrastructure/dto/request/observation/observation-request.dto';

@Component({
  selector: 'app-new-register-component',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, LoaderComponent, NewObservation],
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
  private add_observation = inject(ObservationCreateUseCase);

  // datos de componente hijo
  @ViewChild('observation') newObservation!: NewObservation;
  @Output() Close = new EventEmitter<boolean>();

  loader_mail: boolean = false;
  client!: ClientEntity[] | null;
  errores!: HttpErrorResponse | null;
  editar: boolean = false;
  saveCliente: boolean = false;
  Type = Object.values(EstadoRegistro);
  idClient: string = '';
  idRegister!: string;
  cargado: boolean = false;
  loadIcono: boolean = false;
  loadObservation: boolean = false;
  datosObs!: ObservationRequestDto;

  register = this.fb.group({
    email: ['', [Validators.email, Validators.required]],
    name: ['', [Validators.minLength(3), Validators.required]],
    phone: ['', [Validators.minLength(10), Validators.required]],
    type: ['', [Validators.required]],
  });

  readonly estados = LISTA_ESTADOS;

  goEmail() {
    if (this.saveCliente === true) return;
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
            this.editar = true;
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
  loadData() {
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

  resetForm(email: string) {
    this.register.setValue({
      email: email,
      name: '',
      phone: '',
      type: '',
    });
    this.register.get('name')?.enable();
    this.register.get('phone')?.enable();
  }

  Cancelar() {
    this.Close.emit(false);
  }

  onEditar() {
    throw new Error('Method not implemented.');
  }

  onChangeEdit() {
    this.register.get('name')?.enable();
    this.register.get('phone')?.enable();
    this.register.get('email')?.enable();
    this.register.get('type')?.disable();
    this.editar = false;
    this.saveCliente = true;
  }

  // cierra la opcion de editar
  onCancelar() {
    this.onDesabled();
    this.register.get('type')?.enable();
    this.saveCliente = false;
    this.editar = true;
  }

  onDesabled() {
    this.register.get('name')?.disable();
    this.register.get('phone')?.disable();
  }

  onBack() {
    this.Close.emit(false);
  }

  onAllDesabled() {
    this.register.get('email')?.disable();
    this.register.get('name')?.disable();
    this.register.get('phone')?.disable();
    this.register.get('type')?.disable();
  }

  // habilita el panel de observacion
  onSeguir() {
    if (this.register.invalid) {
      this.register.markAllAsTouched();
      return;
    }
    this.editar = false;
    this.loadObservation = true;
    this.onAllDesabled(); // desabilita campos del formulario
  }

  // crea un nuevo cliente / Si no exite
  async newClient(): Promise<string> {
    try {
      const cliente = this.register.value;

      const data = {
        Name: cliente.name,
        Email: cliente.email,
        Phone: cliente.phone?.toString(),
      };

      // inserta cliente y retorna el id de cliente
      const insert = data as ClientRequestDto;
      const res: any = await lastValueFrom(this.newCliente.execute(insert));
      return res.id;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // crea un nuevo registro
  async newRegister(): Promise<string> {
    try {
      const baseUrl = window.location.origin;
      let data = {
        idClient: this.idClient,
        idUser: this.auth.getUserId()!,
        idCompany: this.auth.getCompany()!,
        statusRegister: this.register.value.type,
        urlRuta: `${baseUrl}/dashboard/see-observation`,
      };

      const insert = data as RegisterRequestDto;
      const res: any = await lastValueFrom(this.registerNew.execute(insert));
      return res.id;
    } catch (error) {
      throw error;
    }
  }

  // guarda la primera observasion
  async addObservation(id: string): Promise<string> {
    this.datosObs = await this.newObservation.obtenerDatos(id);
    // se cargan datos de observation
    try {
      const res = await lastValueFrom(
        this.add_observation.execute(this.datosObs),
      );
      return res;
    } catch (error) {
      throw error;
    }
  }

  async onSubmit() {
    try {
      const validar = this.newObservation.valid();
      if (!validar) return;
      this.loadIcono = true;

      if (!this.cargado) {
        this.idClient = await this.newClient();
      }
      this.idRegister = await this.newRegister();
      await this.addObservation(this.idRegister);
      this.router.navigate([`dashboard/see-observation/${this.idRegister}`]);
    } catch (error: any) {
      console.error('Error en la secuencia de guardado:', error);
      // Aquí podrías mostrar una alerta al usuario
    } finally {
      this.loadIcono = false;
    }
  }
}
