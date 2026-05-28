import { types } from "src/app/core/domain/entitys/observation.entity";

export interface ObservationRequestDto {
  id: string,
  IdRegister: string,
  Type: types,
  Description: string,
  IdUser: string,
  NotificaEmail: boolean,
  NotificaWhatsapp: boolean,
  Photos: File[]
}
