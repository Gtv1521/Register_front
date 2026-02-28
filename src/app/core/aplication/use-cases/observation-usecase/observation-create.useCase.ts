import { Inject, Injectable } from "@angular/core";
import { ObservationEntity } from "src/app/core/domain/entitys/observation.entity";
import { IGeneral } from "src/app/core/domain/interfaces/ICrud";
import { ObservationRequestDto } from "src/app/core/infrastructure/dto/request/observation/observation-request.dto";
import { OBSERVATION_TOKEN } from "../../tokens/observation.token";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ObservationCreateUseCase {
  constructor(
    @Inject(OBSERVATION_TOKEN) private observationRepository: IGeneral<ObservationRequestDto, ObservationEntity>,
  ) { }

  execute(observationData: ObservationRequestDto): Observable<string> {
    return this.observationRepository.Create(observationData);
  }
}
