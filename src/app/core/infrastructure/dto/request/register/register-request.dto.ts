import { NavDataEntity } from "src/app/core/domain/entitys/nav-data.entity";
import { EstadoRegistro } from "src/app/core/domain/entitys/register.entity";

export interface RegisterRequestDto extends NavDataEntity {
  id: string,
  idClient: string,
  idUser: string,
  idCompany: string,
  registroNumber: string,
  statusRegister?: EstadoRegistro,
  urlRuta: string, // para en qr del registro
  antisipo: number,
  totalPagar: number
}
