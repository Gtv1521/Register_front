// entidad de usuario
export interface UserEntity {
    id: string,
    name: string | null,
    email: string | null,
    password: string | null,
    rol: string,
    idCompany: string,
}
