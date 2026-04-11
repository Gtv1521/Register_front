import { Component, inject, OnInit, signal } from '@angular/core';
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
import { LoaderSessionComponent } from '../../components/floads/loader-session-component/loader-session-component';
import { CompanyGetUseCase } from 'src/app/core/aplication/use-cases/company-usecase/company-get.useCase';
import { CompanyEntity } from 'src/app/core/domain/entitys/company.entity';
import { RegisterStateService } from 'src/app/core/infrastructure/services/effect/register-state.service';
import { lastValueFrom } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { NewObservationComponent } from '../../components/floads/new-observation-component/new-observation-component';
import { UserGetIdUseCase } from 'src/app/core/aplication/use-cases/user-usecase/user-get-id.useCase';
import { RegisterPdfUseCase } from 'src/app/core/aplication/use-cases/register-usecase/register-pdf.useCase';

type filterMode = 'todo' | 'Ultimos' | 'Primeros';

@Component({
  selector: 'app-see-observation',
  imports: [
    MatIconModule,
    CardObservation,
    FormsModule,
    DatePipe,
    PhonePipe,
    LoaderSessionComponent,
    NewObservationComponent,
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
  private user = inject(UserGetIdUseCase);
  private get_comapany = inject(CompanyGetUseCase);
  private auth = inject(AuthService);
  private download = inject(RegisterPdfUseCase);

  // estados globales
  public register = inject(RegisterStateService);

  // datos para usar en el formulario
  usuario = signal<UserEntity | any>(undefined);
  client = signal<ClientEntity | any>(undefined);
  observationsList = signal<ObservationEntity[]>([]);
  busqueda = signal<string>('');
  filterActual = signal<filterMode>('Primeros');
  nueva = signal<boolean>(false);
  loader = signal<boolean>(false);
  state = history.state;
  company = signal<CompanyEntity | any>(undefined);
  errorObservation = signal<HttpErrorResponse | null>(null);
  invitado = signal<boolean>(false);
  registro = signal<string>('');

  // funcion principal para la traida de datos
  async ngOnInit(): Promise<void> {
    const registroId = this.route.snapshot.paramMap.get('id');
    this.registro.set(registroId?.toString()!);
    if (!registroId) return;

    this.invitado.set(this.auth.getSession() ? false : true);

    this.loader.set(true);
    this.state.editar ? this.nueva.set(true) : this.nueva.set(false);

    try {
      const dataRegistro: RegisterEntity = await this.LoadRegister(registroId);
      await this.LoadCompany(dataRegistro.idCompany!);

      await Promise.all([
        this.LoadClient((await dataRegistro).idClient),
        this.usuario.set(await this.LoadUser((await dataRegistro).idUser)),
        this.observationsList.set(await this.LoadObservations(registroId)),
      ]);
    } catch (error: any) {
      console.log(error);
    } finally {
      this.loader.set(false);
    }
  }

  async LoadObservations(registro: string): Promise<ObservationEntity[]> {
    try {
      const res = lastValueFrom(this.observations.execute(registro, 1, 30));
      if (!res) this.errorObservation.set(res);
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
      this.client.set(res);
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
  async LoadCompany(idcompany: string): Promise<void> {
    const res = await lastValueFrom(this.get_comapany.execute(idcompany));
    if (!res) throw new Error('No se pudo cargar Empresa');
    this.company.set(res);
    // return res;
  }

  goBack(): void {
    this.router.navigate(['dashboard']);
  }

  onBuscar(): void {
    this.filterActual.set('Primeros');
  }

  onChangeState($event: boolean): void {
    history.replaceState({ ...history.state, editar: $event }, '');
  }

  onVerTodos(): void {
    this.filterActual.set('todo');
    this.busqueda.set('');
  }
  onVerUltimos(): void {
    this.filterActual.set('Ultimos');
    this.busqueda.set('');
  }
  onVerPrimeros(): void {
    this.filterActual.set('Primeros');
    this.busqueda.set('');
  }

  onCloseModal($event: boolean) {
    this.nueva.set($event);
  }

  onNewObservation($event: any) {
    // Agregar la nueva observación al inicio de la lista
    const currentObservations = this.observationsList();
    this.observationsList.set([$event, ...currentObservations]);
  }

  toogleNueva(): void {
    this.nueva.set(true);
  }

  imprimirDocumento() {
    this.download.execute(this.registro()).subscribe({
      next: ({ url, filename }) => {
        const link = document.createElement('a');
        link.href = url;
        link.download = filename; // Usa el nombre real que vino en el Header
        link.click();

        // Liberar memoria del navegador en Arch Linux/Chrome
        setTimeout(() => URL.revokeObjectURL(url), 100);
      },
      error: (err) => console.error('Error al descargar el PDF', err),
    });
  }
}
