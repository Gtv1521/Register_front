export interface ObservationRequestDto {
  IdRegister: string,
  Type: number,
  Description: string,
  IdUser: string,
  NotificaEmail: boolean,
  NotificaWhatsapp: boolean,
  Photos: File[]
}
