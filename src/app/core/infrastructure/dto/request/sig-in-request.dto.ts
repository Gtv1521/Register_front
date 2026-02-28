export interface SigInRequestDto {
  name: string;
  email: string;
  password: string;
  idCompany: string;
  rol: Rol;
}

export enum Rol {
  Usuario = 'Usuario',
  Cliente = 'Cliente',
  Administrador = 'Administrador',
  User = 'Super',
}
