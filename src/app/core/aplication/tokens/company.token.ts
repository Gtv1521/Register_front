import { InjectionToken } from '@angular/core';
import { IAllData } from '../../domain/interfaces/ICrud';
import { CompanyRequestDto } from '../../infrastructure/dto/request/company/company-request.dto';
import { CompanyEntity } from '../../domain/entitys/company.entity';

export const COMPANY_TOKEN = new InjectionToken<
  IAllData<CompanyRequestDto, CompanyEntity>
>('COMPANY_TOKEN');
