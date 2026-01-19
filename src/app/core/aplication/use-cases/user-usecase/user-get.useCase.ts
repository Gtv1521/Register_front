import { Inject, Injectable } from "@angular/core";
import { USER_TOKEN } from "../../tokens/user.token";
import { IUser } from "src/app/core/domain/interfaces/ICrud";
import { UserResponseDto } from "src/app/core/infrastructure/dto/response/user/user-response.dto";
import { UserEntity } from "src/app/core/domain/entitys/user.entity";
import { UserRequestDto } from "src/app/core/infrastructure/dto/request/user/user-request.dto";
import { Observable } from "rxjs";

@Injectable({ providedIn: "root" })
export class UserGetUseCase {
  constructor(
    @Inject(USER_TOKEN) private repo: IUser<UserRequestDto, UserEntity>
  ) { }
  execute(id: string): Observable<UserEntity> { return this.repo.Get(id) }
}
