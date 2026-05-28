import { Injectable } from '@angular/core';
import { CompanyEntity } from '../../domain/entitys/company.entity';
import { IMapper } from '../../domain/interfaces/IMapper';
import { CompanyResponseDto } from '../../infrastructure/dto/response/company/company-response.dto';

@Injectable({ providedIn: 'root' })
export class CompanyMapper implements IMapper<
  CompanyResponseDto,
  CompanyEntity
> {
  fromDto(dto: CompanyResponseDto): CompanyEntity {
    return dto as CompanyEntity;
  }

  toDto(entity: CompanyEntity): CompanyResponseDto {
    return entity as CompanyResponseDto;
  }
}
