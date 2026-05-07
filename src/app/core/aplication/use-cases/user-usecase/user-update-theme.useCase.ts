import { Inject, Injectable } from '@angular/core';
import { USER_TOKEN } from '../../tokens/user.token';
import { UserEntity } from 'src/app/core/domain/entitys/user.entity';
import { IUser } from 'src/app/core/domain/interfaces/ICrud';
import { Observable } from 'rxjs';
import { UserRequestDto } from 'src/app/core/infrastructure/dto/request/user/user-request.dto';

@Injectable({ providedIn: 'root' })
export class UserUpdateThemeUseCase {
  constructor(
    @Inject(USER_TOKEN) private repo: IUser<UserRequestDto, UserEntity>,
  ) {}

  execute(id: string, theme: string): Observable<boolean> {
    return this.repo.SaveSession(id, theme);
  }
}

