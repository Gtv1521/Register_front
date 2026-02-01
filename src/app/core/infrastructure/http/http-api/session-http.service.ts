import { inject, Injectable } from '@angular/core';
import {
  ISession,
  ISessionInfo,
} from 'src/app/core/domain/interfaces/Isession';
import { LoginRequestDto } from '../../dto/request/login-request.dto';
import { SigInRequestDto } from '../../dto/request/sig-in-request.dto';
import {
  SessionEntity,
  SessionInfo,
} from 'src/app/core/domain/entitys/session.entity';
import { map, Observable } from 'rxjs';
import { environment } from '@environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SessionResponseDto } from '../../dto/response/session/session-response.dto';
import { SessionMapper } from 'src/app/core/aplication/mappers/session.mapper';

@Injectable({
  providedIn: 'root',
})
export class SessionHttpService
  implements
    ISession<LoginRequestDto, SigInRequestDto, SessionEntity>,
    ISessionInfo<SessionInfo>
{
  apiUrl = `${environment.apiUrl}/Session`;

  private http = inject(HttpClient);
  private mapper = inject(SessionMapper);

  Login(user: LoginRequestDto): Observable<SessionEntity> {
    return this.http
      .post<SessionResponseDto>(`${this.apiUrl}/login`, user, {
        withCredentials: true, // ESTO ES ESENCIAL
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      })
      .pipe(map((res) => this.mapper.fromDto(res)));
  }

  Logout(id: string): Observable<boolean> {
    return this.http.post<boolean>(`${this.apiUrl}/logout/${id}`, {});
  }

  SigIn(data: SigInRequestDto): Observable<SessionEntity> {
    return this.http
      .post<SessionResponseDto>(`${this.apiUrl}/signin`, data)
      .pipe(map((res) => this.mapper.fromDto(res)));
  }
  ResetPassword(mail: string): Observable<boolean> {
    throw new Error('Method not implemented.');
  }
  VerifyMail(mail: string): Observable<boolean> {
    throw new Error('Method not implemented.');
  }

  GetSessionsInfo(idUser: string): Observable<SessionInfo[]> {
    return this.http.get<SessionInfo[]>(
      `${this.apiUrl}/openSessions/${idUser}`,
    );
  }
}
