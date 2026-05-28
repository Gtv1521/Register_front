import { InjectionToken } from "@angular/core";
import { IUser } from "../../domain/interfaces/ICrud";
import { UserRequestDto } from "../../infrastructure/dto/request/user/user-request.dto";
import { UserEntity } from "../../domain/entitys/user.entity";

export const USER_TOKEN = new InjectionToken<IUser<UserRequestDto, UserEntity>>('USER_TOKEN');
