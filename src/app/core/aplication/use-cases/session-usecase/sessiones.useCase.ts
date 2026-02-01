import { Inject, inject, Injectable } from '@angular/core';
import { SESSIONES_TOKEN } from '../../tokens/session.token';
import { ISessionInfo } from 'src/app/core/domain/interfaces/Isession';
import { SessionInfo } from 'src/app/core/domain/entitys/session.entity';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SessionesUseCase {
  constructor(
    @Inject(SESSIONES_TOKEN)
    private sessionesService: ISessionInfo<SessionInfo>,
  ) {}

  execute(idUser: string): Observable<SessionInfo[]> {
    return this.sessionesService.GetSessionsInfo(idUser);
  }
}
