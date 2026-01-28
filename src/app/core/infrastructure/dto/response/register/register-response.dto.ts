import { ClientResponseDto } from "../client/client-response.dto";
import { ObservationResponseDto } from "../observation/observation-response.dto";


export interface RegisterResponseDto {
  clients: ClientResponseDto,
  observation: ObservationResponseDto,
  id: string,
  idClient: string,
  idUser: string,
  statusRegister: string,
  urlQr: string,
  idQr: string,
  createdAt: string
}
