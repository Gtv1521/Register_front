import { DatePipe } from '@angular/common';
import { Component, inject, input, Input, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { ObservationEntity } from 'src/app/core/domain/entitys/observation.entity';
import { ModalImege } from '../../components/floads/modal-imege/modal-imege';
import { ConfirmAlertComponent } from '../../components/floads/confirm-alert-component/confirm-alert-component';
import { LoaderComponent } from '../../components/floads/loader-component/loader-component';
import { CargandoAccionComponent } from '../../components/floads/cargando-accion-component/cargando-accion-component';
import { ObservationDeleteUseCase } from 'src/app/core/aplication/use-cases/observation-usecase/observation-delete.useCase';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-card-observation',
  imports: [
    MatIcon,
    DatePipe,
    ModalImege,
    ConfirmAlertComponent,
    CargandoAccionComponent,
  ],
  templateUrl: './card-observation.html',
  styleUrl: './card-observation.scss',
})
export class CardObservation {
  private deleteObservation = inject(ObservationDeleteUseCase);

  Observation = input<ObservationEntity>();
  registerStatus = input<string>();
  invitado = input<boolean>();

  photos = signal<string[]>([]);
  textoFormateado = signal<string>('');
  showModal = signal<boolean>(false);
  alertDelete = signal<boolean>(false);
  loadDelete = signal<boolean>(false);

  ngOnInit() {
    // En tu componente
    this.textoFormateado.set(
      this.Observation()?.description?.replace(/\n/g, '<br>') || '',
    );
  }

  onDeleteObservation() {
    this.alertDelete.set(!this.alertDelete());
  }

  async deleteOk($event: boolean): Promise<void> {
    if (!$event) {
      this.alertDelete.set(false);
      return;
    }

    this.alertDelete.set(false);
    this.loadDelete.set(true);

    try {
      await lastValueFrom(
        this.deleteObservation.execute(this.Observation()?.id!),
      );
    } catch (error) {
      console.log(error);
    } finally {
      this.loadDelete.set(false);
    }
  }

  ShowImage() {
    const photos = this.Observation()?.photos || [];
    if (photos.length > 0) {
      this.photos.set(photos.map((photo) => photo.photo!));
    }
  }

  openModal() {
    this.ShowImage();
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
  }
}
