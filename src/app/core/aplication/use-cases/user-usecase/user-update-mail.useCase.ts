import { Inject, Injectable } from '@angular/core';
import { UP_USER_TOKEN } from '../../tokens/update-user.token';
import { IUpdateUser } from 'src/app/core/domain/interfaces/ICrud';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserUpdateMailUseCase {
  constructor(@Inject(UP_USER_TOKEN) private repo: IUpdateUser) {}

  execute(id: string, mail: string): Observable<boolean> {
    return this.repo.UpdateMail(id, mail);
  }
}
