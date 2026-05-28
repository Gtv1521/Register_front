import { Component, inject, input, output, signal } from '@angular/core';
import {
  FormControl,
  ReactiveFormsModule,
  ɵInternalFormsSharedModule,
} from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { RoleService } from 'src/app/core/infrastructure/services/effect/role.service';
import { CargandoAccionComponent } from '../cargando-accion-component/cargando-accion-component';
import { lastValueFrom } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { UserUpdateRolUseCase } from 'src/app/core/aplication/use-cases/user-usecase/user-update-rol.useCase';

@Component({
  selector: 'app-edita-rol-component',
  imports: [
    ɵInternalFormsSharedModule,
    ReactiveFormsModule,
    MatIcon,
    CargandoAccionComponent,
  ],
  templateUrl: './edita-rol-component.html',
  styleUrl: './edita-rol-component.scss',
})
export class EditaRolComponent {
  private Role = inject(RoleService);
  private updateRole = inject(UserUpdateRolUseCase);

  rolActual = input<string>();
  idUser = input<string>();
  close = output<boolean>();

  userRole = this.Role.rolState();
  loader = signal<boolean>(false);
  rol = new FormControl('');

  ngOnInit(): void {
    this.rol.patchValue(this.rolActual()!);
  }

  closed(): void {
    this.close.emit(false);
  }

  async updateRol(): Promise<void> {
    if (this.rolActual() === this.rol.value) {
      this.closed();
      return;
    }

    try {
      this.loader.set(true);
      const response = await lastValueFrom(
        this.updateRole.execute(this.idUser()!, this.rol.value!),
      );
    } catch (error: HttpErrorResponse | any) {
      console.log(error);
    } finally {
      this.closed();
      this.loader.set(false);
    }
  }
}
