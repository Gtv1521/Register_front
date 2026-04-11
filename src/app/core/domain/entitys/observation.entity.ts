export interface ObservationEntity {
  id: string;
  idRegister: string;
  type: string;
  createdAt: Date;
  description: string;
  idUser: string;
  photos?: Imagen[] | null;
}

export interface Imagen {
  photo: string | null;
  id: string | null;
}

export enum types {
  Cancelado = 'Cancelado',
  Informacion = 'Informacion',
  Pendiente = 'Pendiente',
  Solucion = 'Solucion',
  Entregado = 'Entregado',
}
