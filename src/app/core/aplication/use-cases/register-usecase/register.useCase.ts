import { Inject, Injectable } from "@angular/core";
import { REGISTER_TOKEN } from "../../tokens/register.token";
import { IFiter, IRegistro } from "src/app/core/domain/interfaces/ICrud";
import { RegisterEntity } from "src/app/core/domain/entitys/register.entity";
import { Observable } from "rxjs";
import { RegisterRequestDto } from "src/app/core/infrastructure/dto/request/register/register-request.dto";

@Injectable({ providedIn: "root" })
export class RegisterUseCase {
  constructor(
    @Inject(REGISTER_TOKEN) private repo: IRegistro<RegisterRequestDto, RegisterEntity>
  ) { }

  execute(id: string): Observable<RegisterEntity> { return this.repo.Get(id) }

}
