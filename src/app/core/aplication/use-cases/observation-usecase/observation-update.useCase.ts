import { Inject, Injectable } from '@angular/core';
import { ObservationEntity } from 'src/app/core/domain/entitys/observation.entity';
import { IGeneral } from 'src/app/core/domain/interfaces/ICrud';
import { ObservationRequestDto } from 'src/app/core/infrastructure/dto/request/observation/observation-request.dto';
import { OBSERVATION_TOKEN } from '../../tokens/observation.token';

@Injectable({ providedIn: 'root' })
export class ObservationUpdateUseCase {
  constructor(
    @Inject(OBSERVATION_TOKEN)
    private repo: IGeneral<ObservationRequestDto, ObservationEntity>,
  ) {}

  execute(dto: ObservationRequestDto) {
    return this.repo.Update(dto);
  }
}
