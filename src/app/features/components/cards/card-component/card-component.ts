import { DatePipe } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { RegisterEntity } from 'src/app/core/domain/entitys/register.entity';
import { MatIcon } from '@angular/material/icon';
import { RegisterPdfUseCase } from 'src/app/core/aplication/use-cases/register-usecase/register-pdf.useCase';

@Component({
  selector: 'app-card-component',
  imports: [DatePipe, MatIcon],
  templateUrl: './card-component.html',
  styleUrl: './card-component.scss',
})
export class CardComponent {
  private router = inject(Router);
  private download = inject(RegisterPdfUseCase);

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

  imprimirDocumento() {
    this.download.execute(this.registro.id).subscribe({
      next: ({ url, filename }) => {
        const link = document.createElement('a');
        link.href = url;
        link.download = filename; // Usa el nombre real que vino en el Header
        link.click();

        // Liberar memoria del navegador en Arch Linux/Chrome
        setTimeout(() => URL.revokeObjectURL(url), 100);
      },
      error: (err) => console.error('Error al descargar el PDF', err),
    });
  }

  formateTexto() {
    this.descripcion =
      this.registro.observation?.description?.replace(/\n/g, '<br>') || '';
  }

  public verDetalle(idObservacion?: string) {
    this.verDetalleEvent.emit(idObservacion);
  }
  public crearObservacion() {
    this.router.navigate([`registro/${this.registro.id}`], {
      state: { editar: true },
    });
  }
}
