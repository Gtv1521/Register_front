import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UP_USER_TOKEN } from '../../tokens/update-user.token';
import { IUpdateUser } from 'src/app/core/domain/interfaces/ICrud';

@Injectable({ providedIn: 'root' })
export class UserUpdateNameUseCase {
  constructor(@Inject(UP_USER_TOKEN) private repo: IUpdateUser) {}

  execute(id: string, name: string): Observable<boolean> {
    return this.repo.UpdateName(id, name);
  }
}
