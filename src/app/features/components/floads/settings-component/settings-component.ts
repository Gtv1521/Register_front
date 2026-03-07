import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  inject,
  input,
  Input,
  output,
  Output,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';

// import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-settings-component',
  imports: [],
  standalone: true,
  templateUrl: './settings-component.html',
  styleUrl: './settings-component.scss',
})
export class SettingsComponent {
  private router = inject(Router);

  role = input<string>();
  id = input<string>();
  company = input<string>();
  Closed = output<void>();

  // Estado interno con Signal
  animado = signal(false);

  ngOnInit() {
    setTimeout(() => this.animado.set(true), 10);
  }

  cerrar() {
    this.animado.set(false);
    setTimeout(() => this.Closed.emit(), 300);
  }

  onUsers() {
    this.router.navigate(['users']);
  }

  onEditUser() {
    this.router.navigate([`user/${this.id()}`]);
  }

  onDataCompany() {
    console.log(this.company())
    this.router.navigate([`company/${this.company()}`]);
  }

  onCompanys() {
    this.router.navigate(['companys']);
  }
}
