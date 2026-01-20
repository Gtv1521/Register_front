export interface ObservationResponseDto {
  id: string,
  idRegister: string,
  description: string,
  idUser: string,
  photos: Imagen[]
}


export interface Imagen {
  photo: string,
  id: string
}
