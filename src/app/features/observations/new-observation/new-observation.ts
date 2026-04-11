import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ObservationCreateUseCase } from 'src/app/core/aplication/use-cases/observation-usecase/observation-create.useCase';
import { firstValueFrom } from 'rxjs';
import { ObservationEntity } from 'src/app/core/domain/entitys/observation.entity';
import { AuthService } from 'src/app/core/infrastructure/http/interceptors/auth.service';
import { ObservationRequestDto } from 'src/app/core/infrastructure/dto/request/observation/observation-request.dto';
import { LIST_TYPE } from 'src/app/core/domain/reusables/estados.constant';
import { types } from 'src/app/core/domain/entitys/observation.entity';
import { UpperCaseConstant } from 'src/app/core/domain/reusables/upper-case.constant';
// const statusMap: Record<string, number> = {
//   PENDIENTE: 0,
//   EN_PROCESO: 1,
//   COMPLETADO: 2,
//   CANCELADO: 3,
// };

@Component({
  selector: 'app-observation-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './new-observation.html',
  styleUrl: './new-observation.scss',
})
export class NewObservation {
  readonly estados = LIST_TYPE;
  
  // servicios
  private fb = inject(FormBuilder);
  private observationService = inject(ObservationCreateUseCase);
  private auth = inject(AuthService);
  private upperCase = inject(UpperCaseConstant);

  @Input() IdRegister: string | null = null;
  @Input() onRegister: boolean = false;
  @Output() CloseModal = new EventEmitter<boolean>();
  @Output() ChangeEditar = new EventEmitter<boolean>();
  @Output() NewObservationCreated = new EventEmitter<ObservationEntity>();

  // datos
  photos: File[] = [];
  photoPreviews: string[] = [];
  userId = this.auth.getUserId();
  responseData!: string; // respuesta de la peticion
  loader: boolean = false;

  //datos del formulario
  form = this.fb.group({
    description: ['', [Validators.required, Validators.minLength(10)]],
    type: ['', Validators.required],
    notificaEmail: [false],
    notificaWhatsapp: [false],
  });

  onPhotosSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files) return;

    Array.from(input.files).forEach((file) => {
      this.photos.push(file);

      const previewUrl = URL.createObjectURL(file);
      this.photoPreviews.push(previewUrl);
    });
  }

  removePhoto(index: number) {
    this.photos.splice(index, 1);
    this.photoPreviews.splice(index, 1);
  }

  cancelar(): void {
    this.CloseModal.emit(false);
  }

  public valid(): boolean {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return false;
    }
    return true;
  }

  // Esta es la función que usará el Padre
  public async obtenerDatos(
    idregister: string,
  ): Promise<ObservationRequestDto> {
    return {
      id: null!, // El ID se generará en el backend
      IdRegister: idregister,
      IdUser: this.userId!,
      Type: this.form.value.type! as types,
      Description: this.upperCase.formatParagraphs(
        this.form.value.description!,
      ),
      NotificaEmail: this.form.value.notificaEmail!,
      NotificaWhatsapp: this.form.value.notificaWhatsapp!,
      Photos: this.photos,
    };
  }

  handleTab(event: KeyboardEvent) {
    if (event.key === 'Tab') {
      event.preventDefault(); // Evita que el cursor salte al siguiente input

      const textarea = event.target as HTMLTextAreaElement;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const spaces = '  '; // Aquí defines cuántos espacios o qué caracteres insertar

      // 1. Modificamos el valor del texto insertando los espacios en la posición del cursor
      textarea.value =
        textarea.value.substring(0, start) +
        spaces +
        textarea.value.substring(end);

      // 2. Reposicionamos el cursor justo después de los espacios insertados
      textarea.selectionStart = textarea.selectionEnd = start + spaces.length;

      // 3. Importante: Si usas Reactive Forms, hay que avisarle al control que el valor cambió
      this.form.get('description')?.setValue(textarea.value);
    }
  }

  async onSubmit(): Promise<void> {
    if (!this.valid()) {
      return;
    }

    try {
      this.loader = true;
      const formData = await this.obtenerDatos(this.IdRegister!);

      const response: any = await firstValueFrom(
        this.observationService.execute(formData),
      );
      this.responseData = response;
      
      // Construir el objeto ObservationEntity completo con el ID retornado
      const newObservation: ObservationEntity = {
        id: response.id!, // El ID retornado por el backend
        idRegister: this.IdRegister!,
        type: this.form.value.type!,
        description: this.form.value.description!,
        idUser: this.userId!,
        createdAt: new Date(),
        photos: this.photoPreviews.map((preview, index) => ({
          photo: preview,
          id: `${index}`,
        })),
      };
      
      // Emitir la nueva observación con todos los datos
      this.NewObservationCreated.emit(newObservation);
    } catch (error) {
      throw error;
    } finally {
      this.loader = false;
      this.ChangeEditar.emit(false);
      this.CloseModal.emit(false);
    }
  }
}
