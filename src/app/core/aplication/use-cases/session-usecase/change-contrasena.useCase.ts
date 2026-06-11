import { Inject, Injectable } from '@angular/core';
import { RESET_TOKEN } from '../../tokens/session.token';
import { IReset } from 'src/app/core/domain/interfaces/ICrud';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ChangeContrasenaUseCase {
  constructor(@Inject(RESET_TOKEN) private repo: IReset) {}

  execute(id: string, pass: string, token: string): Observable<boolean> {
    return this.repo.updatePass(id, token, pass);
  }
}
