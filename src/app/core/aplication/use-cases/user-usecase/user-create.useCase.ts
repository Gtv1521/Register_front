import { Inject, Injectable } from '@angular/core';
import { UserEntity } from 'src/app/core/domain/entitys/user.entity';
import { IUser } from 'src/app/core/domain/interfaces/ICrud';
import { UserRequestDto } from 'src/app/core/infrastructure/dto/request/user/user-request.dto';
import { USER_TOKEN } from '../../tokens/user.token';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserCreateUseCase {
  constructor(
    @Inject(USER_TOKEN) private repo: IUser<UserRequestDto, UserEntity>,
  ) {}

  execute(dto: UserRequestDto): Observable<string> {
    return this.repo.Create(dto);
  }
}
