import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { ObservartionGetAllUseCase } from 'src/app/core/aplication/use-cases/observation-usecase/observartionGetAll.useCase';
import { RegisterUseCase } from 'src/app/core/aplication/use-cases/register-usecase/register.useCase';
import { ClientEntity } from 'src/app/core/domain/entitys/client.entity';
import { ObservationEntity } from 'src/app/core/domain/entitys/observation.entity';
import { RegisterEntity } from 'src/app/core/domain/entitys/register.entity';
import { UserEntity } from 'src/app/core/domain/entitys/user.entity';
import { CardObservation } from '../card-observation/card-observation';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ClientGetUseCase } from 'src/app/core/aplication/use-cases/client-useCase/client-get.useCase';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
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
import { SignalRService } from 'src/app/core/infrastructure/services/signalr/signal-r.service';
import { OnlyNumbers } from 'src/app/core/directives/only-numbers';
import { ConfirmAlertComponent } from '../../components/floads/confirm-alert-component/confirm-alert-component';
import { RegisterUpdateAntisipoUseCase } from 'src/app/core/aplication/use-cases/register-usecase/register-update-antisipo.useCase';
import { CargandoAccionComponent } from '../../components/floads/cargando-accion-component/cargando-accion-component';
import { CurrencyPipe as current } from '@angular/common';
import { RegisterUpdateTotalUseCase } from 'src/app/core/aplication/use-cases/register-usecase/register-update-total.useCase';
import { ObservationFilterUseCase } from 'src/app/core/aplication/use-cases/observation-usecase/observation-filter.useCase';
import { LoaderComponent } from '../../components/floads/loader-component/loader-component';
import { PhonePipe } from '../../../core/infrastructure/http/pipes/phone-pipe';
import { isJsxTagNameExpression } from 'node_modules/typescript/lib/typescript';
import { AdvertenciasGetAllUseCase } from 'src/app/core/aplication/use-cases/advertencias-useCase/advertencias-get-all.useCase';
import { AdvertenciaEntity } from 'src/app/core/domain/entitys/advertencia.entity';

type filterMode = 'todo' | 'Ultimos' | 'Primeros';

@Component({
  selector: 'app-see-observation',
  imports: [
    MatIconModule,
    CardObservation,
    FormsModule,
    DatePipe,
    LoaderSessionComponent,
    NewObservationComponent,
    CommonModule,
    OnlyNumbers,
    ConfirmAlertComponent,
    CargandoAccionComponent,
    ReactiveFormsModule,
    LoaderComponent,
    PhonePipe,
  ],
  providers: [CurrencyPipe],
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
  private signalr = inject(SignalRService);
  private updateAntisipo = inject(RegisterUpdateAntisipoUseCase);
  private updateTotal = inject(RegisterUpdateTotalUseCase);
  private currencyPipe = inject(current);
  private filterObservation = inject(ObservationFilterUseCase);
  private advertencias = inject(AdvertenciasGetAllUseCase);

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
  editarTotal = signal<boolean>(false);
  editarAntisipo = signal<boolean>(false);
  modalAntisipo = signal<boolean>(false);
  modalTotal = signal<boolean>(false);
  updateOn = signal<boolean>(false);
  allObservations = signal<ObservationEntity[]>([]);
  seleccionado = signal<'todo' | 'primero' | 'ultimo'>('todo');
  buscarOn = signal<boolean>(false);
  loadObs = signal<boolean>(false);
  listAdvertencias = signal<AdvertenciaEntity[] | null>(null);

  // parametros de inputs
  antisipo = new FormControl('');
  total = new FormControl('');
  search = new FormControl('', [Validators.required]);

  // actualiza = effect(
  constructor() {
    this.signalr.updateTotal$.subscribe((data) => {
      if (data.id === this.registro()) this.register.updateTotal(data.total);
    });

    this.signalr.updateAntisipo$.subscribe((data) => {
      if (data.id === this.registro())
        this.register.updateAntisipo(data.antisipo);
    });

    this.signalr.deleteObservacion$.subscribe((id) => {
      const currentObservations = this.observationsList();
      this.observationsList.set(
        currentObservations.filter((obs) => obs.id !== id),
      );
      this.allObservations.set(
        currentObservations.filter((obs) => obs.id !== id),
      );
    });

    this.signalr.newObservation$.subscribe((observation) => {
      if (observation.idRegister === this.registro()) {
        this.observationsList.update((lista) => [observation, ...lista]);
        this.allObservations.update((lista) => [observation, ...lista]);
      }
    });

    this.signalr.updateRegistro$.subscribe((registro) => {
      if (registro.id === this.registro()) {
        this.register.updateStatus(registro.statusRegister);
      }
    });
  }

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
        await this.LoadObservations(registroId).then((observations) => {
          this.observationsList.set(observations);
          this.allObservations.set(observations);
        }),
        this.loadAdvertencias(),
        // await this.LoadUser((await dataRegistro).idUser),
        // this.usuario.set(dataRegistro.tecnico),
      ]);
    } catch (error: any) {
      console.log(error);
    } finally {
      this.loader.set(false);
    }
  }

  truncar(valor: number): number {
    return Math.trunc(valor * 100) / 100;
  }

  async loadAdvertencias(): Promise<void> {
    const response = await lastValueFrom(
      this.advertencias.execute(this.auth.companyId()!),
    );
    this.listAdvertencias.set(response);
  }

  onEditarAntisipo() {
    this.actualizarValor();
    this.editarAntisipo.set(!this.editarAntisipo());
  }

  onModalAntisipo(): void {
    if (
      this.monto(this.antisipo.value) ===
      this.register.oneRegisterState()?.antisipo
    ) {
      this.editarAntisipo.set(false);
      return;
    }

    this.modalAntisipo.set(true);
  }

  onEditarTotal(): void {
    this.actualizarTotal();
    this.editarTotal.set(!this.editarTotal());
  }

  onModalTotal(): void {
    if (
      this.monto(this.total.value) ===
      this.register.oneRegisterState()?.totalPagar
    ) {
      this.editarTotal.set(false);
      return;
    }

    this.modalTotal.set(true);
  }

  actualizarValor() {
    const monto = this.register.oneRegisterState()?.antisipo;
    // Si hay monto, lo formateamos y lo seteamos al control
    if (monto !== undefined && monto !== null) {
      const formateado = this.currencyPipe.transform(
        monto,
        'COP',
        'symbol-narrow',
        '1.2-2',
      );
      this.antisipo.setValue(formateado);
    }
  }

  actualizarTotal() {
    const monto = this.register.oneRegisterState()?.totalPagar;
    // Si hay monto, lo formateamos y lo seteamos al control
    if (monto !== undefined && monto !== null) {
      const formateado = this.currencyPipe.transform(
        monto,
        'COP',
        'symbol-narrow',
        '1.2-2',
      );
      this.total.setValue(formateado);
    }
  }

  async changeAntisipo($event: boolean): Promise<void> {
    this.modalAntisipo.set(false);
    if (!$event) return;

    try {
      this.updateOn.set(true);
      var response = await lastValueFrom(
        this.updateAntisipo.execute(
          this.registro(),
          this.monto(this.antisipo.value),
        ),
      );

      if (response) this.editarAntisipo.set(false);
    } catch (error) {
      console.log(error);
    } finally {
      this.updateOn.set(false);
    }
  }

  cargarMasAntiguo(orden: 'primero' | 'ultimo') {
    const registros = this.allObservations(); // O de donde obtengas tu lista

    if (registros && registros.length > 0) {
      // Encontramos el registro con la fecha menor
      const masAntiguo = registros.reduce((prev, curr) => {
        const fechaPrev = new Date(prev.createdAt).getTime();
        const fechaCurr = new Date(curr.createdAt).getTime();

        if (orden === 'primero') {
          // Lógica para el más antiguo (fecha menor)
          return fechaPrev < fechaCurr ? prev : curr;
        } else {
          // Lógica para el más reciente (fecha mayor)
          return fechaPrev > fechaCurr ? prev : curr;
        }
      });

      this.observationsList.update(() => [masAntiguo]);
    }
  }

  async changeTotal($event: boolean): Promise<void> {
    this.modalTotal.set(false);
    if (!$event) return;

    try {
      this.updateOn.set(true);
      var response = await lastValueFrom(
        this.updateTotal.execute(this.registro(), this.monto(this.total.value)),
      );

      if (response) this.editarTotal.set(false);
    } catch (error) {
      console.log(error);
    } finally {
      this.updateOn.set(false);
    }
  }

  monto(valor: any): number {
    if (!valor) return 0;
    const soloNumeros = valor.replace(/\D/g, '');
    const valorFinal = (Number(soloNumeros) / 100).toFixed(2);
    return Number(valorFinal);
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

  closeBuscar(): void {
    this.buscarOn.set(false);
    this.search.setValue('');
    this.loadObs.set(true);
    setTimeout(() => {
      this.observationsList.set(this.allObservations());
      this.loadObs.set(false);
    }, 300);
  }

  async onBuscar(): Promise<void> {
    // this.filterActual.set('Primeros');
    if (this.search.invalid) return;
    const filter = this.search.value;
    this.buscarOn.set(true);
    try {
      this.loadObs.set(true);
      const observations = await lastValueFrom(
        this.filterObservation.execute(this.registro(), filter!),
      );
      this.observationsList.update(() => observations);
    } catch (error) {
      this.observationsList.set([]);
    } finally {
      this.loadObs.set(false);
    }
  }

  onChangeState($event: boolean): void {
    history.replaceState({ ...history.state, editar: $event }, '');
  }

  onVerTodos(): void {
    this.filterActual.set('todo');
    this.busqueda.set('');
    this.observationsList.update(() => this.allObservations());
    this.seleccionado.set('todo');
  }
  onVerUltimos(): void {
    this.filterActual.set('Ultimos');
    this.busqueda.set('');
    this.cargarMasAntiguo('ultimo');
    this.seleccionado.set('ultimo');
  }
  onVerPrimeros(): void {
    this.filterActual.set('Primeros');
    this.busqueda.set('');
    this.cargarMasAntiguo('primero');
    this.seleccionado.set('primero');
  }

  onCloseModal($event: boolean) {
    this.nueva.set($event);
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
