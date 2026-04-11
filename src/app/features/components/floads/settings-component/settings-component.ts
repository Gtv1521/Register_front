import {
  Component,
  inject,
  input,
  output,
  signal,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings-component',
  imports: [],
  standalone: true,
  templateUrl: './settings-component.html',
  styleUrl: './settings-component.scss',
})
export class SettingsComponent {
  private router = inject(Router);
  @ViewChild('panelContent') panelContent!: ElementRef;

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

  onOverlayClick(event: MouseEvent) {
    // Cerrar solo si el click fue fuera del panel-content
    const panelElement = (event.currentTarget as HTMLElement).querySelector('.panel-content');
    if (panelElement && !panelElement.contains(event.target as Node)) {
      this.cerrar();
    }
  }

  onUsers() {
    this.router.navigate(['users']);
  }

  onEditUser() {
    this.router.navigate([`user/${this.id()}`]);
  }

  onDataCompany() {
    console.log(this.company());
    this.router.navigate([`company/${this.company()}`]);
  }

  onCompanys() {
    this.router.navigate(['companys']);
  }
  onTheme() {
    this.router.navigate(['theme']);
  }
}
