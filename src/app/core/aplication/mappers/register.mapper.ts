import { Injectable } from "@angular/core";
import { RegisterEntity } from "../../domain/entitys/register.entity";
import { IMapper } from "../../domain/interfaces/IMapper";
import { RegisterResponseDto } from "../../infrastructure/dto/response/register/register-response.dto";
@Injectable({ providedIn: "root" })
export class RegisterMapper implements IMapper<RegisterResponseDto, RegisterEntity> {
  fromDto(dto: RegisterResponseDto): RegisterEntity {
    return dto as RegisterEntity
  }
  toDto(entity: RegisterEntity): RegisterResponseDto {
    return entity as RegisterResponseDto
  }
}
