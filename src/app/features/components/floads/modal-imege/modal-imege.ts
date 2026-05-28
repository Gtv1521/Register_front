import { Component, input, output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-modal-imege',
  imports: [],
  templateUrl: './modal-imege.html',
  styleUrl: './modal-imege.scss',
})
export class ModalImege {
  photos = input<string[]>([]);
  close = output<void>();

  currentIndex = 0;
  isZoomed = false;
  scale = 1;

  // Estado del arrastre (Pan)
  isDragging = false;
  startX = 0;
  startY = 0;
  translateX = 0;
  translateY = 0;

  // 1. Clic Izquierdo: Ampliar
  ampliar() {
    this.isZoomed = true;
    if (this.scale <= 4) {
      this.scale = this.scale + 1;
    }
    this.translateX = 0; // Centrar
    this.translateY = 0;
  }

  // 2. Clic Derecho: Restaurar
  restaurar(event: MouseEvent) {
    event.preventDefault();
    // this.isZoomed = false;
    if (this.scale > 1) {
      this.scale = this.scale - 1;
    }
    // this.scale = 1;
    this.translateX = 0;
    this.translateY = 0;
  }

  anterior() {
    this.isZoomed = false;
    this.currentIndex =
      (this.currentIndex - 1 + this.photos().length) % this.photos().length;
  }

  irA(index: number) {
    this.currentIndex = index;
  }

  cerrar() {
    this.close.emit();
  }

  onMouseDown(event: MouseEvent) {
    if (!this.isZoomed) return; // Solo arrastrar si hay zoom
    this.isDragging = true;
    // Guardamos dónde empezó el clic relativo a la posición actual de la imagen
    this.startX = event.clientX - this.translateX;
    this.startY = event.clientY - this.translateY;
  }

  onMouseMove(event: MouseEvent) {
    if (!this.isDragging || !this.isZoomed) return;
    event.preventDefault(); // Evita seleccionar texto
    // Calculamos la nueva posición
    this.translateX = event.clientX - this.startX;
    this.translateY = event.clientY - this.startY;
  }

  onMouseUp() {
    this.isDragging = false;
  }

  // Combinamos la lógica del carrusel, el zoom y el arrastre
  getTrackTransform() {
    // Mueve el carrusel al slide actual
    const carouselTranslate = `translateX(-${this.currentIndex * 100}%)`;
    return `${carouselTranslate}`;
  }

  getImageTransform() {
    // Aplica el zoom y el arrastre a la imagen individual
    if (!this.isZoomed) return 'scale(1)';
    return `scale(${this.scale}) translate(${this.translateX}px, ${this.translateY}px)`;
  }

  // Al cambiar de slide, resetear todo
  siguiente() {
    this.isZoomed = false;
    this.scale = 1;
    this.translateX = 0;
    this.translateY = 0;
    this.currentIndex = (this.currentIndex + 1) % this.photos().length;
  }
}
