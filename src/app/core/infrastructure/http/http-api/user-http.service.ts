import { Injectable } from '@angular/core';
import { IUser } from 'src/app/core/domain/interfaces/ICrud';
import { UserRequestDto } from '../../dto/request/user/user-request.dto';
import { UserEntity } from 'src/app/core/domain/entitys/user.entity';
import { environment } from '@environment';
import { HttpClient } from '@angular/common/http';
import { UserMapper } from 'src/app/core/aplication/mappers/user.mapper';
import { map, Observable } from 'rxjs';
import { UserResponseDto } from '../../dto/response/user/user-response.dto';
import { Rol } from '../../dto/request/sig-in-request.dto';

@Injectable({ providedIn: 'root' })
export class UserHttpService implements IUser<UserRequestDto, UserEntity> {
  Url = `${environment.apiUrl}/User`;
  constructor(
    private http: HttpClient,
    private map: UserMapper,
  ) {}

  GetId(id: string): Observable<UserEntity> {
    return this.http
      .get<UserResponseDto>(`${this.Url}/${id}`)
      .pipe(map((res) => this.map.fromDto(res)));
  }

  Delete(id: string): Observable<boolean> {
    return this.http.delete<boolean>(`${this.Url}/${id}`);
  }

  Create(dto: UserRequestDto): Observable<string> {
    const insert = {
      Name: dto.name,
      Email: dto.email,
      Password: dto.password,
      IdCompany: dto.idCompany,
      Rol: dto.rol,
    };
    return this.http.post<string>(`${this.Url}`, insert);
  }

  SaveSession(id: string, theme: string): Observable<boolean> {
    return this.http.post<boolean>(`${this.Url}/saveTheme`, {
      idUser: id,
      theme,
    });
  }

  Get(): Observable<UserEntity> {
    return this.http
      .get<UserResponseDto>(`${this.Url}/me`)
      .pipe(map((res) => this.map.fromDto(res)));
  }

  GetAll(id: string): Observable<UserEntity[]> {
    return this.http
      .get<
        UserResponseDto[]
      >(`${this.Url}`, { params: { idCompany: id, pageNumber: 1, pageSize: 20 } })
      .pipe(map((res) => res.map((c) => this.map.fromDto(c))));
  }

  Update(dto: UserRequestDto): Observable<boolean> {
    return this.http.put<boolean>(`${this.Url}/${dto.id}`, dto);
  }

  UpdateRol(id: string, rol: string): Observable<boolean> {
    return this.http
      .put<{
        update: boolean;
      }>(`${this.Url}/Rol/${id}`, {}, { params: { rol } })
      .pipe(map((res) => res.update));
  }
}
