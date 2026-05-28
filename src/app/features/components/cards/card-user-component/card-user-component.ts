import { Component, input, output, signal } from '@angular/core';
import { UserEntity } from 'src/app/core/domain/entitys/user.entity';
import { CommonModule } from '@angular/common';
import { ConfirmAlertComponent } from '../../floads/confirm-alert-component/confirm-alert-component';
import { UserDeleteUseCase } from 'src/app/core/aplication/use-cases/user-usecase/user-delete.useCase';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-card-user-component',
  imports: [CommonModule, ConfirmAlertComponent],
  templateUrl: './card-user-component.html',
  styleUrl: './card-user-component.scss',
})
export class CardUserComponent {
  constructor(private deleteuser: UserDeleteUseCase) {}

  user = input<UserEntity>();
  onEdit = output<UserEntity>();
  onDelete = output<UserEntity>();

  Delete = signal<boolean>(false);

  edit() {
    this.onEdit.emit(this.user()!);
  }

  modalDelete() {
    this.Delete.set(true);
  }

  async respuesta($event: boolean) {
    this.Delete.set(false);
    if ($event === true) {
      await lastValueFrom(this.deleteuser.execute(this.user()?.id!));
      this.onDelete.emit(this.user()!);
    }
  }
}
