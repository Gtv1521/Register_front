import { Inject, Injectable } from '@angular/core';
import { REGISTER_TOKEN } from '../../tokens/register.token';
import { IRegistro } from 'src/app/core/domain/interfaces/ICrud';
import { RegisterRequestDto } from 'src/app/core/infrastructure/dto/request/register/register-request.dto';
import { RegisterEntity } from 'src/app/core/domain/entitys/register.entity';
import { Observable } from 'rxjs';

@Injectable({providedIn: 'root'})
export class RegisterDeleteUseCase {
  constructor(
    @Inject(REGISTER_TOKEN)
    private repo: IRegistro<RegisterRequestDto, RegisterEntity>,
  ) {}

  execute(id: string): Observable<boolean> {
    return this.repo.Delete(id);
  }
}
