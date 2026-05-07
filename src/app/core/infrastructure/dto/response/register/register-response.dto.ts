import { EstadoRegistro } from "src/app/core/domain/entitys/register.entity";
import { ClientResponseDto } from "../client/client-response.dto";
import { ObservationResponseDto } from "../observation/observation-response.dto";


export interface RegisterResponseDto {
  clients: ClientResponseDto,
  observation: ObservationResponseDto,
  id: string,
  idClient: string,
  idCompany: string,
  idUser: string,
  tecnico: string,
  registroNumber: string,
  statusRegister: EstadoRegistro,
  urlQr: string,
  idQr: string,
  antisipo: number,
  totalPagar: number,
  createdAt: string
}
