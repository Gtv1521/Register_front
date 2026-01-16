import { Component } from '@angular/core';

@Component({
  selector: 'app-login-component',
  imports: [],
  templateUrl: './login-component.html',
  styleUrl: './login-component.scss',
})
export class LoginComponent {
  estado: boolean = false;

  togglePassword() {
    this.estado = !this.estado;
  }
}
