import { Inject, Injectable } from '@angular/core';
import { RegisterEntity } from 'src/app/core/domain/entitys/register.entity';
import { IRegistro } from 'src/app/core/domain/interfaces/ICrud';
import { REGISTER_TOKEN } from '../../tokens/register.token';
import { Observable } from 'rxjs';
import { RegisterRequestDto } from 'src/app/core/infrastructure/dto/request/register/register-request.dto';

@Injectable({ providedIn: 'root' })
export class RegisterFilterUseCase {
  constructor(
    @Inject(REGISTER_TOKEN)
    private repo: IRegistro<RegisterRequestDto, RegisterEntity>,
  ) {}
  execute(busqueda: string, idCompany: string): Observable<RegisterEntity[]> {
    return this.repo.Filter(busqueda, idCompany);
  }
}
