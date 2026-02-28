import { inject, Injectable } from "@angular/core";
import { RegisterEntity } from "../../domain/entitys/register.entity";
import { IMapper } from "../../domain/interfaces/IMapper";
import { RegisterResponseDto } from "../../infrastructure/dto/response/register/register-response.dto";
import { ObservationMapper } from "./observable.mapper";
import { ClientMapper } from "./client.mapper";
@Injectable({ providedIn: "root" })
export class RegisterMapper implements IMapper<RegisterResponseDto, RegisterEntity> {

  private mapObservation = inject(ObservationMapper);
  private mapClient = inject(ClientMapper);

  fromDto(dto: RegisterResponseDto): RegisterEntity {
    // return dto as RegisterEntity;
    return {
      clients: this.mapClient.fromDto(dto.clients),
      observation: this.mapObservation.fromDto(dto.observation),
      id: dto.id,
      idClient: dto.idClient,
      idUser: dto.idUser,
      registroNumber: dto.registroNumber,
      idQr: dto.idQr,
      urlQr: dto.urlQr,
      createdAt: dto.createdAt,
      statusRegister: dto.statusRegister
    }
  }
  toDto(entity: RegisterEntity): RegisterResponseDto {
    return entity as RegisterResponseDto
  }
}
