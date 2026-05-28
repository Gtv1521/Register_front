import { Observable } from 'rxjs';

export interface ICrud<dto, entity> {
  Get(id: string): Observable<entity>;
  GetAll(id: string): Observable<entity[]>;
  Create(dto: dto): Observable<string>;
  Update(dto: dto): Observable<boolean>;
  Delete(id: string): Observable<boolean>;
}

export interface IFiter<dto, entity> extends Omit<
  ICrud<dto, entity>,
  'Delete' | 'GetAll'
> {
  Filter(data: string): Observable<entity[]>;
  GetAll(company: string, page: number, size: number): Observable<entity[]>;
}

export interface IRegistro<dto, entity> extends Omit<
  IFiter<dto, entity>,
  'Filter'
> {
  Filter(data: string, idCompany: string): Observable<entity[]>;
  Delete(id: string): Observable<boolean>;
  downloadPdf(id: string): Observable<{ blob: Blob; filename: string }>;
  UpdateAntisipo(id: string, antisipo: number): Observable<boolean>;
  UpdateTotal(id: string, total: number): Observable<boolean>;
}

export interface IUser<dto, entity> extends Omit<
  ICrud<dto, entity>,
  'Get' | 'GetAll'
> {
  Get(): Observable<entity>;
  GetId(id: string): Observable<entity>;
  GetAll(id: string): Observable<entity[]>;
  SaveSession(id: string, theme: string): Observable<boolean>;
  UpdateRol(id: string, rol: string): Observable<boolean>;
}

export interface IGeneral<dto, entity>
  extends Omit<ICrud<dto, entity>, 'GetAll'>, IAllFilter<entity> {
  GetAll(id: string, page: number, size: number): Observable<entity[]>;
}

export interface IClient<dto, entity> extends Omit<
  ICrud<dto, entity>,
  'Delete' | 'GetAll' | 'Update'
> {
  Filter(data: string): Observable<entity[]>;
  Update(id: string, dto: dto): Observable<boolean>;
}

export interface IAllFilter<entity> {
  FilterData(id: string, filter: string): Observable<entity[]>;
}

export interface IAllData<dto, entity> extends Omit<
  ICrud<dto, entity>,
  'GetAll'
> {
  GetAll(pag: number, size: number): Observable<entity[]>;
}
