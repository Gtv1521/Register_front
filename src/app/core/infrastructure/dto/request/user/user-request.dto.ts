import { Rol } from "../sig-in-request.dto";

export interface UserRequestDto {
  id: string;
  name: string;
  email: string;
  password: string;
  idCompany: string;
  rol: Rol;
}
