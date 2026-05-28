import { Injectable } from "@angular/core";

@Injectable({providedIn: 'root'})
export class UpperCaseConstant {
  formatParagraphs(text: string): string {
    if (!text) return '';

    return text
      .split('\n') // Dividimos por saltos de línea
      .map((line) => {
        line = line.trim();
        if (line.length > 0) {
          // Primera letra Mayúscula + resto de la línea
          return line.charAt(0).toUpperCase() + line.slice(1);
        }
        return line;
      })
      .join('\n'); // Los volvemos a unir con el salto de línea
  }
}
