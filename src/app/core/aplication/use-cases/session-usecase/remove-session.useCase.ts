import { Inject, Injectable } from '@angular/core';
import { SESSION_TOKEN } from '../../tokens/session.token';
import { Observable } from 'rxjs';
import { SessionEntity } from 'src/app/core/domain/entitys/session.entity';
import { ISession } from 'src/app/core/domain/interfaces/Isession';
import { LoginRequestDto } from 'src/app/core/infrastructure/dto/request/login-request.dto';
import { SigInRequestDto } from 'src/app/core/infrastructure/dto/request/sig-in-request.dto';

@Injectable({ providedIn: 'root' })
export class RemoveSessionUseCase {
  constructor(
    @Inject(SESSION_TOKEN)
    private repo: ISession<LoginRequestDto, SigInRequestDto, SessionEntity>,
  ) {}
  execute(idUser: string, sessionId: string): Observable<boolean> {
    return this.repo.DeleteSession(idUser, sessionId);
  }
}
