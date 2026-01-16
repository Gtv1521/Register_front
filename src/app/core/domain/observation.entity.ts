export interface ObservationEntity {
    id: string,
    idRegister: string,
    description: string,
    idUser: string,
    photos: Imangen[]
}


export interface Imangen {
    url: string,
    id: string
}