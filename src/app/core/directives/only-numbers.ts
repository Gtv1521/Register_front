import { Directive, HostListener, input } from '@angular/core';

@Directive({
  selector: '[appOnlyNumbers]',
  standalone: true,
})
export class OnlyNumbers {
  maxLength = input<number | undefined>(undefined);
  isCurrency = input<boolean>(false);
  isPhone = input<boolean>(false);

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const allowedKeys = [
      'Backspace',
      'Tab',
      'End',
      'Home',
      'ArrowLeft',
      'ArrowRight',
      'Delete',
    ];

    if (allowedKeys.includes(event.key)) return;

    // Solo permitir números
    if (!/[0-9]/.test(event.key)) {
      event.preventDefault();
    }
  }

  @HostListener('input', ['$event'])
  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');

    if (this.isCurrency()) {
      if (!value) {
        input.value = '';
        return;
      }
      const numberValue = parseInt(value, 10) / 100;
      input.value = new Intl.NumberFormat('es-CO', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(numberValue);

      return;
    }

    if (this.isPhone()) {
      if (!value) {
        input.value = '';
        return;
      }

      let formatted = '';
      if (value.length > 0) {
        formatted = value.substring(0, 3); // Primeros 3 dígitos (300)
      }
      if (value.length > 3) {
        formatted += ' ' + value.substring(3, 6); // Siguientes 3 (123)
      }
      if (value.length > 6) {
        formatted += ' ' + value.substring(6, 10); // Últimos 4 (4567)
      }

      input.value = formatted;
      return;
    }

    const limit = this.maxLength();
    if (limit && value.length > limit) {
      value = value.substring(0, limit);
    }
    input.value = value;
  }
}
