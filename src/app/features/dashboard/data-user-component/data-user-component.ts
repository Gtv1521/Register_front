import { Component, inject, signal, ViewChild } from '@angular/core';
import { SigInFormComponent } from '../../forms/sig-in-form-component/sig-in-form-component';
import { UserGetUseCase } from 'src/app/core/aplication/use-cases/user-usecase/user-get.useCase';
import { lastValueFrom } from 'rxjs';
import { UserEntity } from 'src/app/core/domain/entitys/user.entity';
import { Router } from '@angular/router';

@Component({
  selector: 'app-data-user-component',
  imports: [SigInFormComponent],
  templateUrl: './data-user-component.html',
  styleUrl: './data-user-component.scss',
})
export class DataUserComponent {
  private getUser = inject(UserGetUseCase);
  private route = inject(Router);
  @ViewChild('usuarios') Users!: SigInFormComponent;

  user = signal<UserEntity | null>(null);

  async ngOnInit() {
    const userResponse = await lastValueFrom(this.getUser.execute());
    this.user.set(userResponse);
    this.onllenar();
  }

  onllenar() {
    this.Users.onInsertData(this.user()!);
  }

  onVolver() {
    this.route.navigate(['dashboard']);
  }

  onSubmit() {}
}
