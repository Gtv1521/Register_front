import { Component, inject, input, output, signal } from '@angular/core';
import { UserEntity } from 'src/app/core/domain/entitys/user.entity';
import { CommonModule } from '@angular/common';
import { ConfirmAlertComponent } from '../../floads/confirm-alert-component/confirm-alert-component';
import { UserDeleteUseCase } from 'src/app/core/aplication/use-cases/user-usecase/user-delete.useCase';
import { lastValueFrom } from 'rxjs';
import { AuthService } from 'src/app/core/infrastructure/http/interceptors/auth.service';
import { EditaRolComponent } from '../../floads/edita-rol-component/edita-rol-component';
import { RoleService } from 'src/app/core/infrastructure/services/effect/role.service';
import { SignalRService } from 'src/app/core/infrastructure/services/signalr/signal-r.service';

@Component({
  selector: 'app-card-user-component',
  imports: [CommonModule, ConfirmAlertComponent, EditaRolComponent],
  templateUrl: './card-user-component.html',
  styleUrl: './card-user-component.scss',
})
export class CardUserComponent {
  private deleteuser = inject(UserDeleteUseCase);
  private auth = inject(AuthService);
  private rol = inject(RoleService);
  private signalr = inject(SignalRService);

  user = input<UserEntity>();
  onEdit = output<UserEntity>();
  onDelete = output<UserEntity>();

  deleted = signal<boolean>(false);
  editarRol = signal<boolean>(false);
  userData = signal<UserEntity | undefined>(undefined);
  userRol = this.rol.rolState();

  constructor() {
    this.signalr.updateRol$.subscribe({
      next: (res: any) => {
        if (res.id === this.userData()?.id) {
          const current = this.userData();
          if (current) {
            this.userData.set({ ...current, rol: res.rol });
          }
        }
      },
    });
  }
  ngOnInit(): void {
    this.userData.set(this.user());
  }

  edit() {
    this.onEdit.emit(this.user()!);
  }

  onEditar(): void {
    this.editarRol.set(!this.editarRol());
  }

  ValidaUser(): boolean {
    return this.auth.getUserId() === this.user()?.id;
  }

  modalDelete() {
    this.deleted.set(true);
  }

  async respuesta($event: boolean) {
    this.deleted.set(false);
    if ($event === true) {
      await lastValueFrom(this.deleteuser.execute(this.user()?.id!));
      this.onDelete.emit(this.user()!);
    }
  }
}
