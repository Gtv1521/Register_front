import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// Validador que compara con otro control
export function confirmPasswordValidator(
  passwordControlName: string = 'password',
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.parent) return null;

    const password = control.parent.get(passwordControlName)?.value;
    const confirm = control.value;

    return password === confirm ? null : { passwordMismatch: true };
  };
}

// Validador para contraseña fuerte
export function strongPasswordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;

    const password = control.value;
    const hasMinLength = password.length >= 8;
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(
      password,
    );

    if (!hasMinLength || !hasSpecialChar) {
      return {
        strongPassword: {
          hasMinLength,
          hasSpecialChar,
        },
      };
    }

    return null;
  };
}

// se pone para que al menos tenga una mayuscula
export function regexValidator(regex: RegExp, errorName: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    // Si el campo está vacío, no validamos (deja que 'required' se encargue)
    if (!control.value) {
      return null;
    }
    const isValid = regex.test(control.value);
    // Si es válido, retornamos null. Si no, retornamos un objeto con el errorName como clave.
    return isValid ? null : { [errorName]: { value: control.value } };
  };
}
