import { Injectable } from "@angular/core";
import { ClientEntity } from "../../domain/entitys/client.entity";
import { IMapper } from "../../domain/interfaces/IMapper";
import { ClientResponseDto } from "../../infrastructure/dto/response/client/client-response.dto";

@Injectable({ providedIn: "root" })
export class ClientMapper implements IMapper<ClientResponseDto, ClientEntity> {
  fromDto(dto: ClientResponseDto): ClientEntity {
    return dto as ClientEntity;
  }
  toDto(entity: ClientEntity): ClientResponseDto {
    return entity as ClientResponseDto;
  }

}
