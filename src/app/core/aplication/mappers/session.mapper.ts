import { Injectable } from '@angular/core';
import { SessionEntity } from '../../domain/entitys/session.entity';
import { IMapper } from '../../domain/interfaces/IMapper';
import { SessionResponseDto } from '../../infrastructure/dto/response/session-response.dto';
@Injectable({ providedIn: 'root' })
export class SessionMapper
  implements IMapper<SessionResponseDto, SessionEntity>
{
  fromDto(dto: SessionResponseDto): SessionEntity {
    return dto as SessionEntity;
  }
  toDto(entity: SessionEntity): SessionResponseDto {
    return entity as SessionResponseDto;
  }
}
