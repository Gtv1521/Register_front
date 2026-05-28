import { Inject, inject, Injectable } from '@angular/core';
import { COMPANY_TOKEN } from '../../tokens/company.token';
import { IAllData } from 'src/app/core/domain/interfaces/ICrud';
import { CompanyRequestDto } from 'src/app/core/infrastructure/dto/request/company/company-request.dto';
import { CompanyEntity } from 'src/app/core/domain/entitys/company.entity';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CompanyCreateUseCase {
  constructor(
    @Inject(COMPANY_TOKEN)
    private repo: IAllData<CompanyRequestDto, CompanyEntity>,
  ) {}

  execute(dto: any): Observable<string>{
    return this.repo.Create(dto); 
  }
}
