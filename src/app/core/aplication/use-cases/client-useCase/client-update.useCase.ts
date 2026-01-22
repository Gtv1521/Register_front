import { Inject, Injectable } from "@angular/core";
import { ClientEntity } from "src/app/core/domain/entitys/client.entity";
import { IClient } from "src/app/core/domain/interfaces/ICrud";
import { ClientRequestDto } from "src/app/core/infrastructure/dto/request/client/client-request.dto";
import { CLIENT_TOKEN } from "../../tokens/client.token";

@Injectable({ providedIn: 'root' })
export class ClientUpdateUseCase {
  constructor(
    @Inject(CLIENT_TOKEN) private repo: IClient<ClientRequestDto, ClientEntity>
  ) { }
  execute(dto: ClientRequestDto) {
    return this.repo.Update(dto);
  }
}
