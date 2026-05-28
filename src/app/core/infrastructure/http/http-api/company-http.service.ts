import { Injectable } from '@angular/core';
import {
  IAllData,
  ICrud,
  IGeneral,
} from 'src/app/core/domain/interfaces/ICrud';
import { CompanyRequestDto } from '../../dto/request/company/company-request.dto';
import { CompanyEntity } from 'src/app/core/domain/entitys/company.entity';
import { map, Observable } from 'rxjs';
import { environment } from '@environment';
import { HttpClient, HttpHandler, HttpParams } from '@angular/common/http';
import { CompanyResponseDto } from '../../dto/response/company/company-response.dto';
import { CompanyMapper } from 'src/app/core/aplication/mappers/company.mapper';

@Injectable({
  providedIn: 'root',
})
export class CompanyHttpService implements IAllData<
  CompanyRequestDto,
  CompanyEntity
> {
  Url = `${environment.apiUrl}/Company`;

  constructor(
    private http: HttpClient,
    private mapper: CompanyMapper,
  ) {}

  Delete(id: string): Observable<boolean> {
    throw new Error('Method not implemented.');
  }

  GetAll(pag: number, size: number): Observable<CompanyEntity[]> {
    let params = new HttpParams().set('pageNumber', pag).set('pageSize', size);

    return this.http
      .get<CompanyResponseDto[]>(`${this.Url}`, { params })
      .pipe(map((res) => res.map((c) => this.mapper.fromDto(c))));
  }

  Get(id: string): Observable<CompanyEntity> {
    return this.http
      .get<CompanyResponseDto>(`${this.Url}/${id}`)
      .pipe(map((res) => this.mapper.fromDto(res)));
  }

  Create(dto: CompanyRequestDto): Observable<string> {
    console.log('Enviando datos al backend:', dto);
    return this.http.post<string>(`${this.Url}`, dto);
  }

  Update(dto: CompanyRequestDto): Observable<boolean> {
    throw new Error('Method not implemented.');
  }
}
