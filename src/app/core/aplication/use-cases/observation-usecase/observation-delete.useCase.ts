import { Inject, Injectable } from '@angular/core';
import { OBSERVATION_TOKEN } from '../../tokens/observation.token';
import { IGeneral } from 'src/app/core/domain/interfaces/ICrud';
import { ObservationRequestDto } from 'src/app/core/infrastructure/dto/request/observation/observation-request.dto';
import { ObservationEntity } from 'src/app/core/domain/entitys/observation.entity';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ObservationDeleteUseCase {
  constructor(
    @Inject(OBSERVATION_TOKEN)
    private observationRepository: IGeneral<
      ObservationRequestDto,
      ObservationEntity
    >,
  ) {}

  execute(id: string): Observable<boolean> {
    return this.observationRepository.Delete(id);
  }
}
