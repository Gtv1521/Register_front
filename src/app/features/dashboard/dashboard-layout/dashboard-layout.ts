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
  ],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.scss',
})
export class DashboardLayout implements OnInit {
  /* =======================
     ESTADO DE LA VISTA
     ======================= */
  filtroActual: FilterMode = 'todo';
  busqueda: string = '';
  page: number = 1;
  loader: boolean = true;

  todosRegistros: RegisterEntity[] = [];
  registrosFiltrados: RegisterEntity[] = [];
  usuario!: UserEntity | any;
  private user = inject(UserGetUseCase);
  private registers = inject(RegisterGetAllUsecase);
  private auth = inject(AuthService);

  private router = inject(Router);
  ngOnInit(): void {
    this.registers.execute().subscribe({
      next: (res) => {
        this.todosRegistros = res;
        console.log(res)
        this.aplicarFiltroYBusqueda();
      },
      error: (err) => console.error(err),
    });

    console.log(this.auth.getUserId())
    this.user.execute(`${this.auth.getUserId()}`).subscribe({
      next: (res) => {
        console.log(res)
        this.usuario = res;
      },
      error: (err) => console.error(err),
    });

    setTimeout(() => {
      this.loader = false;
    }, 3000);
  }
  cambiarFiltro(filtro: FilterMode): void {
    this.filtroActual = filtro;
    this.busqueda = '';
    this.aplicarFiltroYBusqueda();
  }

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
  private filtrarPorEstado(registros: RegisterEntity[]): RegisterEntity[] {
    switch (this.filtroActual) {
      case 'Pendiente':
        return this.todosRegistros.filter(
          (r) => r.statusRegister === 'Pending',
        );

      case 'En progreso':
        return registros.filter((r) => r.statusRegister === 'InProgress');

      case 'Completado':
        return registros.filter((r) => r.statusRegister == 'Completed');

      case 'cancelado':
        return registros.filter((r) => r.statusRegister == 'Cancelled');

      case 'todo':
      default:
        return registros;
    }
  }
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

  verDetalle(id: string): void {
    this.router.navigate(['/dashboard/see-observation', id]);
  }

  crearObservacion(id: number): void {
    console.log('Crear observación:', id);
  }
}
