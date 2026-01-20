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
