import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RegisterGetAllUsecase } from 'src/app/core/aplication/use-cases/register-usecase/registerGetAll-usecase';
import { RegisterEntity } from 'src/app/core/domain/entitys/register.entity';
import { UserEntity } from 'src/app/core/domain/entitys/user.entity';
import { UserGetUseCase } from 'src/app/core/aplication/use-cases/user-usecase/user-get.useCase';
import { SessionComponent } from '../../components/session-component/session-component';
import { LoaderSessionComponent } from '../../components/floads/loader-session-component/loader-session-component';
import { AuthService } from 'src/app/core/infrastructure/http/interceptors/auth.service';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { NewRegisterComponent } from '../../components/new-register-component/new-register-component';
import { LogoutUseCase } from 'src/app/core/aplication/use-cases/session-usecase/logout.useCase';
import { HttpErrorResponse } from '@angular/common/http';
import { SettingsComponent } from '../../components/floads/settings-component/settings-component';
import { CardComponent } from '../../components/cards/card-component/card-component';
import { CompanyGetUseCase } from 'src/app/core/aplication/use-cases/company-usecase/company-get.useCase';
import { CompanyEntity } from 'src/app/core/domain/entitys/company.entity';

type FilterMode =
  | 'todo'
  | 'Pendiente'
  | 'En progreso'
  | 'Completado'
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
  private registers = inject(RegisterGetAllUsecase);
  private router = inject(Router);
  private getcompany = inject(CompanyGetUseCase);

  // data signals
  filterType = signal<FilterMode>('todo');
  registerList = signal<RegisterEntity[]>([]);
  usuario = signal<UserEntity | null>(null);
  loader = signal<boolean>(false);
  size = signal<number>(30);
  page = signal<number>(1);
  isLastPage = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  settings = signal<boolean>(false);
  company = signal<CompanyEntity | null>(null);

  // funcion inicial para hacer las consultas
  async ngOnInit(): Promise<void> {
    this.loader.set(true);
    try {
      await this.GetUser();
      await this.loadMore();
      await this.loadCompany();
    } catch (error: any) {
      this.errores = error;
    } finally {
      this.loader.set(false);
    }
  }

  public filteredObservations = computed(() => {
    const list = this.registerList();
    const filter = this.filterType();

    switch (filter) {
      case 'Pendiente':
        return list.filter((item) => item.statusRegister === 'Pendiente');
      case 'En progreso':
        return list.filter((item) => item.statusRegister === 'EnProgreso');
      case 'Completado':
        return list.filter((item) => item.statusRegister === 'Completado');
      case 'cancelado':
        return list.filter((item) => item.statusRegister === 'Cancelado');
      default:
        return list;
    }
  });

  setFilter(status: FilterMode) {
    this.filterType.set(status);
  }

  onCloseNewRegister() {
    this.newRegister = false;
  }

  // trae todos los usuarios
  async GetUser(): Promise<UserEntity> {
    const res = await lastValueFrom(this.user.execute());
    if (!res) throw new Error('El usuario no se encontro');
    this.usuario.set(res);
    return res;
  }

  // funcion de busqueda segun la descripcion
  onBuscar(): void {
    // this.aplicarFiltroYBusqueda();
  }

  async onLogout() {
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
  onScroll(event: any) {
    const element = event.target;
    // Si la distancia del scroll + el alto visible es >= al alto total del contenido
    if (
      element.scrollHeight - element.scrollTop <=
      element.clientHeight + 100
    ) {
      this.loadMore();
    }
  }

  async loadCompany() {
    this.company.set(
      await lastValueFrom(this.getcompany.execute(this.auth.companyId()!)),
    );
  }

  onSettings() {
    this.settings.set(!this.settings());
  }

  async loadMore() {
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
        this.isLastPage.set(true); // Si trajo menos de 10, es la última página
      }

      // LA CLAVE: Concatenamos los datos nuevos con los anteriores
      this.registerList.update((current) => [...current, ...newData]);

      // Incrementamos la página para la siguiente vez
      this.page.update((p) => p + 1);
    } catch (error) {
      console.error('Error cargando más datos', error);
    } finally {
      this.isLoading.set(false);
    }
  }
}
