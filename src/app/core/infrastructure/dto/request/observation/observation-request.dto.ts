export interface ObservationRequestDto {
  id: string,
  IdRegister: string,
  Type: number,
  Description: string,
  IdUser: string,
  NotificaEmail: boolean,
  NotificaWhatsapp: boolean,
  Photos: File[]
}
