import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environment';
import { ObservationMapper } from 'src/app/core/aplication/mappers/observable.mapper';
import { IGeneral } from 'src/app/core/domain/interfaces/ICrud';
import { ObservationEntity } from 'src/app/core/domain/entitys/observation.entity';
import { ObservationRequestDto } from '../../dto/request/observation/observation-request.dto';
import { map, Observable } from 'rxjs';
import { ObservationResponseDto } from '../../dto/response/observation/observation-response.dto';

@Injectable({
  providedIn: 'root',
})
export class ObservationHttpService implements IGeneral<
  ObservationRequestDto,
  ObservationEntity
> {
  Url = `${environment.apiUrl}/Observation`;
  constructor(
    private http: HttpClient,
    private mapper: ObservationMapper,
  ) {}

  Get(id: string): Observable<ObservationEntity> {
    return this.http
      .get<ObservationResponseDto>(`${this.Url}/${id}`)
      .pipe(map((res) => this.mapper.fromDto(res)));
  }
  GetAll(
    id: string,
    page: number,
    size: number,
  ): Observable<ObservationEntity[]> {
    return this.http
      .get<ObservationResponseDto[]>(`${this.Url}/${id}/${page}/${size}`)
      .pipe(map((res) => res.map((c) => this.mapper.fromDto(c))));
  }
  Create(dto: ObservationRequestDto): Observable<string> {
    const formData = new FormData();

    formData.append('IdRegister', dto.IdRegister); // 🔑
    formData.append('IdUser', dto.IdUser); // 🔑
    formData.append('Type', dto.Type.toString()); // 🔑
    formData.append('Description', dto.Description);
    formData.append('NotificaEmail', dto.NotificaEmail.toString());
    formData.append('NotificaWhatsapp', dto.NotificaWhatsapp.toString());

    dto.Photos.forEach((photo, index) => {
      formData.append('Photos', photo);
    });

    return this.http.post<string>(`${this.Url}`, formData);
  }
  Update(dto: ObservationRequestDto): Observable<boolean> {
    return this.http.post<boolean>(`${this.Url}/${dto.id}`, dto);
  }

  Delete(id: string): Observable<boolean> {
    return this.http.delete<boolean>(`${this.Url}/${id}`);
  }
}
