import { Inject, Injectable } from '@angular/core';
import { SESSION_TOKEN } from '../../tokens/session.token';
import { Observable } from 'rxjs';
import { ISession } from 'src/app/core/domain/interfaces/Isession';
import { SessionEntity } from 'src/app/core/domain/entitys/session.entity';
import { LoginRequestDto } from 'src/app/core/infrastructure/dto/request/login-request.dto';
import { SigInRequestDto } from 'src/app/core/infrastructure/dto/request/sig-in-request.dto';

@Injectable({
  providedIn: 'root',
})
export class LogoutUseCase {
  constructor(
    @Inject(SESSION_TOKEN)
    private repo: ISession<LoginRequestDto, SigInRequestDto, SessionEntity>,
  ) {}

  execute(id: string): Observable<boolean> {
    return this.repo.Logout(id);
  }
}
