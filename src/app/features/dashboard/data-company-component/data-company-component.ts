import { Component, effect, inject, signal, viewChild } from '@angular/core';
import { LoaderComponent } from '../../components/floads/loader-component/loader-component';
import { CompanyEntity } from 'src/app/core/domain/entitys/company.entity';
import { AuthService } from 'src/app/core/infrastructure/http/interceptors/auth.service';
import { CompanyGetUseCase } from 'src/app/core/aplication/use-cases/company-usecase/company-get.useCase';
import { lastValueFrom } from 'rxjs';
import { MatIcon } from '@angular/material/icon';
import { NewCompanyComponent } from '../../forms/new-company-component/new-company-component';
import { CompanyUpdateUseCase } from 'src/app/core/aplication/use-cases/company-usecase/company-update.useCase';
import { SignalRService } from 'src/app/core/infrastructure/services/signalr/signal-r.service';
import { CargandoAccionComponent } from "../../components/floads/cargando-accion-component/cargando-accion-component";

@Component({
  selector: 'app-data-company-component',
  imports: [LoaderComponent, MatIcon, NewCompanyComponent, CargandoAccionComponent],
  templateUrl: './data-company-component.html',
  styleUrl: './data-company-component.scss',
})
export class DataCompanyComponent {
  private auth = inject(AuthService);
  private getCompany = inject(CompanyGetUseCase);
  private updateCompany = inject(CompanyUpdateUseCase);
  private signalR = inject(SignalRService);

  isLoader = signal<boolean>(false);
  company = signal<CompanyEntity | null>(null);
  isEditar = signal<boolean>(false);
  editaLogo = signal<boolean>(false);
  loaderUpdate = signal<boolean>(false);

  formCompany = viewChild(NewCompanyComponent);

  companyEffect = effect(() => {
    const componente = this.formCompany();
    if (componente) {
      componente.onLlenaData(this.company()!);
      componente.showLogo(this.company()?.logoUrl!);
    }
  });

  constructor() {
    this.signalR.updateCompany$.subscribe((company) => {
      const currentCompany = this.company();
      if (currentCompany && currentCompany.id === company.id) {
        this.company.set(company);
      }
    });
  }

  async ngOnInit(): Promise<void> {
    this.isLoader.set(true);
    try {
      await this.loderCompany();
    } catch (error) {
      throw new Error('Error al cargar la empresa');
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

  onEditLogo($event: boolean): void {
    this.editaLogo.set($event);
  }

  toggleUpdate(): void {
    this.loaderUpdate.set(!this.loaderUpdate());
  }

  async onGuardar(): Promise<void> {
    const datos = await this.formCompany()?.onData();

    try {
      this.toggleUpdate();
      await lastValueFrom(
        this.updateCompany.execute(
          datos,
          this.company()?.id!,
          this.editaLogo(),
        ),
      );
    } catch (error) {
      throw new Error('Error al actualizar la empresa');
    } finally {
      this.toggleUpdate();
      this.isEditar.set(false);
    }
  }
}
