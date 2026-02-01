export interface ObservationEntity {
  id: string,
  idRegister: string,
  type: string,
  createdAt: Date,
  description: string,
  idUser: string,
  photos?: Imagen[] | null
}


export interface Imagen {
  photo: string | null,
  id: string | null
}
