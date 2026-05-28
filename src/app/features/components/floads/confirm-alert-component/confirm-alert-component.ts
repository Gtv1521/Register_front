import {
  Component,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-confirm-alert-component',
  imports: [],
  standalone: true,
  templateUrl: './confirm-alert-component.html',
  styleUrl: './confirm-alert-component.scss',
})
export class ConfirmAlertComponent {
  private sanitizer = inject(DomSanitizer);

  // Input para recibir el texto de la pregunta (puede contener HTML)
  pregunta = input<string>('¿Está seguro de esta acción?');
  
  // Output para emitir la respuesta
  respuesta = output<boolean>();

  // Estado interno para la animación
  animado = signal(false);

  // Método para procesar HTML de forma segura
  getPreguntaHtml(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.pregunta());
  }

  ngOnInit() {
    setTimeout(() => this.animado.set(true), 10);
  }

  cerrar() {
    this.animado.set(false);
    setTimeout(() => {
      this.respuesta.emit(false);
    }, 300);
  }

  confirmar() {
    this.animado.set(false);
    setTimeout(() => {
      this.respuesta.emit(true);
    }, 300);
  }

  onOverlayClick(event: MouseEvent) {
    // Cerrar solo si el click fue fuera del contenido del alert
    const alertElement = (event.currentTarget as HTMLElement).querySelector('.alert-content');
    if (alertElement && !alertElement.contains(event.target as Node)) {
      this.cerrar();
    }
  }
}
