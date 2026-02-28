import { Inject } from '@angular/core';
import { COMPANY_TOKEN } from '../../tokens/company.token';
import { IAllData } from 'src/app/core/domain/interfaces/ICrud';
import { CompanyRequestDto } from 'src/app/core/infrastructure/dto/request/company/company-request.dto';
import { CompanyEntity } from 'src/app/core/domain/entitys/company.entity';
import { Observable } from 'rxjs';

export class CompanyGetAllUseCase {
  constructor(
    @Inject(COMPANY_TOKEN)
    private repo: IAllData<CompanyRequestDto, CompanyEntity>,
  ) {}

  execute(page: number, size: number): Observable<CompanyEntity[]> {
    return this.repo.GetAll(page, size);
  }
}
