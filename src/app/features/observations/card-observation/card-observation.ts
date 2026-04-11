import { DatePipe } from '@angular/common';
import { Component, input, Input, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { ObservationEntity } from 'src/app/core/domain/entitys/observation.entity';
import { ModalImege } from "../../components/floads/modal-imege/modal-imege";

@Component({
  selector: 'app-card-observation',
  imports: [MatIcon, DatePipe, ModalImege],
  templateUrl: './card-observation.html',
  styleUrl: './card-observation.scss',
})
export class CardObservation {
  Observation = input<ObservationEntity>();
  registerStatus = input<string>();
  invitado = input<boolean>();

  photos = signal<string[]>([]);
  textoFormateado = signal<string>('');
  showModal = signal<boolean>(false);

  ngOnInit() {
    // En tu componente
    this.textoFormateado.set(
      this.Observation()?.description?.replace(/\n/g, '<br>') || '',
    );
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
