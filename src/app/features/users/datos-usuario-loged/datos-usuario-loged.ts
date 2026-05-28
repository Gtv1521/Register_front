import { Component, inject, input, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { UserGetIdUseCase } from 'src/app/core/aplication/use-cases/user-usecase/user-get-id.useCase';
import { UserEntity } from 'src/app/core/domain/entitys/user.entity';
import { LoaderComponent } from 'src/app/features/components/floads/loader-component/loader-component';
import { MatIcon } from '@angular/material/icon';
import { CompanyGetUseCase } from 'src/app/core/aplication/use-cases/company-usecase/company-get.useCase';
import { AuthService } from 'src/app/core/infrastructure/http/interceptors/auth.service';

@Component({
  selector: 'app-datos-usuario-loged',
  imports: [LoaderComponent, MatIcon],
  templateUrl: './datos-usuario-loged.html',
  styleUrl: './datos-usuario-loged.scss',
})
export class DatosUsuarioLoged {
  private user = inject(UserGetIdUseCase);
  private route = inject(ActivatedRoute);
  private auth = inject(AuthService);
  private company = inject(CompanyGetUseCase);

  // data entrada
  id = input<string>(this.route.snapshot.paramMap.get('id')!);

  // estados
  dataUser = signal<UserEntity | null>(null);
  loader = signal<boolean>(true);
  nameCompany = signal<string>('');

  // metodos
  async ngOnInit(): Promise<void> {
    try {
      this.loader.set(true);

      await Promise.all([this.LoadUsuario(), this.LoadCompany()]);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      this.loader.set(false);
    }
  }

  async LoadUsuario(): Promise<void> {
    this.dataUser.set(await lastValueFrom(this.user.execute(this.id()!)));
  }

  async LoadCompany(): Promise<void> {
    try {
      const companyData = await lastValueFrom(
        this.company.execute(this.auth.companyId()!),
      );
      this.nameCompany.set(companyData.name || 'Empresa sin nombre');
    } catch (error) {
      console.error('Error loading company data:', error);
      this.nameCompany.set('Empresa no encontrada');
    }
  }
}
