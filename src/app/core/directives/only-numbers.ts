import { Directive, HostListener, input } from '@angular/core';

@Directive({
  selector: '[appOnlyNumbers]',
  standalone: true,
})
export class OnlyNumbers {
  maxLength = input<number | undefined>(undefined);
  isCurrency = input<boolean>(false);
  isPhone = input<boolean>(false);

  private formatting = false;

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

    // Limitar teléfono a 10 dígitos
    if (this.isPhone()) {
      const input = event.target as HTMLInputElement;
      const numbers = input.value.replace(/\D/g, '');

      if (numbers.length >= 10) {
        event.preventDefault();
        return;
      }
    }

    // Solo permitir números
    if (!/[0-9]/.test(event.key)) {
      event.preventDefault();
    }
  }

  @HostListener('input', ['$event'])
  onInput(event: Event) {
    // Evita loop infinito
    if (this.formatting) return;

    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');

    // =========================
    // FORMATO MONEDA
    // =========================
    if (this.isCurrency()) {
      if (!value) {
        input.value = '';
        return;
      }

      const numberValue = parseInt(value, 10) / 100;

      this.formatting = true;

      input.value = new Intl.NumberFormat('es-CO', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(numberValue);

      input.dispatchEvent(new Event('input', { bubbles: true }));

      this.formatting = false;

      return;
    }

    // =========================
    // FORMATO TELÉFONO
    // =========================
    if (this.isPhone()) {
      // Máximo 10 números
      value = value.substring(0, 10);

      if (!value) {
        input.value = '';
        return;
      }

      let formatted = '';

      if (value.length <= 3) {
        formatted = value;
      } else if (value.length <= 6) {
        formatted = `${value.substring(0, 3)} ${value.substring(3)}`;
      } else {
        formatted = `${value.substring(0, 3)} ${value.substring(3, 6)} ${value.substring(6, 10)}`;
      }

      this.formatting = true;

      input.value = formatted;

      // Actualiza el FormControl/ngModel
      input.dispatchEvent(new Event('input', { bubbles: true }));

      this.formatting = false;

      return;
    }

    // =========================
    // SOLO NÚMEROS CON LÍMITE
    // =========================
    const limit = this.maxLength();

    if (limit && value.length > limit) {
      value = value.substring(0, limit);
    }

    this.formatting = true;

    input.value = value;

    input.dispatchEvent(new Event('input', { bubbles: true }));

    this.formatting = false;
  }
}
