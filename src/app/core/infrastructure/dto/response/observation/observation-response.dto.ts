export interface ObservationResponseDto {
  id: string,
  idRegister: string,
  type: string,
  createdAt: Date,
  description: string,
  idUser: string,
  photos: Imagen[]
}


export interface Imagen {
  photo: string,
  id: string
}
