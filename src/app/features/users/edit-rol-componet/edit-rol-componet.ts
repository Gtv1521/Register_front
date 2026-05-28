import { Component, inject, signal } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { UserGetAllUseCase } from 'src/app/core/aplication/use-cases/user-usecase/user-get-all.useCase';
import { UserEntity } from 'src/app/core/domain/entitys/user.entity';
import { AuthService } from 'src/app/core/infrastructure/http/interceptors/auth.service';
import { LoaderComponent } from '../../components/floads/loader-component/loader-component';
import { CardUserComponent } from '../../components/cards/card-user-component/card-user-component';
import { RoleService } from 'src/app/core/infrastructure/services/effect/role.service';

@Component({
  selector: 'app-edit-rol-componet',
  imports: [CardUserComponent, LoaderComponent],
  templateUrl: './edit-rol-componet.html',
  styleUrl: './edit-rol-componet.scss',
})
export class EditRolComponet {
  private auth = inject(AuthService);
  private user = inject(UserGetAllUseCase);
  private rol = inject(RoleService);

  loader = signal<boolean>(false);
  users = signal<UserEntity[]>([]);
  rolUser = signal<string>('');

  async ngOnInit() {
    this.rolUser.set(this.rol.rolState()!);
    try {
      this.loader.set(true);
      this.users.set(
        await lastValueFrom(this.user.execute(this.auth.getCompany()!)),
      );
    } catch (error) {
    } finally {
      this.loader.set(false);
    }
  }

  onUserDeleted(deletedUser: UserEntity) {
    // Eliminar el usuario de la lista
    const updatedUsers = this.users().filter(
      (user) => user.id !== deletedUser.id,
    );
    this.users.set(updatedUsers);
  }
}
