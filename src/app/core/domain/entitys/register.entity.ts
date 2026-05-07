import { ClientEntity } from './client.entity';
import { ObservationEntity } from './observation.entity';

export interface RegisterEntity {
  clients: ClientEntity | null;
  observation: ObservationEntity | null;
  id: string;
  idClient: string;
  idCompany: string;
  idUser: string;
  tecnico: string;
  urlQr: string;
  registroNumber: string;
  statusRegister: EstadoRegistro;
  idQr: string;
  antisipo: number,
  totalPagar: number,
  createdAt: string;
}

export enum EstadoRegistro {
  Pendiente = 'Pendiente',
  EnProgreso = 'EnProgreso',
  Completado = 'Completado',
  Entregado = 'Entregado',
  Cancelado = 'Cancelado',
}
