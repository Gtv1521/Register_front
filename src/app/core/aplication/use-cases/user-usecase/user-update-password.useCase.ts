import { Inject, Injectable } from '@angular/core';
import { UP_USER_TOKEN } from '../../tokens/update-user.token';
import { IUpdateUser } from 'src/app/core/domain/interfaces/ICrud';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserUpdatePasswordUseCase {
  constructor(@Inject(UP_USER_TOKEN) private repo: IUpdateUser) {}

  execute(id: string, password: string): Observable<boolean> {
    return this.repo.UpdatePassword(id, password);
  }
}
