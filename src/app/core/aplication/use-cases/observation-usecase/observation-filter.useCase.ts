import { Inject, Injectable } from '@angular/core';
import { OBSERVATION_TOKEN } from '../../tokens/observation.token';
import { IGeneral } from 'src/app/core/domain/interfaces/ICrud';
import { ObservationRequestDto } from 'src/app/core/infrastructure/dto/request/observation/observation-request.dto';
import { ObservationEntity } from 'src/app/core/domain/entitys/observation.entity';
import { Observable } from 'node_modules/rxjs/dist/types';

@Injectable({ providedIn: 'root' })
export class ObservationFilterUseCase {
  constructor(
    @Inject(OBSERVATION_TOKEN)
    private repo: IGeneral<ObservationRequestDto, ObservationEntity>,
  ) {}

  execute(id: string, filter: string): Observable<ObservationEntity[]> {
    return this.repo.FilterData(id, filter);
  }
}
