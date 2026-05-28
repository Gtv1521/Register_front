import { Injectable } from "@angular/core";
import { ObservationEntity } from "../../domain/entitys/observation.entity";
import { IMapper } from "../../domain/interfaces/IMapper";
import { ObservationResponseDto } from "../../infrastructure/dto/response/observation/observation-response.dto";

@Injectable({ providedIn: "root" })
export class ObservationMapper implements IMapper<ObservationResponseDto, ObservationEntity> {
  fromDto(dto: ObservationResponseDto): ObservationEntity {
    return dto as ObservationEntity;
  }
  toDto(entity: ObservationEntity): ObservationResponseDto {
    return entity as ObservationResponseDto
  }

}
