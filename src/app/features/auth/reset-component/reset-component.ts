import { NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '@environment';

@Component({
  selector: 'app-reset-component',
  imports: [ReactiveFormsModule],
  templateUrl: './reset-component.html',
  styleUrl: './reset-component.scss',
})
export class ResetComponent {
  // estados
  estado: boolean = false;
  loading: boolean = false;
  // constructor
  private router = inject(Router);
  private fb = inject(FormBuilder);

  // inicializacion
  reset = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  // metodos
  goLogin() {
    this.router.navigate(['/login']);
  }

  onSubmit() {
    if (this.reset.valid) {
      this.loading = true;

      const mail = this.reset.value;

      console.log(mail.email);
    }
  }
}
