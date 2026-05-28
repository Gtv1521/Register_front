import { Component, inject, input, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { UserGetIdUseCase } from 'src/app/core/aplication/use-cases/user-usecase/user-get-id.useCase';
import { UserEntity } from 'src/app/core/domain/entitys/user.entity';
import { LoaderComponent } from 'src/app/features/components/floads/loader-component/loader-component';
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-datos-usuario-loged',
  imports: [LoaderComponent, MatIcon],
  templateUrl: './datos-usuario-loged.html',
  styleUrl: './datos-usuario-loged.scss',
})
export class DatosUsuarioLoged {
  private user = inject(UserGetIdUseCase);
  private route = inject(ActivatedRoute);

  // data entrada
  id = input<string>(this.route.snapshot.paramMap.get('id')!);
  dataUser = signal<UserEntity | null>(null);

  // estados
  loader = signal<boolean>(true);

  // metodos
  async ngOnInit(): Promise<void> {
    try {
      this.loader.set(true);
      await this.LoadUsuario();
      console.log(this.dataUser());
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      this.loader.set(false);
    }
  }

  async LoadUsuario(): Promise<void> {
    this.dataUser.set(await lastValueFrom(this.user.execute(this.id()!)));
  }
}
