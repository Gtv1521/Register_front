import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SessionEntity } from 'src/app/core/domain/entitys/session.entity';
import { SigInRequestDto } from 'src/app/core/infrastructure/dto/request/sig-in-request.dto';
import { SESSION_TOKEN } from '../../tokens/session.token';
import { ISession } from 'src/app/core/domain/interfaces/Isession';
import { LoginRequestDto } from 'src/app/core/infrastructure/dto/request/login-request.dto';

@Injectable({ providedIn: 'root' })
export class SigInUseCase {
  constructor(
    @Inject(SESSION_TOKEN)
    private repo: ISession<LoginRequestDto, SigInRequestDto, SessionEntity>,
  ) {}

  execute(dto: SigInRequestDto): Observable<SessionEntity> {
    return this.repo.SigIn(dto);
  }
}
