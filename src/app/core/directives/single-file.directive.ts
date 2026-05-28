import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: 'input[type="file"][appSingleFile]',
})
export class SingleFileDirective {
  constructor(private el: ElementRef<HTMLInputElement>) {}

  @HostListener('change', ['$event'])
  onChange(event: Event) {
    const input = this.el.nativeElement;
    const files = input.files;

    if (files && files.length > 1) {
      alert('Atención: Solo se permite un archivo.');
      input.value = ''; // Resetea el input

      // Opcional: Despachar un evento de error si usas formularios
      event.stopImmediatePropagation();
    }
  }
}
