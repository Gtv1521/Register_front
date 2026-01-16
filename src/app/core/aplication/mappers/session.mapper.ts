import { Injectable } from '@angular/core';
import { SessionEntity } from '../../domain/entitys/session.entity';
import { IMapper } from '../../domain/interfaces/IMapper';
import { SessionResponseDto } from '../../infrastructure/dto/response/session-response.dto';
@Injectable({ providedIn: 'root' })
export class SessionMapper
  implements IMapper<SessionResponseDto, SessionEntity>
{
  fromDto(dto: SessionResponseDto): SessionEntity {
    return {
      idSession: dto.idSession,
      idUser: dto.idUser,
      accessToken: dto.accessToken,
      refreshToken: dto.refreshToken,
    };
  }
  toDto(entity: SessionEntity): SessionResponseDto {
    throw new Error('Method not implemented.');
  }
}
