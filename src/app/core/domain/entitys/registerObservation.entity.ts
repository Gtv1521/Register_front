import { ClientEntity } from "./client.entity";
import { ObservationEntity } from "./observation.entity";
import { RegisterEntity } from "./register.entity";

export interface RegisterObservationEntity extends RegisterEntity {

  observaciones: ObservationEntity,
  cliente: ClientEntity
}
