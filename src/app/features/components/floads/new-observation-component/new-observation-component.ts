import { Component, input, output, signal } from '@angular/core';
import { NewObservation } from "src/app/features/observations/new-observation/new-observation";

@Component({
  selector: 'app-new-observation-component',
  imports: [NewObservation],
  templateUrl: './new-observation-component.html',
  styleUrl: './new-observation-component.scss',
})
export class NewObservationComponent {
  close = output<boolean>();
  ChangeEditar = output<boolean>();
  NewObservationCreated = output<any>();
  idRegister = input<string>(''); // Recibe el ID del registro desde el componente padre

  onCloseModal($event: boolean): void {
    this.close.emit($event); // Emite el evento para cerrar el modal
  }
}
