import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'Phone',
})
export class PhonePipe implements PipeTransform {
  transform(
    value: string,
    showCountryCode: boolean = true,
    hideFirstDigits: boolean = false,
  ) {
    if (!value) return '';
    const cleanNumber = value.replace(/\D/g, '');
    if (cleanNumber.length < 10) return value;

    // Extraer partes según formato colombiano
    let countryCode = '';
    let operatorCode = '';
    let firstPart = '';
    let secondPart = '';

    if (cleanNumber.length === 10) {
      // Formato: 3XX XXX XXXX (sin código de país)
      operatorCode = cleanNumber.substring(0, 3);
      firstPart = cleanNumber.substring(3, 6);
      secondPart = cleanNumber.substring(6);
    } else if (cleanNumber.length === 12 && cleanNumber.startsWith('57')) {
      // Formato: +57 3XX XXX XXXX
      countryCode = cleanNumber.substring(0, 2);
      operatorCode = cleanNumber.substring(2, 5);
      firstPart = cleanNumber.substring(5, 8);
      secondPart = cleanNumber.substring(8);
    } else if (cleanNumber.length === 13 && cleanNumber.startsWith('57')) {
      // Formato: +57 3XX XXX XXXX (con celular)
      countryCode = cleanNumber.substring(0, 2);
      operatorCode = cleanNumber.substring(2, 5);
      firstPart = cleanNumber.substring(5, 8);
      secondPart = cleanNumber.substring(8);
    }

    let formatted = '';

    if (hideFirstDigits && operatorCode) {
      formatted = `*** ${firstPart} ${secondPart}`;
    } else {
      formatted = `${operatorCode} ${firstPart} ${secondPart}`;
    }

    // Agregar código de país si se solicita
    if (showCountryCode && countryCode) {
      return `+${countryCode} ${formatted}`;
    }

    return formatted;
  }
}
