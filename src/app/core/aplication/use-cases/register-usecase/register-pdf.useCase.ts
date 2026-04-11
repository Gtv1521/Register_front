import { Inject, Injectable } from '@angular/core';
import { REGISTER_TOKEN } from '../../tokens/register.token';
import { IRegistro } from 'src/app/core/domain/interfaces/ICrud';
import { RegisterRequestDto } from 'src/app/core/infrastructure/dto/request/register/register-request.dto';
import { RegisterEntity } from 'src/app/core/domain/entitys/register.entity';
import { map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RegisterPdfUseCase {
  constructor(
    @Inject(REGISTER_TOKEN)
    private repo: IRegistro<RegisterRequestDto, RegisterEntity>,
  ) {}

  execute(id: string) {
    return this.repo.downloadPdf(id).pipe(
      map((res) => {
        // Creamos la URL temporal para el Blob
        const url = URL.createObjectURL(res.blob);
        return { url, filename: res.filename };
      }),
    );
  }
}
