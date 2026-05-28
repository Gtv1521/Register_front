import { Component, effect, inject, signal, viewChild } from '@angular/core';
import { LoaderComponent } from '../../components/floads/loader-component/loader-component';
import { CompanyEntity } from 'src/app/core/domain/entitys/company.entity';
import { AuthService } from 'src/app/core/infrastructure/http/interceptors/auth.service';
import { CompanyGetUseCase } from 'src/app/core/aplication/use-cases/company-usecase/company-get.useCase';
import { lastValueFrom } from 'rxjs';
import { MatIcon } from '@angular/material/icon';
import { NewCompanyComponent } from '../../forms/new-company-component/new-company-component';

@Component({
  selector: 'app-data-company-component',
  imports: [LoaderComponent, MatIcon, NewCompanyComponent],
  templateUrl: './data-company-component.html',
  styleUrl: './data-company-component.scss',
})
export class DataCompanyComponent {
  private auth = inject(AuthService);
  private getCompany = inject(CompanyGetUseCase);

  isLoader = signal<boolean>(false);
  company = signal<CompanyEntity | null>(null);
  isEditar = signal<boolean>(false);

  formCompany = viewChild(NewCompanyComponent);

  companyEffect = effect(() => {
    const componente = this.formCompany();
    if (componente) {
      componente.onLlenaData(this.company()!);
      componente.showLogo(this.company()?.logoUrl!);
    }
  });

  async ngOnInit(): Promise<void> {
    this.isLoader.set(true);
    try {
      await this.loderCompany();
    } catch (error) {
      console.log(error);
    } finally {
      this.isLoader.set(false);
    }
  }

  onEditar(): void {
    this.isEditar.set(!this.isEditar());
  }

  async loderCompany(): Promise<void> {
    try {
      const response = await lastValueFrom(
        this.getCompany.execute(this.auth.getCompany()!),
      );
      this.company.set(response);
    } catch (error) {}
  }
}
