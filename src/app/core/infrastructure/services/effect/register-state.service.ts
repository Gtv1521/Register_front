import { Injectable, signal } from '@angular/core';
import { RegisterEntity } from 'src/app/core/domain/entitys/register.entity';

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

  clear() {
    this._register.set([]);
    this._oneRegister.set(undefined);
  }
}
