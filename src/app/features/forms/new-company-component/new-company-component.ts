import { validateHorizontalPosition } from '@angular/cdk/overlay';
import {
  Component,
  effect,
  inject,
  input,
  output,
  signal,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  Validators,
  ReactiveFormsModule,
  FormGroupDirective,
  FormControl,
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

  onEditar = input<boolean>();
  onEditLogo = output<boolean>();

  logo = signal<string>('');
  changeLogo = signal<boolean>(false);

  @ViewChild('formDirective') formDirective!: FormGroupDirective;

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    nit: ['', [Validators.required]],
    address: ['', [Validators.required]],
    phone: ['', [Validators.required, Validators.minLength(10)]],
    email: ['', [Validators.required, Validators.email]],
    image: [null as File | null, [Validators.required]],
  });

  img = new FormControl(null as File | null);

  Efecto = effect(() => {
    this.onEditLogo.emit(this.changeLogo());
    if (!this.changeLogo()) {
      this.img.disable();
    }
  });

  async onValidate(): Promise<boolean> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return false;
    }
    return true;
  }

  toggleLogoChange($event: any) {
    const isChecked = $event.target.checked;
    this.changeLogo.set(isChecked);
    if (isChecked) {
      this.img.enable();
    }
  }

  showLogo(data: string) {
    this.logo.set(data);
    this.img.disable();
  }

  onFileChange(event: any) {
    const file = event.target.files[0];

    if (file && !this.changeLogo()) {
      this.form.patchValue({
        image: file,
      });
      this.form.get('image')?.updateValueAndValidity();
    } else if (this.changeLogo()) this.img.patchValue(file);
  }

  onLlenaData(datos: any) {
    return this.form.patchValue(datos);
  }

  obtenerDatos() {
    return this.form.getRawValue();
  }

  obtieneImagen() {
    return this.img?.value;
  }

  resetear() {
    this.form.reset();
  }

  onDesabled() {
    this.form.get('name')?.disable();
    this.form.get('nit')?.disable();
    this.form.get('address')?.disable();
    this.form.get('phone')?.disable();
    this.form.get('email')?.disable();
    this.form.get('image')?.disable();
  }

  async onData(): Promise<FormData> {
    const formData = new FormData();
    formData.append('Name', this.form.get('name')?.value!);
    formData.append('NIT', this.form.get('nit')?.value!);
    formData.append('Address', this.form.get('address')?.value!);
    formData.append('Phone', this.form.get('phone')?.value!);
    formData.append('Email', this.form.get('email')?.value!);
    formData.append(
      'Image',
      this.onEditar() && this.changeLogo()
        ? this.img.getRawValue()!
        : this.form.get('image')?.getRawValue()!,
    );
    return formData;
  }
}
