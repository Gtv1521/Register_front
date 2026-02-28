import { ClientEntity } from './client.entity';
import { ObservationEntity } from './observation.entity';

export interface RegisterEntity {
  clients: ClientEntity | null;
  observation: ObservationEntity | null;
  id: string;
  idClient: string;
  idUser: string;
  urlQr: string;
  registroNumber: string;
  statusRegister: EstadoRegistro;
  idQr: string;
  createdAt: string;
}

export enum EstadoRegistro {
  Pendiente = "Pendiente",
  EnProgreso = "EnProgreso",
  Completado = "Completado",
  Cancelado = "Cancelado",
}
