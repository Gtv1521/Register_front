import { ClientEntity } from "./entitys/client.entity";
import { ObservationEntity } from "./entitys/observation.entity";
import { RegisterEntity } from "./entitys/register.entity";

export interface RegisterObservationEntity {
  registro: RegisterEntity,
  observaciones: ObservationEntity,
  cliente: ClientEntity
}
