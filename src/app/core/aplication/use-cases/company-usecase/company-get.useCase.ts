import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CompanyEntity } from 'src/app/core/domain/entitys/company.entity';
import { COMPANY_TOKEN } from '../../tokens/company.token';
import { IAllData } from 'src/app/core/domain/interfaces/ICrud';
import { CompanyRequestDto } from 'src/app/core/infrastructure/dto/request/company/company-request.dto';

@Injectable({providedIn: "root"})
export class CompanyGetUseCase {
  constructor(
    @Inject(COMPANY_TOKEN)
    private repo: IAllData<CompanyRequestDto, CompanyEntity>,
  ) {}

  execute(id: string): Observable<CompanyEntity> {
    return this.repo.Get(id);
  }
}
 