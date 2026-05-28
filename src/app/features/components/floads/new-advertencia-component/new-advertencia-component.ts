import {
  Component,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdvertenciasCreateUseCase } from 'src/app/core/aplication/use-cases/advertencias-useCase/advertencias-create.useCase';
import { AdvertenciasUpdateUseCase } from 'src/app/core/aplication/use-cases/advertencias-useCase/advertencias-update.useCase';
import { AdvertenciaEntity } from 'src/app/core/domain/entitys/advertencia.entity';
import { AuthService } from 'src/app/core/infrastructure/http/interceptors/auth.service';
import { lastValueFrom } from 'rxjs';
import { AdvertenciaRequestDto } from 'src/app/core/infrastructure/dto/request/advertencia/advertencia-request.dto';
import { CargandoAccionComponent } from '../cargando-accion-component/cargando-accion-component';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-new-advertencia-component',
  imports: [MatIconModule, ReactiveFormsModule, CargandoAccionComponent],
  templateUrl: './new-advertencia-component.html',
  styleUrl: './new-advertencia-component.scss',
})
export class NewAdvertenciaComponent {
  private auth = inject(AuthService);
  private newAdvertencia = inject(AdvertenciasCreateUseCase);
  private editaAdvertencia = inject(AdvertenciasUpdateUseCase);

  data = input<AdvertenciaEntity>();
  editar = input<boolean>(false);
  close = output<boolean>();

  loaderCreated = signal<boolean>(false);
  loaderUpdate = signal<boolean>(false);

  Efecto = effect(() => {
    if (this.editar()) {
      this.llenarData();
    } else {
      this.warn.reset();
    }
  });

  warn = new FormControl('', [Validators.required]);

  OnClose(): void {
    this.close.emit(false);
  }

  llenarData(): void {
    this.warn.patchValue(this.data()?.advertencia!);
  }

  OnSubir(): void {
    this.warn.markAsTouched();
    if (this.editar()) {
      this.editarAdvertencia();
    } else {
      this.creaAdvertencia();
    }
  }

  async creaAdvertencia(): Promise<void> {
    const datos = this.warn.getRawValue();

    let dto: AdvertenciaRequestDto = {
      id: this.data()?.id ?? '',
      idCompany: this.data()?.idCompany ?? this.auth.companyId()!,
      advertencia: datos!,
    };

    try {
      this.loaderCreated.set(true);
      await lastValueFrom(this.newAdvertencia.execute(dto));
      this.close.emit(false);
    } catch (error: any) {
      console.error('Hubo un error en la API:', error);

      if (error.status === 400) {
        console.log(error);
      }
    } finally {
      this.loaderCreated.set(false);
    }
  }

  async editarAdvertencia(): Promise<void> {
    const data = this.warn.getRawValue();
    try {
      if (data === this.data()?.advertencia) {
        this.close.emit(false);
        return;
      }

      const dto: AdvertenciaRequestDto = {
        id: this.data()?.id!,
        idCompany: this.auth.companyId()!,
        advertencia: data!,
      };

      this.loaderUpdate.set(true);
      await lastValueFrom(this.editaAdvertencia.execute(dto));
      this.close.emit(false);
    } catch (error) {
      console.error('Hubo un error en la API:', error);
    } finally {
      this.loaderUpdate.set(false);
    }
  }
}
