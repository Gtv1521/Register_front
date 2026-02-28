import { EstadoRegistro } from "src/app/core/domain/entitys/register.entity";

export interface RegisterRequestDto {
  id: string,
  idClient: string,
  idUser: string,
  idCompany: string,
  registroNumber: string,
  statusRegister?: EstadoRegistro,
  urlRuta: string, // para en qr del registro
}
