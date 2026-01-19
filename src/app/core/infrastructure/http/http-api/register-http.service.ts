import { Injectable } from '@angular/core';
import { IFiter } from 'src/app/core/domain/interfaces/ICrud';
import { SessionResponseDto } from '../../dto/response/session-response.dto';
import { SessionEntity } from 'src/app/core/domain/entitys/session.entity';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environment';
import { RegisterRequestDto } from '../../dto/request/register/register-request.dto';
import { RegisterEntity } from 'src/app/core/domain/entitys/register.entity';
import { RegisterResponseDto } from '../../dto/response/register/register-response.dto';
import { RegisterMapper } from 'src/app/core/aplication/mappers/register.mapper';

@Injectable({
  providedIn: 'root',
})
export class RegisterHttpService implements IFiter<RegisterRequestDto, RegisterEntity> {
  Url = `${environment.apiUrl}/Register`;

  constructor(
    private http: HttpClient,
    private mapper: RegisterMapper
  ) {

  }
  GetAll(): Observable<RegisterEntity[]> {
    return this.http.get<RegisterResponseDto[]>(`${this.Url}`)
      .pipe(map(res => res.map(c => this.mapper.fromDto(c))));
  }
  Filter(data: string): Observable<RegisterEntity[]> {
    return this.http.get<RegisterResponseDto[]>(`${this.Url}/Filter`)
      .pipe(map(res => res.map(c => this.mapper.fromDto(c))));
  }
  Get(id: string): Observable<RegisterEntity> {
    return this.http.get<RegisterResponseDto>(`${this.Url}/${id}`).pipe(map(res => this.mapper.fromDto(res)));
  }
  Create(dto: RegisterRequestDto): Observable<string> {
    return this.http.post<string>(`${this.Url}`, dto);
  }
  Update(dto: RegisterRequestDto): Observable<boolean> {
    return this.http.put<boolean>(`${this.Url}/${dto.id}`, dto);
  }

}
