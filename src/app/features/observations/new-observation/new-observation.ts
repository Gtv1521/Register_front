import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

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

  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  // private observationService = inject(ObservationService); // cuando lo conectes

  registerId = this.route.snapshot.paramMap.get('registerId');

  form = this.fb.nonNullable.group({
    description: ['', [Validators.required, Validators.minLength(10)]],
    status: ['PENDIENTE', Validators.required]
  });

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = {
      registerId: this.registerId,
      ...this.form.getRawValue()
    };

    console.log('Observación a crear:', payload);

    /*
    this.observationService.create(payload).subscribe(() => {
      this.router.navigate(['/dashboard']);
    });
    */
  }

  cancelar(): void {
    this.router.navigate(['/dashboard']);
  }
}
