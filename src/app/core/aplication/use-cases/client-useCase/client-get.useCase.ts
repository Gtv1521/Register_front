import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ClientEntity } from "src/app/core/domain/entitys/client.entity";
import { IClient } from "src/app/core/domain/interfaces/ICrud";
import { ClientRequestDto } from "src/app/core/infrastructure/dto/request/client/client-request.dto";
import { CLIENT_TOKEN } from "../../tokens/client.token";

@Injectable({ providedIn: 'root' })
export class ClientGetUseCase {
  constructor(
    @Inject(CLIENT_TOKEN) private repo: IClient<ClientRequestDto, ClientEntity>
  ) { }
  execute(id: string): Observable<ClientEntity> {
    return this.repo.Get(id);
  }
}
