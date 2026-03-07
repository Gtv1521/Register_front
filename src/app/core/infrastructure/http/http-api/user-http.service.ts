import { Injectable } from "@angular/core";
import { IUser } from "src/app/core/domain/interfaces/ICrud";
import { UserRequestDto } from "../../dto/request/user/user-request.dto";
import { UserEntity } from "src/app/core/domain/entitys/user.entity";
import { environment } from "@environment";
import { HttpClient } from "@angular/common/http";
import { UserMapper } from "src/app/core/aplication/mappers/user.mapper";
import { map, Observable } from "rxjs";
import { UserResponseDto } from "../../dto/response/user/user-response.dto";

@Injectable({ providedIn: "root" })
export class UserHttpService implements IUser<UserRequestDto, UserEntity> {
  Url = `${environment.apiUrl}/User`;
  constructor(
    private http: HttpClient,
    private map: UserMapper,

  ) { }
  Get(): Observable<UserEntity> {
    return this.http.get<UserResponseDto>(`${this.Url}/me`).pipe(map(res => this.map.fromDto(res)));
  }
  GetAll(): Observable<UserEntity[]> {
    return this.http.get<UserResponseDto[]>(`${this.Url}`)
      .pipe(map(res => res.map(c => this.map.fromDto(c))))
  }
  Update(dto: UserRequestDto): Observable<boolean> {
    return this.http.put<boolean>(`${this.Url}/${dto.id}`, dto);
  }
}
