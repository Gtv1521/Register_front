import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SigInUseCase } from 'src/app/core/aplication/use-cases/session-usecase/sig-in.useCase';
import { SessionEntity } from 'src/app/core/domain/entitys/session.entity';
import { BidiModule } from '@angular/cdk/bidi';
import { AuthService } from 'src/app/core/infrastructure/http/interceptors/auth.service';
import { NewCompanyComponent } from '../../forms/new-company-component/new-company-component';
import { SigInFormComponent } from '../../forms/sig-in-form-component/sig-in-form-component';
import { lastValueFrom } from 'rxjs';
import { CompanyCreateUseCase } from 'src/app/core/aplication/use-cases/company-usecase/company-create.useCase';
import { LoaderComponent } from '../../components/floads/loader-component/loader-component';
import { Rol } from 'src/app/core/infrastructure/dto/request/sig-in-request.dto';

@Component({
  selector: 'app-sig-in-component',
  imports: [
    ReactiveFormsModule,
    BidiModule,
    NewCompanyComponent,
    SigInFormComponent,
    LoaderComponent,
  ],
  templateUrl: './sig-in-component.html',
  styleUrl: './sig-in-component.scss',
})
export class SigInComponent {
  // constructor
  private router = inject(Router);
  private singIn = inject(SigInUseCase);
  private addcompany = inject(CompanyCreateUseCase);
  private auth = inject(AuthService);

  @ViewChild('company') company!: NewCompanyComponent;
  @ViewChild('user') user!: SigInFormComponent;
  // estados
  siguiente: boolean = false;

  // estado: boolean = false;/
  error!: HttpErrorResponse;
  resonse!: SessionEntity;
  idCompany!: string;

  loader: boolean = false;

  // metodos
  goLogin() {
    this.router.navigate(['/login']);
  }

  async onSeguir() {
    const status = await this.company.onValidate();
    if (status === false) return;
    this.company.onDesabled();
    this.siguiente = true;
  }

  async saveCompany(): Promise<string> {
    try {
      const datosCompany = await this.company.onData();
      const res: any = await lastValueFrom(
        this.addcompany.execute(datosCompany),
      );
      return res.id;
    } catch (error) {
      throw error;
    }
  }

  async saveUser(): Promise<SessionEntity> {
    try {
      const dataUser = await this.user.onData(this.idCompany);
      dataUser.rol = Rol.Administrador;
      const res: SessionEntity = await lastValueFrom(
        this.singIn.execute(dataUser),
      );
      return res;
    } catch (error) {
      throw error;
    }
  }

  onBack() {
    this.siguiente = false;
  }

  async onSubmit() {
    if (!(await this.user.onValidate())) return;

    try {
      this.loader = true;
      const company = await this.saveCompany();
      this.idCompany = company;
      console.log('Company ID:', company);
      const user = await this.saveUser();
      console.log('User ID:', user);
      this.auth.setAuth(user.idUser, user.idSession, user.idCompany);
      this.router.navigate(['/dashboard']);
    } catch (error) {
      this.error = error as HttpErrorResponse;
      console.error('Algo fallo', this.error);
    } finally {
      this.loader = false;
    }
  }
}
