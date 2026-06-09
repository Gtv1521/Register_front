import { Component, input, output } from '@angular/core';

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

  isDragging = false;
  startX = 0;
  startY = 0;
  translateX = 0;
  translateY = 0;

  ampliar() {
    this.isZoomed = true;
    if (this.scale <= 4) {
      this.scale = this.scale + 1;
    }
    this.translateX = 0; 
    this.translateY = 0;
  }

  restaurar(event: MouseEvent) {
    event.preventDefault();
    if (this.scale > 1) {
      this.scale = this.scale - 1;
    }
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
    if (!this.isZoomed) return;
    this.isDragging = true;
    this.startX = event.clientX - this.translateX;
    this.startY = event.clientY - this.translateY;
  }

  onMouseMove(event: MouseEvent) {
    if (!this.isDragging || !this.isZoomed) return;
    event.preventDefault();
    this.translateX = event.clientX - this.startX;
    this.translateY = event.clientY - this.startY;
  }

  onMouseUp() {
    this.isDragging = false;
  }

  getTrackTransform() {
    const carouselTranslate = `translateX(-${this.currentIndex * 100}%)`;
    return `${carouselTranslate}`;
  }

  getImageTransform() {
    if (!this.isZoomed) return 'scale(1)';
    return `scale(${this.scale}) translate(${this.translateX}px, ${this.translateY}px)`;
  }

  siguiente() {
    this.isZoomed = false;
    this.scale = 1;
    this.translateX = 0;
    this.translateY = 0;
    this.currentIndex = (this.currentIndex + 1) % this.photos().length;
  }
}
