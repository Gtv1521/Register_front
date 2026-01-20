import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environment';
import { ObservationMapper } from 'src/app/core/aplication/mappers/observable.mapper';
import { IFiter, IObservation } from 'src/app/core/domain/interfaces/ICrud';
import { ObservationEntity } from 'src/app/core/domain/entitys/observation.entity';
import { ObservationRequestDto } from '../../dto/request/observation/observation-request.dto';
import { map, Observable } from 'rxjs';
import { ObservationResponseDto } from '../../dto/response/observation/observation-response.dto';

@Injectable({
  providedIn: 'root',
})
export class ObservationHttpService implements IObservation<ObservationRequestDto, ObservationEntity> {
  Url = `${environment.apiUrl}/Observation`;
  constructor(
    private http: HttpClient,
    private mapper: ObservationMapper,
  ) { }
  Get(id: string): Observable<ObservationEntity> {
    return this.http.get<ObservationResponseDto>(`${this.Url}/${id}`).pipe(map(res => this.mapper.fromDto(res)));
  }
  GetAll(): Observable<ObservationEntity[]> {
    return this.http.get<ObservationResponseDto[]>(this.Url).pipe(map(res => res.map(c => this.mapper.fromDto(c))));
  }
  Create(dto: ObservationRequestDto): Observable<string> {
    return this.http.post<string>(`${this.Url}`, dto);
  }
  Update(dto: ObservationRequestDto): Observable<boolean> {
    return this.http.post<boolean>(`${this.Url}/${dto.id}`, dto);
  }
}
