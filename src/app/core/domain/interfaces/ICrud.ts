import { Observable } from "rxjs";

export interface ICrud<dto, entity> {
  Get(id: string): Observable<entity>;
  GetAll(): Observable<entity[]>;
  Create(dto: dto): Observable<string>;
  Update(dto: dto): Observable<boolean>;
  Delete(id: string): Observable<boolean>;
}

export interface IFiter<dto, entity> extends Omit<ICrud<dto, entity>, "Delete"> {
  Filter(data: string): Observable<entity[]>;

}
export interface IUser<dto, entity> extends Omit<ICrud<dto, entity>, "Create" | "Delete"> {
}
