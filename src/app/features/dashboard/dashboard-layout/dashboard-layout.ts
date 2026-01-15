import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

type filterMode = 'todo' | 'Completo' | 'pendiente' | 'registro' | 'cliente';

@Component({
  selector: 'app-dashboard-layout',
  imports: [FormsModule],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.scss',
})
export class DashboardLayout {
  filtroActual: filterMode = 'todo';
  busqueda = '';

  setCambiarFiltro(nuevoFiltro: filterMode) {
    this.busqueda = '';
    this.filtroActual = nuevoFiltro;
  }

  onBuscar() {
    switch (this.filtroActual) {
      case 'todo':
        console.log('Buscando en todo:', this.busqueda);
        break;
      case 'Completo':
        console.log('Buscando en Completo:', this.busqueda);
        break;
      case 'pendiente':
        console.log('Buscando en pendiente:', this.busqueda);
        break;
      case 'registro':
        console.log('Buscando en registro:', this.busqueda);
        break;
      case 'cliente':
        console.log('Buscando en cliente:', this.busqueda);
        break;
    }
  }
  private buscarPorTodo() {
    console.log('Buscando en todo:', this.busqueda);

  }
  private buscarPorCompleto() {
    console.log('Buscando en Completo:', this.busqueda);

  }
  private buscarPorPendiente() {
    console.log('Buscando en pendiente:', this.busqueda);

  }
  private buscarPorRegistro() {
    console.log('Buscando en registro:', this.busqueda);

  }
  private buscarPorCliente() {
    console.log('Buscando en cliente:', this.busqueda);

  }


}
