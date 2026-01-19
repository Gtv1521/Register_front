import { Inject, Injectable } from "@angular/core";
import { USER_TOKEN } from "../../tokens/user.token";
import { UserEntity } from "src/app/core/domain/entitys/user.entity";
import { IUser } from "src/app/core/domain/interfaces/ICrud";
import { UserRequestDto } from "src/app/core/infrastructure/dto/request/user/user-request.dto";
import { Observable } from "rxjs";

@Injectable({ providedIn: "root" })
export class UserGetAllUseCase {
  constructor(
    @Inject(USER_TOKEN) private repo: IUser<UserRequestDto, UserEntity>
  ) { }
  execute(): Observable<UserEntity[]> { return this.repo.GetAll() }
}
