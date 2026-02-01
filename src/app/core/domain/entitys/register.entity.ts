import { ClientEntity } from './client.entity';
import { ObservationEntity } from './observation.entity';

export interface RegisterEntity {
  clients: ClientEntity | null;
  observation: ObservationEntity | null;
  id: string;
  idClient: string;
  idUser: string;
  urlQr: string;
  statusRegister: EstadoRegistro;
  idQr: string;
  createdAt: string;
}

export enum EstadoRegistro {
  Pending = 0,
  InProgress = 1,
  Completed = 2,
  Cancelled = 3,
}
