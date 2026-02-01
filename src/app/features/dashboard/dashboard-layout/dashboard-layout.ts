import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

import { CardComponent } from '../../components/card-component/card-component';
import { RegisterGetAllUsecase } from 'src/app/core/aplication/use-cases/register-usecase/registerGetAll-usecase';
import { RegisterEntity } from 'src/app/core/domain/entitys/register.entity';
import { UserEntity } from 'src/app/core/domain/entitys/user.entity';
import { UserGetUseCase } from 'src/app/core/aplication/use-cases/user-usecase/user-get.useCase';
import { SessionComponent } from '../../components/session-component/session-component';
import { LoaderSessionComponent } from '../../components/floads/loader-session-component/loader-session-component';
import { AuthService } from 'src/app/core/infrastructure/http/interceptors/auth.service';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { NewRegisterComponent } from "../../components/new-register-component/new-register-component";

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
    NewRegisterComponent
],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.scss',
})
export class DashboardLayout implements OnInit {
  // datos para la pagina
  filtroActual: FilterMode = 'todo';
  busqueda: string = '';
  page: number = 1;
  loader: boolean = true;
  newRegister: boolean = false;

  // datos para mapear en la pagina
  todosRegistros: RegisterEntity[] = [];
  registrosFiltrados: RegisterEntity[] = [];
  usuario!: UserEntity | any;

  // casos de uso utilizados
  private user = inject(UserGetUseCase);
  private registers = inject(RegisterGetAllUsecase);
  private auth = inject(AuthService);
  private router = inject(Router);

  // funcion inicial para hacer las consultas
  async ngOnInit(): Promise<void> {
    this.todosRegistros = await firstValueFrom(this.registers.execute());
    this.registrosFiltrados = [...this.todosRegistros];
    this.usuario = await firstValueFrom(
      this.user.execute(`${this.auth.getUserId()}`),
    );

    this.user.execute(`${this.auth.getUserId()}`).subscribe({
      next: (res) => {
        this.usuario = res;
        setTimeout(() => {
          this.loader = false;
        }, 1000);
      },
      error: (err) => console.error(err),
    });
  }
  // cambio de filtro para filtrar los datos
  cambiarFiltro(filtro: FilterMode): void {
    this.filtroActual = filtro;
    this.busqueda = '';
    this.aplicarFiltroYBusqueda();
  }
  // funcion de busqueda segun la descripcion
  onBuscar(): void {
    this.aplicarFiltroYBusqueda();
  }
  private aplicarFiltroYBusqueda(): void {
    let resultado = this.filtrarPorEstado(this.todosRegistros);

    if (this.busqueda.trim()) {
      resultado = this.buscarSegunFiltro(resultado);
    }

    this.registrosFiltrados = resultado;
  }
  // uso del filtro segun el esdato del registro
  private filtrarPorEstado(registros: RegisterEntity[]): RegisterEntity[] {
    switch (this.filtroActual) {
      case 'Pendiente':
        return this.todosRegistros.filter(
          (r) => r.statusRegister === 0,
        );

      case 'En progreso':
        return registros.filter((r) => r.statusRegister === 1);

      case 'Completado':
        return registros.filter((r) => r.statusRegister == 2);

      case 'cancelado':
        return registros.filter((r) => r.statusRegister == 3);

      case 'todo':
      default:
        return registros;
    }
  }
  // buscar segun el filtro aplicado, busca en un solo estado
  private buscarSegunFiltro(registros: RegisterEntity[]): RegisterEntity[] {
    const texto = this.busqueda.toLowerCase().trim();

    switch (this.filtroActual) {
      case 'Pendiente':
        return registros.filter((r) =>
          r.observation?.description?.toLowerCase().includes(texto),
        );
      case 'En progreso':
        return registros.filter((r) =>
          r.observation?.description?.toLowerCase().includes(texto),
        );
      case 'Completado':
        return registros.filter((r) =>
          r.observation?.description?.toLowerCase().includes(texto),
        );
      case 'cancelado':
        return registros.filter((r) =>
          r.observation?.description?.toLowerCase().includes(texto),
        );

      case 'todo':
      default:
        return this.buscarGlobal(registros, texto);
    }
  }
  // busca en todo
  private buscarGlobal(
    registros: RegisterEntity[],
    texto: string,
  ): RegisterEntity[] {
    return registros.filter((r) => {
      const contenido = [
        r.id,
        r.idClient,
        r.statusRegister,
        r.observation?.description,
        ...(r.clients
          ? [`${r.clients.name} ${r.clients.email} ${r.clients.phone}`]
          : []),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return contenido.includes(texto);
    });
  }
  // paso de datos para el ver detalle
  verDetalle(id: string): void {
    this.router.navigate(['/dashboard/see-observation', id]);
  }
  // paso de datos para crear la observacion
  crearObservacion(id: string): void {
    this.router.navigate(['/dashboard/new-observation', id]);
  }

  openNewRegister(): void {
    this.newRegister = true;
  }
}
