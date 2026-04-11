import { Injectable } from '@angular/core';
import { IRegistro } from 'src/app/core/domain/interfaces/ICrud';
import { map, Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@environment';
import { RegisterRequestDto } from '../../dto/request/register/register-request.dto';
import { RegisterEntity } from 'src/app/core/domain/entitys/register.entity';
import { RegisterResponseDto } from '../../dto/response/register/register-response.dto';
import { RegisterMapper } from 'src/app/core/aplication/mappers/register.mapper';

@Injectable({
  providedIn: 'root',
})
export class RegisterHttpService implements IRegistro<
  RegisterRequestDto,
  RegisterEntity
> {
  Url = `${environment.apiUrl}/Register`;

  constructor(
    private http: HttpClient,
    private mapper: RegisterMapper,
  ) {}
  downloadPdf(id: string): Observable<{ blob: Blob; filename: string }> {
    return this.http
      .get(`${this.Url}/pdf/${id}`, {
        observe: 'response', // <--- IMPORTANTE: Para ver los Headers
        responseType: 'blob',
        withCredentials: true,
      })
      .pipe(
        map((response) => {
          // Extraemos el nombre del archivo del header 'content-disposition'
          const contentDisposition = response.headers.get(
            'content-disposition',
          );
          const filename =
            this.extraerNombreArchivo(contentDisposition) ||
            `reporte-${id}.pdf`;

          return {
            blob: response.body as Blob,
            filename: filename,
          };
        }),
      );
  }
  GetAll(
    company: string,
    page: number,
    siza: number,
  ): Observable<RegisterEntity[]> {
    let params = new HttpParams()
      .set('pageNumber', page)
      .set('pageSize', siza)
      .set('idCompany', company);
    return this.http
      .get<RegisterResponseDto[]>(`${this.Url}`, { params })
      .pipe(map((res) => res.map((c) => this.mapper.fromDto(c))));
  }
  Filter(): Observable<RegisterEntity[]> {
    return this.http
      .get<RegisterResponseDto[]>(`${this.Url}/Filter`)
      .pipe(map((res) => res.map((c) => this.mapper.fromDto(c))));
  }
  Get(id: string): Observable<RegisterEntity> {
    return this.http
      .get<RegisterResponseDto>(`${this.Url}/${id}`)
      .pipe(map((res) => this.mapper.fromDto(res)));
  }
  Create(dto: RegisterRequestDto): Observable<string> {
    return this.http.post<string>(`${this.Url}`, dto);
  }
  Update(dto: RegisterRequestDto): Observable<boolean> {
    return this.http.put<boolean>(`${this.Url}/${dto.id}`, dto);
  }

  private extraerNombreArchivo(header: string | null): string | null {
    if (!header) return null;
    const match = header.match(/filename=(?<filename>[^;]+)/);
    return match?.groups?.['filename'] ? match.groups['filename'].trim() : null;
  }
}
