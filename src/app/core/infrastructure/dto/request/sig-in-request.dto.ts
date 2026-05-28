import { NavDataEntity } from "src/app/core/domain/entitys/nav-data.entity";
import { DataNavService } from "../../services/data_navegador/data-nav.service";

export interface SigInRequestDto {
  name: string;
  email: string;
  password: string;
  idCompany: string;
  rol: Rol;
  data: NavDataEntity
}

export enum Rol {
  Usuario = 'Usuario',
  Cliente = 'Cliente',
  Administrador = 'Administrador',
  Super = 'Super',
}
