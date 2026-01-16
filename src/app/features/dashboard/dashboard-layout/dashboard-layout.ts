import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardComponent } from "../../components/card-component/card-component";
import { RegisterObservationEntity } from '../../../core/domain/registerObservation.entity';
import { MatIconModule } from '@angular/material/icon';



type filterMode = 'todo' | 'Completo' | 'pendiente' | 'registro' | 'cliente';

@Component({
  selector: 'app-dashboard-layout',
  imports: [FormsModule, CardComponent, MatIconModule],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.scss',
})
export class DashboardLayout {
  filtroActual: filterMode = 'todo';
  busqueda = '';
  registrosFiltrados: RegisterObservationEntity[] = [];
  registros: RegisterObservationEntity[] = [];

  setCambiarFiltro(nuevoFiltro: filterMode) {
    this.busqueda = '';
    this.filtroActual = nuevoFiltro;
  }

  onBuscar() {
    switch (this.filtroActual) {
      case 'todo':
        this.buscarPorTodo();
        break;
      case 'Completo':
        this.buscarPorCompleto();
        break;
      case 'pendiente':
        this.buscarPorPendiente();
        break;
      case 'registro':
        this.buscarPorRegistro();
        break;
      case 'cliente':
        this.buscarPorCliente();
        break;
    }
  }
  verDetalle(id: string) {
    console.log('Ver detalle del registro con ID:', id);
  }
  crearObservacion(id: number) {
    console.log('Crear observacion para el registro con ID:', id);
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

  ngOnInit() {
    // Aquí puedes cargar los registros iniciales desde un servicio o API
    this.registros = [
      {
        registro: { id: '1', idClient: '101', urlQr: 'http://example.com/qr1', status: 'Completo' },
        observaciones: { id: "201", idRegister: "1", description: "Observación 1", idUser: "301", photos: [{ id: '1234', url: "https://res.cloudinary.com/djtxchura/image/upload/v1767118470/observation/1371343.jpg" }] },
        cliente: { id: '101', name: 'Cliente A', email: '<EMAIL>', phone: 123456789 }
      },
      {
        registro: { id: '2', idClient: '102', urlQr: 'http://example.com/qr2', status: 'pendiente' },
        observaciones: { id: '202', idRegister: '2', description: 'Observación 2', idUser: "302", photos: [] },
        cliente: { id: '102', name: 'Cliente B', email: '<EMAIL>', phone: 987654321 }
      },
      {
        registro: { id: '3', idClient: '103', urlQr: 'http://example.com/qr3', status: 'Completo' },
        observaciones: { id: '203', idRegister: '3', description: 'Observación 3', idUser: "303", photos: [{ id: '1234', url: "https://res.cloudinary.com/djtxchura/image/upload/v1767118470/observation/1371343.jpg" }] },
        cliente: { id: '103', name: 'Cliente C', email: '<EMAIL>', phone: 555555555 }
      },
      {
        registro: { id: '4', idClient: '104', urlQr: 'http://example.com/qr4', status: 'pendiente' },
        observaciones: { id: '204', idRegister: '4', description: 'Observación 4', idUser: "304", photos: [] },
        cliente: { id: '104', name: 'Cliente D', email: '<EMAIL>', phone: 111111111 }
      }
    ];
    this.registrosFiltrados = this.registros;
  }
}
