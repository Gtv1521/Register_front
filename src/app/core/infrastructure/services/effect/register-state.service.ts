import { Injectable, signal } from '@angular/core';
import {
  EstadoRegistro,
  RegisterEntity,
} from 'src/app/core/domain/entitys/register.entity';

@Injectable({
  providedIn: 'root',
})
export class RegisterStateService {
  private _register = signal<RegisterEntity[]>([]);
  private _oneRegister = signal<RegisterEntity | undefined>(undefined);

  public registerState = this._register.asReadonly();
  public oneRegisterState = this._oneRegister.asReadonly();

  setRegisters(data: RegisterEntity[]) {
    this._register.set(data);
  }

  setOneRegister(data: RegisterEntity) {
    this._oneRegister.set(data);
  }

  /**
   * Actualiza cualquier propiedad del registro seleccionado
   * @param partialUpdate Un objeto con las propiedades a cambiar
   */
  updateSelectedRegister(partialUpdate: Partial<RegisterEntity>) {
    this._oneRegister.update((current) =>
      current ? { ...current, ...partialUpdate } : undefined,
    );
  }

  updateStatus(newState: EstadoRegistro) {
    this.updateSelectedRegister({ statusRegister: newState });
  }

  updateTotal(total: number) {
    this.updateSelectedRegister({ totalPagar: total });
  }

  updateAntisipo(antisipo: number) {
    this.updateSelectedRegister({ antisipo: antisipo });
  }

  clear() {
    this._register.set([]);
    this._oneRegister.set(undefined);
  }
}
