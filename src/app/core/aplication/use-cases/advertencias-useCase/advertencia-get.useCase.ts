import { Inject, Injectable } from '@angular/core';
import { ADVERTENCIA_TOKEN } from '../../tokens/advertencias.token';
import { ICrud } from 'src/app/core/domain/interfaces/ICrud';
import { AdvertenciaEntity } from 'src/app/core/domain/entitys/advertencia.entity';
import { AdvertenciaRequestDto } from 'src/app/core/infrastructure/dto/request/advertencia/advertencia-request.dto';
import { Observable } from 'node_modules/rxjs/dist/types';

@Injectable({ providedIn: 'root' })
export class AdvertenciaGetUseCase {
  constructor(
    @Inject(ADVERTENCIA_TOKEN)
    private repo: ICrud<AdvertenciaRequestDto, AdvertenciaEntity>,
  ) {}

  execute(id: string): Observable<AdvertenciaEntity> {
    return this.repo.Get(id);
  }
}
