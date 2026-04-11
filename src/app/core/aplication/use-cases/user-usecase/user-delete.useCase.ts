import { Inject, Injectable } from '@angular/core';
import { USER_TOKEN } from '../../tokens/user.token';
import { IUser } from 'src/app/core/domain/interfaces/ICrud';
import { UserRequestDto } from 'src/app/core/infrastructure/dto/request/user/user-request.dto';
import { UserEntity } from 'src/app/core/domain/entitys/user.entity';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserDeleteUseCase {
  constructor(
    @Inject(USER_TOKEN) private repo: IUser<UserRequestDto, UserEntity>,
  ) {}

  execute(id: string): Observable<boolean> {
    return this.repo.Delete(id);
  }
}
