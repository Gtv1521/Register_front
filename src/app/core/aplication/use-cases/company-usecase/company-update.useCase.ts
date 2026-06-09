import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CompanyRequestDto } from 'src/app/core/infrastructure/dto/request/company/company-request.dto';
import { COMPANY_TOKEN } from '../../tokens/company.token';
import { IAllData } from 'src/app/core/domain/interfaces/ICrud';
import { CompanyEntity } from 'src/app/core/domain/entitys/company.entity';

@Injectable({ providedIn: 'root' })
export class CompanyUpdateUseCase {
  constructor(
    @Inject(COMPANY_TOKEN)
    private repo: IAllData<CompanyRequestDto, CompanyEntity>,
  ) {}

  execute(dto: any, id: string, updateLogo: boolean): Observable<boolean> {
    return this.repo.Update(dto, id, updateLogo);
  }
}
