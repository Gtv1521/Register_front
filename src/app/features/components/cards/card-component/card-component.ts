import { DatePipe } from '@angular/common';
import {
  Component,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
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

  registro = input<RegisterEntity>();
  verDetalleEvent = output<string>();
  crearObservacionEvent = output<string>();
  delete = input<boolean>();
  select = output<{ state: boolean; id: string }>();

  stateDelete = signal<boolean>(false);
  descripcion!: string;

  constructor() {
    effect(() => {
      if (!this.delete()) {
        this.stateDelete.set(false);
        this.select.emit({ state: false, id: '' });
      }
    });
  }

  ngOnInit() {
    this.imageUrl =
      this.registro()?.observation === null ||
      this.registro()?.observation === undefined
        ? '/generic.webp'
        : this.registro()?.observation?.photos?.[0]?.photo;

    this.formateTexto();
  }

  imprimirDocumento() {
    this.download.execute(this.registro()?.id!).subscribe({
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
      this.registro()?.observation?.description?.replace(/\n/g, '<br>') || '';
  }

  onDelete(): void {
    if (this.delete()) {
      this.stateDelete.set(!this.stateDelete());
      this.select.emit({ state: this.stateDelete(), id: this.registro()?.id! });
    }
  }

  public verDetalle(idObservacion?: string) {
    this.verDetalleEvent.emit(idObservacion!);
  }
  public crearObservacion() {
    this.router.navigate([`registro/${this.registro()?.id}`], {
      state: { editar: true },
    });
  }
}
