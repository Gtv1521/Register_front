import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RegisterEntity } from 'src/app/core/domain/entitys/register.entity';

@Component({
  selector: 'app-card-component',
  imports: [],
  templateUrl: './card-component.html',
  styleUrl: './card-component.scss',
})
export class CardComponent {
  imageUrl!: string | null | undefined;

  @Input() registro!: RegisterEntity;
  @Output() verDetalleEvent = new EventEmitter<string>();
  @Output() crearObservacionEvent = new EventEmitter<string>();

  ngOnInit() {
    this.imageUrl =
      this.registro.observation === null ||
        this.registro.observation === undefined
        ? '/generic.webp'
        : this.registro.observation?.photos?.[0]?.photo;
  }
  public verDetalle(idObservacion?: string) {
    this.verDetalleEvent.emit(idObservacion);
  }
  public crearObservacion(idRegistro?: string) {
    this.crearObservacionEvent.emit(idRegistro);
  }
}
