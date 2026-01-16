import { Inject, Injectable } from '@angular/core';
import { SESSION_TOKEN } from '../../tokens/session.token';
import { ISession } from 'src/app/core/domain/interfaces/Isession';
import { LoginRequestDto } from 'src/app/core/infrastructure/dto/request/login-request.dto';
import { SigInRequestDto } from 'src/app/core/infrastructure/dto/request/sig-in-request.dto';
import { SessionEntity } from 'src/app/core/domain/entitys/session.entity';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root'})
export class LoginUseCase {
  constructor(
    @Inject(SESSION_TOKEN)
    private repo: ISession<LoginRequestDto, SigInRequestDto, SessionEntity>
  ) {}

  execate(data: LoginRequestDto): Observable<SessionEntity> {
    return this.repo.Login(data);
  }
}
