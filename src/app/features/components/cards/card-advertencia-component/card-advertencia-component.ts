import { Component, effect, input, output, signal } from '@angular/core';
import { AdvertenciaEntity } from 'src/app/core/domain/entitys/advertencia.entity';

@Component({
  selector: 'app-card-advertencia-component',
  imports: [],
  templateUrl: './card-advertencia-component.html',
  styleUrl: './card-advertencia-component.scss',
})
export class CardAdvertenciaComponent {
  datos = input<AdvertenciaEntity>();
  onEditar = input<boolean>();
  delete = output<{ id: string; state: boolean }>();

  onDelete = signal<boolean>(false);

  efecto = effect(() => {
    if (this.onEditar()) {
      this.onDelete.set(false);
    }
  });

  toggleDelete(): void {
    if (!this.onEditar()) {
      this.changeDelete();
      this.delete.emit({
        id: this.datos()?.id!,
        state: this.onDelete(),
      });
    }
  }

  changeDelete(): void {
    this.onDelete.set(!this.onDelete());
  }
}
