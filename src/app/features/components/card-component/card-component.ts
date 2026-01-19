import { Component, EventEmitter, Input, Output, output } from '@angular/core';
import { RegisterObservationEntity } from '../../../core/domain/entitys/registerObservation.entity';

@Component({
  selector: 'app-card-component',
  imports: [],
  templateUrl: './card-component.html',
  styleUrl: './card-component.scss',
})
export class CardComponent {

  @Input() registro?: RegisterObservationEntity;
  @Output() verDetalleEvent = new EventEmitter<string>();

  public verDetalle(idObservacion?: string) {
    this.verDetalleEvent.emit(idObservacion);
  }
  public crearObservacion(idRegistro?: string) {
    console.log('Crear nueva observación con ID de registro:', idRegistro);
  }


}
