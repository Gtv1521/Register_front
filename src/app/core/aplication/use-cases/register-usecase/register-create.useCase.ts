import { Inject, Injectable } from '@angular/core';
import { REGISTER_TOKEN } from '../../tokens/register.token';
import { IFiter } from 'src/app/core/domain/interfaces/ICrud';
import { RegisterEntity } from 'src/app/core/domain/entitys/register.entity';
import { map, Observable } from 'rxjs';
import { RegisterRequestDto } from 'src/app/core/infrastructure/dto/request/register/register-request.dto';
import { ResponseCreatedDto } from 'src/app/core/infrastructure/dto/response/response-created.dto';

@Injectable({ providedIn: 'root' })
export class RegisterCreateUseCase {
  constructor(
    @Inject(REGISTER_TOKEN)
    private repo: IFiter<RegisterRequestDto, RegisterEntity>,
  ) {}
  execute(register: RegisterRequestDto): Observable<string> {
    return this.repo.Create(register);
  }
}
