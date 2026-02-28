import {
  Component,
  Inject,
  inject,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { ObservartionGetAllUseCase } from 'src/app/core/aplication/use-cases/observation-usecase/observartionGetAll.useCase';
import { RegisterUseCase } from 'src/app/core/aplication/use-cases/register-usecase/register.useCase';
import { ClientEntity } from 'src/app/core/domain/entitys/client.entity';
import { ObservationEntity } from 'src/app/core/domain/entitys/observation.entity';
import { RegisterEntity } from 'src/app/core/domain/entitys/register.entity';
import { UserEntity } from 'src/app/core/domain/entitys/user.entity';
import { CardObservation } from '../card-observation/card-observation';
import { FormsModule } from '@angular/forms';
import { ClientGetUseCase } from 'src/app/core/aplication/use-cases/client-useCase/client-get.useCase';
import { UserGetUseCase } from 'src/app/core/aplication/use-cases/user-usecase/user-get.useCase';
import { DatePipe } from '@angular/common';
import { PhonePipe } from '../../../core/infrastructure/http/pipes/phone-pipe';
import { AuthService } from 'src/app/core/infrastructure/http/interceptors/auth.service';
import { NewObservation } from '../new-observation/new-observation';
import { LoaderSessionComponent } from '../../components/floads/loader-session-component/loader-session-component';
import { CompanyGetUseCase } from 'src/app/core/aplication/use-cases/company-usecase/company-get.useCase';
import { CompanyEntity } from 'src/app/core/domain/entitys/company.entity';
import { RegisterStateService } from 'src/app/core/infrastructure/services/effect/register-state.service';
import { lastValueFrom } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

type filterMode = 'todo' | 'Ultimos' | 'Primeros';

@Component({
  selector: 'app-see-observation',
  imports: [
    MatIconModule,
    CardObservation,
    FormsModule,
    DatePipe,
    PhonePipe,
    NewObservation,
    LoaderSessionComponent,
  ],
  templateUrl: './see-observation.html',
  styleUrl: './see-observation.scss',
})
export class SeeObservation implements OnInit {
  // llamado a los casos de uso
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private observations = inject(ObservartionGetAllUseCase);
  private registers = inject(RegisterUseCase);
  private clients = inject(ClientGetUseCase);
  private user = inject(UserGetUseCase);
  private get_comapany = inject(CompanyGetUseCase);
  private auth = inject(AuthService);

  // estados globales
  public register = inject(RegisterStateService);

  // datos para usar en el formulario
  usuario: UserEntity | any;
  client: ClientEntity | any;
  observationsList: ObservationEntity[] = [];
  busqueda: string = '';
  filterActual: filterMode = 'todo';
  nueva: boolean = false;
  loader: boolean = false;
  state = history.state;
  company!: CompanyEntity;
  errorObservation!: HttpErrorResponse;

  // funcion principal para la traida de datos
  async ngOnInit(): Promise<void> {
    const registroId = this.route.snapshot.paramMap.get('id');
    if (!registroId) return;

    this.loader = true;
    this.state.editar ? (this.nueva = true) : (this.nueva = false);

    try {
      await this.LoadCompany();
      const dataRegistro = this.LoadRegister(registroId);

      await Promise.all([
        this.LoadClient((await dataRegistro).idClient),
        (this.usuario = await this.LoadUser((await dataRegistro).idUser)),
        (this.observationsList = await this.LoadObservations(
          (await dataRegistro).id,
        )),
      ]);
    } catch (error: any) {
      console.log(error);
    } finally {
      this.loader = false;
    }
  }

  async LoadObservations(registro: string): Promise<ObservationEntity[]> {
    try {
      const res = lastValueFrom(this.observations.execute(registro, 1, 30));
      if (!res) this.errorObservation = res;
      return res;
    } catch (error) {
      throw error;
    }
  }

  // Carga los registros de la empresa
  async LoadRegister(id: string): Promise<RegisterEntity> {
    try {
      const res = await lastValueFrom(this.registers.execute(id));
      if (!res) throw new Error('Registro no valido');
      this.register.setOneRegister(res);
      return res;
    } catch (error) {
      throw error;
    }
  }

  // carga datos de cliente
  async LoadClient(cliente: string): Promise<ClientEntity> {
    try {
      const res = await lastValueFrom(this.clients.execute(cliente));
      if (!res) throw new Error('No se cargo Cliente');
      this.client = res;
      return res;
    } catch (error) {
      throw error;
    }
  }

  // carga datos de ususario
  async LoadUser(userId: string): Promise<UserEntity> {
    try {
      const res = await lastValueFrom(this.user.execute(userId));
      if (!res) throw new Error('No se cargo usuario');
      return res;
    } catch (error) {
      throw error;
    }
  }

  // carga datos de la empresa
  async LoadCompany(): Promise<void> {
    const res = await lastValueFrom(
      this.get_comapany.execute(this.auth.getCompany()!),
    );
    if (!res) throw new Error('No se pudo cargar Empresa');
    this.company = res;
    // return res;
  }

  goBack(): void {
    window.history.back();
  }

  onBuscar(): void {
    this.filterActual = 'Primeros';
  }

  onChangeState($event: boolean): void {
    history.replaceState({ ...history.state, editar: $event }, '');
  }

  onVerTodos(): void {
    this.filterActual = 'todo';
    this.busqueda = '';
  }
  onVerUltimos(): void {
    this.filterActual = 'Ultimos';
    this.busqueda = '';
  }
  onVerPrimeros(): void {
    this.filterActual = 'Primeros';
    this.busqueda = '';
  }

  onCloseModal($event: boolean) {
    this.nueva = $event;
  }

  toogleNueva(): void {
    this.nueva = true;
  }
}
