import { Inject, Injectable } from '@angular/core';
import { IReset } from 'src/app/core/domain/interfaces/ICrud';
import { RESET_TOKEN } from '../../tokens/session.token';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SendMailUseCase {
  constructor(@Inject(RESET_TOKEN) private repo: IReset) {}

  execute(email: string, ruta: string): Observable<boolean> {
    return this.repo.sentMail(email, ruta);
  }
}
