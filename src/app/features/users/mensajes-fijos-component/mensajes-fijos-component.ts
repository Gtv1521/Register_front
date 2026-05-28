import { Component, computed, effect, inject, signal } from '@angular/core';
import { CardAdvertenciaComponent } from '../../components/cards/card-advertencia-component/card-advertencia-component';
import { AdvertenciaEntity } from 'src/app/core/domain/entitys/advertencia.entity';
import { AuthService } from 'src/app/core/infrastructure/http/interceptors/auth.service';
import { AdvertenciasGetAllUseCase } from 'src/app/core/aplication/use-cases/advertencias-useCase/advertencias-get-all.useCase';
import { lastValueFrom } from 'rxjs';
import { LoaderComponent } from '../../components/floads/loader-component/loader-component';
import { MatIcon } from '@angular/material/icon';
import { NewAdvertenciaComponent } from '../../components/floads/new-advertencia-component/new-advertencia-component';
import { ConfirmAlertComponent } from '../../components/floads/confirm-alert-component/confirm-alert-component';
import { CargandoAccionComponent } from '../../components/floads/cargando-accion-component/cargando-accion-component';
import { AdvertenciasDeleteUseCase } from 'src/app/core/aplication/use-cases/advertencias-useCase/advertencias-delete.useCase';
import { SignalRService } from 'src/app/core/infrastructure/services/signalr/signal-r.service';
import { IfStmt } from 'node_modules/@angular/compiler';

@Component({
  selector: 'app-mensajes-fijos-component',
  imports: [
    CardAdvertenciaComponent,
    LoaderComponent,
    MatIcon,
    NewAdvertenciaComponent,
    ConfirmAlertComponent,
    CargandoAccionComponent,
  ],
  templateUrl: './mensajes-fijos-component.html',
  styleUrl: './mensajes-fijos-component.scss',
})
export class MensajesFijosComponent {
  private auth = inject(AuthService);
  private advertencias = inject(AdvertenciasGetAllUseCase);
  private deleteAdvertencia = inject(AdvertenciasDeleteUseCase);
  private signalR = inject(SignalRService);

  items = signal<AdvertenciaEntity[] | null>(null);
  loader = signal<boolean>(false);
  loadingDelete = signal<boolean>(false);
  onEditar = signal<boolean>(false);
  onCrear = signal<boolean>(false);
  onBorrar = signal<boolean>(true);
  confDelete = signal<boolean>(false);
  listDelete = signal<string[]>([]);
  selectedEdition = signal<AdvertenciaEntity | null>(null);
  startEdition = signal<boolean>(false);

  isLimitReachedCreated = computed(() => (this.items()?.length ?? 0) >= 3);
  isLimitReachedDelete = computed(() => (this.items()?.length ?? 0) === 0);

  Efecto = effect(() => {
    if (this.onBorrar()) this.listDelete.set([]);
  });

  constructor() {
    this.signalR.deleteAdvertencia$.subscribe((id) => {
      const currentItems = this.items() ?? [];
      this.items.set(currentItems.filter((item) => item.id !== id));
    });
    this.signalR.newAdvertencia$.subscribe((advertencia) => {
      console.log('Nueva advertencia recibida por SignalR:', advertencia);
      const currentItems = this.items() ?? [];
      this.items.set([...currentItems, advertencia]);
    });
    this.signalR.updateAdvertencia$.subscribe((updatedAdvertencia) => {
      const currentItems = this.items() ?? [];
      this.items.set(
        currentItems.map((item) =>
          item.id === updatedAdvertencia.id ? updatedAdvertencia : item,
        ),
      );
    });
  }

  async ngOnInit(): Promise<void> {
    this.loader.set(true);
    try {
      const response = await lastValueFrom(
        this.advertencias.execute(this.auth.companyId()!),
      );
      this.items.set(response);
    } catch (error) {
    } finally {
      this.loader.set(false);
    }
  }

  async DeleteOk($event: boolean): Promise<void> {
    if (!$event || this.listDelete().length === 0) {
      this.confDelete.set(false);
      this.onBorrar.set(true);
      return;
    }
    try {
      this.loadingDelete.set(true);
      const deletePromises = this.listDelete().map((id) =>
        lastValueFrom(this.deleteAdvertencia.execute(id)),
      );
      await Promise.all(deletePromises);
      this.confDelete.set(false);
      this.onBorrar.set(true);
    } catch (error) {
      console.error('Error al eliminar uno o varios ítems', error);
    } finally {
      this.loadingDelete.set(false);
    }
  }

  createListDelete($event: { id: string; state: boolean }): void {
    if ($event.state) {
      this.listDelete.update((lista) => [...lista, $event.id]);
    } else {
      this.listDelete.update((lista) =>
        lista.filter((item) => item !== $event.id),
      );
    }
  }

  PasarEdicion(item: AdvertenciaEntity): void {
    if (!this.onEditar()) return;
    this.startEdition.set(true);
    this.selectedEdition.set(item);
  }

  iniciarBorrado(): void {
    if (this.listDelete().length === 0) {
      this.onBorrar.set(true);
      console.log('No hay elementos seleccionados para eliminar');
      return;
    }
    this.confDelete.set(true);
  }

  OnCrear(): void {
    this.onCrear.set(!this.onCrear());
  }

  OnEditar(): void {
    this.onEditar.set(!this.onEditar());
    this.startEdition.set(false);
  }

  OnBorrar(): void {
    this.onBorrar.set(!this.onBorrar());
  }
}
