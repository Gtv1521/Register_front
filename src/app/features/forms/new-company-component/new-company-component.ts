import { validateHorizontalPosition } from '@angular/cdk/overlay';
import { Component, inject, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  Validators,
  ReactiveFormsModule,
  FormGroupDirective,
} from '@angular/forms';
import { CompanyRequestDto } from 'src/app/core/infrastructure/dto/request/company/company-request.dto';

@Component({
  selector: 'app-new-company-component',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './new-company-component.html',
  styleUrl: './new-company-component.scss',
})
export class NewCompanyComponent {
  private fb = inject(FormBuilder);

  @ViewChild('formDirective') formDirective!: FormGroupDirective;

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    nit: ['', [Validators.required]],
    address: ['', [Validators.required]],
    phone: ['', [Validators.required, Validators.minLength(10)]],
    email: ['', [Validators.required, Validators.email]],
    image: [null as File | null, [Validators.required]],
  });

  public async onValidate(): Promise<boolean> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return false;
    }
    return true;
  }

  onFileChange(event: any) {
    const file = event.target.files[0]; // Capturamos el primer archivo

    if (file) {
      // 1. Insertamos el archivo real en el formulario
      this.form.patchValue({
        image: file,
      });
      this.form.get('image')?.updateValueAndValidity();
    }
  }

  onDesabled() {
    this.form.get('name')?.disable();
    this.form.get('nit')?.disable();
    this.form.get('address')?.disable();
    this.form.get('phone')?.disable();
    this.form.get('email')?.disable();
    this.form.get('image')?.disable();
  }

  public async onData(): Promise<FormData> {
    const formData = new FormData();
    formData.append('Name', this.form.get('name')?.value!);
    formData.append('NIT', this.form.get('nit')?.value!);
    formData.append('Address', this.form.get('address')?.value!);
    formData.append('Phone', this.form.get('phone')?.value!);
    formData.append('Email', this.form.get('email')?.value!);
    formData.append('Image', this.form.get('image')?.value!);
    return formData;
  }
}
