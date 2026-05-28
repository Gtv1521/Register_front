import { Injectable } from '@angular/core';
import { IClient } from 'src/app/core/domain/interfaces/ICrud';
import { ClientRequestDto } from '../../dto/request/client/client-request.dto';
import { ClientEntity } from 'src/app/core/domain/entitys/client.entity';
import { map, Observable } from 'rxjs';
import { environment } from '@environment';
import { HttpClient } from '@angular/common/http';
import { ClientMapper } from 'src/app/core/aplication/mappers/client.mapper';
import { ClientResponseDto } from '../../dto/response/client/client-response.dto';

@Injectable({
  providedIn: 'root',
})
export class ClientHttpService implements IClient<
  ClientRequestDto,
  ClientEntity
> {
  Url = `${environment.apiUrl}/Client`;
  constructor(
    private http: HttpClient,
    private mapper: ClientMapper,
  ) {}
  Filter(data: string): Observable<ClientEntity[]> {
    return this.http
      .get<ClientResponseDto[]>(`${this.Url}/filter/${data}`)
      .pipe(map((res) => res.map((c) => this.mapper.fromDto(c))));
  }
  Get(id: string): Observable<ClientEntity> {
    return this.http
      .get<ClientResponseDto>(`${this.Url}/${id}`)
      .pipe(map((res) => this.mapper.fromDto(res)));
  }
  Create(dto: ClientRequestDto): Observable<string> {
    return this.http.post<string>(`${this.Url}`, dto);
  }
  Update(id: string, dto: ClientRequestDto): Observable<boolean> {
    return this.http.put<boolean>(`${this.Url}/${id}`, dto);
  }
}
