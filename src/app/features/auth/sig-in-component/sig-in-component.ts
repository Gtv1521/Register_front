import { Component, inject } from '@angular/core';
import { Router, RouteReuseStrategy } from '@angular/router';

@Component({
  selector: 'app-sig-in-component',
  imports: [],
  templateUrl: './sig-in-component.html',
  styleUrl: './sig-in-component.scss',
})
export class SigInComponent {

  // estados
  estado: boolean = false;

  // constructor
  private router = inject(Router);

  // metodos
  togglePassword() {
    this.estado = !this.estado;
  }

  goLogin() {
    this.router.navigate(['/login']);
  }
}
