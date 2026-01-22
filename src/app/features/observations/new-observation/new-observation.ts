import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ObservationCreateUseCase } from 'src/app/core/aplication/use-cases/observation-usecase/observation-create.useCase';
import { RegisterUseCase } from 'src/app/core/aplication/use-cases/register-usecase/register.useCase';
import { RegisterEntity } from 'src/app/core/domain/entitys/register.entity';
import { firstValueFrom } from 'rxjs';

import { AuthService } from 'src/app/core/infrastructure/http/interceptors/auth.service';
const statusMap: Record<string, number> = {
  PENDIENTE: 0,
  EN_PROCESO: 1,
  COMPLETADO: 2,
  CANCELADO: 3
};
@Component({
  selector: 'app-observation-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule
  ],
  templateUrl: './new-observation.html',
  styleUrl: './new-observation.scss',
})
export class NewObservation {

  //servicios
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private observationService = inject(ObservationCreateUseCase);
  private register = inject(RegisterUseCase)
  private auth = inject(AuthService)


  // datos
  photos: File[] = [];
  photoPreviews: string[] = [];
  registerId = this.route.snapshot.paramMap.get('registerId');
  registerData: RegisterEntity | any;
  userId = this.auth.getUserId()


  //datos del formulario
  form = this.fb.nonNullable.group({
    description: ['', [Validators.required, Validators.minLength(10)]],
    type: ['PENDIENTE', Validators.required],
    notificaEmail: [false],
    notificaWhatsapp: [false]
  });


  // funcion de guardado y pasado de datos
  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formData = new FormData();

    formData.append('IdRegister', this.registerId!);
    formData.append('IdUser', this.userId!); // 🔑
    formData.append('Type', statusMap[this.form.value.type!].toString());
    formData.append('Description', this.form.value.description!);
    formData.append('NotificaEmail', this.form.value.notificaEmail!.toString());
    formData.append('NotificaWhatsapp', this.form.value.notificaWhatsapp!.toString());

    this.photos.forEach((photo, index) => {
      formData.append('Photos', photo);
    });

    console.log('Observación a crear:', formData);

    this.observationService.execute(formData).subscribe({
      next: (response) => {
        console.log('Observación creada', response);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Error al crear observación', err);
      }
    });

  }
  onPhotosSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files) return;

    Array.from(input.files).forEach(file => {
      this.photos.push(file);

      const previewUrl = URL.createObjectURL(file);
      this.photoPreviews.push(previewUrl);
    });
  }
  removePhoto(index: number) {
    this.photos.splice(index, 1);
    this.photoPreviews.splice(index, 1);
  }


  cancelar(): void {
    this.router.navigate(['/dashboard']);
  }
  async ngOnInit() {
    this.registerData = await firstValueFrom(
      this.register.execute(this.registerId!)
    );
  }
}
