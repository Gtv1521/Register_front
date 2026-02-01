import { EstadoRegistro } from "src/app/core/domain/entitys/register.entity";

export interface RegisterRequestDto {
  id: string,
  idClient: string,
  idUser: string,
  statusRegister?: EstadoRegistro,
  url: string, // para en qr del registro
}
