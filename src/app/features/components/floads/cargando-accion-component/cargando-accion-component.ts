import { Component, input, signal } from '@angular/core';
import { LoaderComponent } from "../loader-component/loader-component";

@Component({
  selector: 'app-cargando-accion-component',
  imports: [LoaderComponent],
  templateUrl: './cargando-accion-component.html',
  styleUrl: './cargando-accion-component.scss',
})
export class CargandoAccionComponent {

  mensaje = input<string>('Mensaje');
}
