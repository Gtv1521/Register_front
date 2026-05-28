import { Inject, Injectable } from "@angular/core";
import { OBSERVATION_TOKEN } from "../../tokens/observation.token";
import { IGeneral } from "src/app/core/domain/interfaces/ICrud";
import { ObservationRequestDto } from "src/app/core/infrastructure/dto/request/observation/observation-request.dto";
import { ObservationEntity } from "src/app/core/domain/entitys/observation.entity";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class ObservartionGetAllUseCase {
  constructor(
    @Inject(OBSERVATION_TOKEN) private repo: IGeneral<ObservationRequestDto, ObservationEntity>
  ) { }
  execute(id: string, page: number, size: number): Observable<ObservationEntity[]> { return this.repo.GetAll(id, page, size) }
}
