import { Injectable } from "@angular/core";
import { UserEntity } from "../../domain/entitys/user.entity";
import { IMapper } from "../../domain/interfaces/IMapper";
import { UserResponseDto } from "../../infrastructure/dto/response/user/user-response.dto";

@Injectable({ providedIn: "root" })
export class UserMapper implements IMapper<UserResponseDto, UserEntity> {
  fromDto(dto: UserResponseDto): UserEntity {
    return dto as UserEntity;
  }
  toDto(entity: UserEntity): UserResponseDto {
    return entity as UserResponseDto
  }

}
