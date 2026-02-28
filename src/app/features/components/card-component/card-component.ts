import { DatePipe } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { RegisterEntity } from 'src/app/core/domain/entitys/register.entity';

@Component({
  selector: 'app-card-component',
  imports: [DatePipe],
  templateUrl: './card-component.html',
  styleUrl: './card-component.scss',
})
export class CardComponent {
  private router = inject(Router);

  imageUrl!: string | null | undefined;

  @Input() registro!: RegisterEntity;
  @Output() verDetalleEvent = new EventEmitter<string>();
  @Output() crearObservacionEvent = new EventEmitter<string>();

  descripcion!: string;

  ngOnInit() {
    this.imageUrl =
      this.registro.observation === null ||
      this.registro.observation === undefined
        ? '/generic.webp'
        : this.registro.observation?.photos?.[0]?.photo;

    this.formateTexto();
  }

  formateTexto() {
    this.descripcion =
      this.registro.observation?.description?.replace(/\n/g, '<br>') || '';
  }

  public verDetalle(idObservacion?: string) {
    this.verDetalleEvent.emit(idObservacion);
  }
  public crearObservacion() {
    this.router.navigate([`dashboard/see-observation/${this.registro.id}`], {
      state: { editar: true },
    });
  }
}
