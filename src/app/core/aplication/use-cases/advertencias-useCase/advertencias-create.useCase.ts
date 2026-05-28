import { Inject, Injectable } from '@angular/core';
import { ADVERTENCIA_TOKEN } from '../../tokens/advertencias.token';
import { AdvertenciaRequestDto } from 'src/app/core/infrastructure/dto/request/advertencia/advertencia-request.dto';
import { AdvertenciaEntity } from 'src/app/core/domain/entitys/advertencia.entity';
import { ICrud } from 'src/app/core/domain/interfaces/ICrud';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AdvertenciasCreateUseCase {
  constructor(
    @Inject(ADVERTENCIA_TOKEN)
    private repo: ICrud<AdvertenciaRequestDto, AdvertenciaEntity>,
  ) {}

  execute(dto: AdvertenciaRequestDto): Observable<string> {
    return this.repo.Create(dto);
  }
}
