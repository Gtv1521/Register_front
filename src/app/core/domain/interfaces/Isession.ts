import { Observable } from 'rxjs';

export interface ISession<dto, dto1, entity> {
  Login(user: dto): Observable<entity>;
  SigIn(data: dto1): Observable<entity>;
  ResetPassword(mail: string): Observable<boolean>;
  VerifyMail(mail: string): Observable<boolean>;
  Logout(id: string): Observable<boolean>;
}
