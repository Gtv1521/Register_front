import { Inject, Injectable } from '@angular/core';
import { ADVERTENCIA_TOKEN } from '../../tokens/advertencias.token';
import { ICrud } from 'src/app/core/domain/interfaces/ICrud';
import { AdvertenciaRequestDto } from 'src/app/core/infrastructure/dto/request/advertencia/advertencia-request.dto';
import { AdvertenciaEntity } from 'src/app/core/domain/entitys/advertencia.entity';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AdvertenciasDeleteUseCase {
  constructor(
    @Inject(ADVERTENCIA_TOKEN)
    private repo: ICrud<AdvertenciaRequestDto, AdvertenciaEntity>,
  ) {}

  execute(id: string): Observable<boolean> {
    return this.repo.Delete(id);
  }
}
