import { Injectable } from '@angular/core';
import { ICrud } from 'src/app/core/domain/interfaces/ICrud';
import { AdvertenciaRequestDto } from '../../dto/request/advertencia/advertencia-request.dto';
import { AdvertenciaEntity } from 'src/app/core/domain/entitys/advertencia.entity';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environment';

@Injectable({ providedIn: 'root' })
export class AdvertenciasHttpService implements ICrud<
  AdvertenciaRequestDto,
  AdvertenciaEntity
> {
  private url = `${environment.apiUrl}/Advertencias`;

  constructor(private http: HttpClient) {}

  GetAll(id: string): Observable<AdvertenciaEntity[]> {
    return this.http.get<AdvertenciaEntity[]>(`${this.url}/All/${id}`);
  }

  Get(id: string): Observable<AdvertenciaEntity> {
    return this.http.get<AdvertenciaEntity>(`${this.url}/${id}`);
  }

  Create(dto: AdvertenciaRequestDto): Observable<string> {
    return this.http.post<string>(`${this.url}`, dto);
  }

  Update(dto: AdvertenciaRequestDto): Observable<boolean> {
    return this.http.put<boolean>(`${this.url}/${dto.id}`, dto);
  }

  Delete(id: string): Observable<boolean> {
    return this.http.delete<boolean>(`${this.url}/${id}`);
  }
}
