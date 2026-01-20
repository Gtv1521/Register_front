import { ClientEntity } from "./client.entity"
import { ObservationEntity } from "./observation.entity"

export interface RegisterEntity {
  clients: ClientEntity | null,
  observation: ObservationEntity | null,
  id: string,
  idClient: string,
  urlQr: string,
  statusRegister: string,
  idQr: string,
  createdAt: string
}
