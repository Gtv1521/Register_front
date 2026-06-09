import {
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RegisterGetAllUsecase } from 'src/app/core/aplication/use-cases/register-usecase/registerGetAll-usecase';
import { RegisterEntity } from 'src/app/core/domain/entitys/register.entity';
import { UserEntity } from 'src/app/core/domain/entitys/user.entity';
import { UserGetUseCase } from 'src/app/core/aplication/use-cases/user-usecase/user-get.useCase';
import { SessionComponent } from '../../components/session-component/session-component';
import { LoaderSessionComponent } from '../../components/floads/loader-session-component/loader-session-component';
import { AuthService } from 'src/app/core/infrastructure/http/interceptors/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { NewRegisterComponent } from '../../components/new-register-component/new-register-component';
import { HttpErrorResponse } from '@angular/common/http';
import { SettingsComponent } from '../../components/floads/settings-component/settings-component';
import { CardComponent } from '../../components/cards/card-component/card-component';
import { CompanyGetUseCase } from 'src/app/core/aplication/use-cases/company-usecase/company-get.useCase';
import { CompanyEntity } from 'src/app/core/domain/entitys/company.entity';
import { RegisterFilterUseCase } from 'src/app/core/aplication/use-cases/register-usecase/registerFilter-useCase';
import { LoaderComponent } from '../../components/floads/loader-component/loader-component';
import { SignalRService } from 'src/app/core/infrastructure/services/signalr/signal-r.service';
import { ConfirmAlertComponent } from '../../components/floads/confirm-alert-component/confirm-alert-component';
import { CargandoAccionComponent } from '../../components/floads/cargando-accion-component/cargando-accion-component';
import { RegisterDeleteUseCase } from 'src/app/core/aplication/use-cases/register-usecase/register-delete.useCase';
import { RoleService } from 'src/app/core/infrastructure/services/effect/role.service';

type FilterMode =
  | 'todo'
  | 'Pendiente'
  | 'En progreso'
  | 'Completado'
  | 'Entregado'
  | 'cancelado';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [
    FormsModule,
    CardComponent,
    MatIconModule,
    SessionComponent,
    LoaderSessionComponent,
    NewRegisterComponent,
    SettingsComponent,
    ReactiveFormsModule,
    LoaderComponent,
    ConfirmAlertComponent,
    CargandoAccionComponent,
  ],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.scss',
})
export class DashboardLayout implements OnInit {
  // datos para la pagina
  busqueda: string = '';
  newRegister: boolean = false;
  errores!: HttpErrorResponse;

  // casos de uso utilizados
  private auth = inject(AuthService);
  private user = inject(UserGetUseCase);
  private route = inject(ActivatedRoute);
  private readonly registers = inject(RegisterGetAllUsecase);
  private filter = inject(RegisterFilterUseCase);
  private router = inject(Router);
  private getcompany = inject(CompanyGetUseCase);
  private fb = inject(FormBuilder);
  private signalR = inject(SignalRService);
  private deleteRegister = inject(RegisterDeleteUseCase);
  private Rol = inject(RoleService);

  // data signals
  filterType = signal<FilterMode>('todo');
  idUser = signal<string>(this.auth.getUserId()!);
  registerList = signal<RegisterEntity[]>([]);
  registerDataList = signal<RegisterEntity[]>([]);
  usuario = signal<UserEntity | null>(null);
  loader = signal<boolean>(false);
  loadeRegister = signal<boolean>(false);
  size = signal<number>(30);
  page = signal<number>(1);
  isLastPage = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  settings = signal<boolean>(false);
  company = signal<CompanyEntity | null>(null);
  onSearch = signal<boolean>(false);
  eliminando = signal<boolean>(false);
  filterError = signal<string | null>(null);

  onDelete = signal<boolean>(false);
  listDelete = signal<string[]>([]);
  onModal = signal<boolean>(false);

  search = this.fb.group({
    filtro: ['', [Validators.required]],
  });

  filteredObservations = computed(() => {
    if (this.loadeRegister()) {
      return [];
    }

    const list = this.registerList();
    const filter = this.filterType();

    switch (filter) {
      case 'Pendiente':
        return list.filter((item) => item.statusRegister === 'Pendiente');
      case 'En progreso':
        return list.filter((item) => item.statusRegister === 'EnProgreso');
      case 'Completado':
        return list.filter((item) => item.statusRegister === 'Completado');
      case 'Entregado':
        return list.filter((item) => item.statusRegister === 'Entregado');
      case 'cancelado':
        return list.filter((item) => item.statusRegister === 'Cancelado');
      default:
        return list;
    }
  });

  isBlocked = computed(() => {
    return this.registerList().length === 0;
  });

  Efecto = effect(async () => {
    const valor = this.onSearch();
    try {
      if (!valor) {
        this.loadeRegister.set(true);
        await this.loadMore();
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    } finally {
      this.loadeRegister.set(false);
    }
  });

  constructor() {
    this.signalR.updateRol$.subscribe((data) => {
      if (data.id === this.usuario()?.id) {
        const current = this.usuario();
        if (current) {
          this.usuario.set({ ...current, rol: data.rol });
        }
      }
    });

    this.signalR.deleteRegistro$.subscribe((id) => {
      this.registerList.update((lista) =>
        lista.filter((item) => item.id !== id),
      );
    });

    // Suscribirse a nuevos registros en tiempo real
    this.signalR.newRegistro$.subscribe((data: RegisterEntity) => {
      this.registerList.update((lista) => [data, ...lista]);
    });
  }

  async ngOnInit(): Promise<void> {
    this.loader.set(true);

    try {
      const params = this.route.snapshot.queryParams;
      const estado = params['estado'] || '';

      this.search.patchValue({ filtro: estado });

      if (!estado) {
        await this.loadMore();
      } else {
        await this.onBuscar();
      }

      await Promise.all([this.loadCompany(), this.GetUser()]);

      const user = this.usuario();
      if (user?.rol) {
        this.Rol.setRol(user.rol);
      }
    } catch (error: any) {
      this.errores = error;
      console.error('Error inicializando el componente:', error);
    } finally {
      this.loader.set(false);
    }
  }

  async setFilter(status: FilterMode) {
    this.loadeRegister.set(true);

    await new Promise((resolve) => setTimeout(resolve, 500));

    this.filterType.set(status);
    this.loadeRegister.set(false);
  }

  onCloseNewRegister() {
    this.newRegister = false;
  }

  // trae todos los usuarios
  async GetUser(): Promise<UserEntity> {
    try {
      const res = await lastValueFrom(this.user.execute());
      this.usuario.set(res);
      return res;
    } catch (error) {
      this.GetUser();
      throw new Error(`Error al obtener el usuario: ${error}`);
      throw error;
    }
  }

  // funcion de busqueda segun la descripcion
  async onBuscar(): Promise<void> {
    if (this.search.invalid) return;
    this.onSearch.set(true);

    try {
      this.loadeRegister.set(true);
      const data = this.search.value.filtro?.toString();
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { estado: data || null }, // null lo borra de la URL si está vacío
        queryParamsHandling: 'merge',
      });

      await lastValueFrom(
        this.filter.execute(data!, this.auth.companyId()!),
      ).then((response) => {
        this.registerList.set(response);
      });
    } catch (error) {
      this.registerList.set([]);
    } finally {
      setTimeout(() => {
        this.loadeRegister.set(false);
      }, 1500);
    }
  }

  async desactivarFiltro(): Promise<void> {
    // 1. Primero activamos el loader
    this.registerList.set([]);
    this.loadeRegister.set(true);

    this.onSearch.set(false);
    this.page.set(1);
    this.isLastPage.set(false);

    this.search.patchValue({ filtro: '' });

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { estado: null },
      queryParamsHandling: 'merge',
    });
  }

  async onLogout(): Promise<void> {
    this.router.navigate(['logout']);
  }

  // paso de datos para el ver detalle
  verDetalle(id: string): void {
    this.router.navigate(['/registro', id]);
  }

  openNewRegister(): void {
    this.router.navigate(['/new-registro']);
  }

  //  refresh de registros con paginado
  onScroll(event: any): void {
    const element = event.target;
    if (
      element.scrollHeight - element.scrollTop <=
      element.clientHeight + 100
    ) {
      this.loadMore();
    }
  }

  async loadCompany(): Promise<void> {
    this.company.set(
      await lastValueFrom(this.getcompany.execute(this.auth.companyId()!)),
    );
  }

  onSettings(): void {
    this.settings.set(!this.settings());
  }

  async OnDelete(): Promise<void> {
    this.onDelete.set(!this.onDelete());
    this.listDelete.set([]);
  }

  respuestaModal($event: boolean) {
    if ($event) {
      this.Borrrando();
    } else {
      this.onModal.set(false);
      this.OnDelete();
    }
  }

  onBorrar(): void {
    this.onModal.set(true);
  }

  async Borrrando(): Promise<void> {
    try {
      this.onModal.set(false);
      this.eliminando.set(true);

      for (const id of this.listDelete()) {
        await lastValueFrom(this.deleteRegister.execute(id));
      }
    } catch (error) {
      console.error(error);
    } finally {
      this.OnDelete();
      this.eliminando.set(false);
    }
  }

  async DeleteRegisters($event: { state: boolean; id: string }): Promise<void> {
    if ($event.state) this.listDelete.update((lista) => [...lista, $event.id]);
    else
      this.listDelete.update((lista) =>
        lista.filter((item) => item !== $event.id),
      );
  }

  //  carga todos los registros de la empresa
  async loadMore(): Promise<void> {
    // Si ya estamos cargando o llegamos al final, no hacemos nada
    if (this.isLoading() || this.isLastPage()) return;

    this.isLoading.set(true);

    try {
      // Llamamos a la API con la página actual
      const newData = await lastValueFrom(
        this.registers.execute(
          this.auth.companyId()!,
          this.page(),
          this.size(),
        ),
      );

      if (newData.length < 10) {
        this.isLastPage.set(true);
      }

      this.registerList.update((current) => [...current, ...newData]);

      // Incrementamos la página para la siguiente vez
      this.page.update((p) => p + 1);
    } catch (error) {
      throw new Error('Error al cargar los registros: ' + error);
    } finally {
      this.isLoading.set(false);
    }
  }
}
