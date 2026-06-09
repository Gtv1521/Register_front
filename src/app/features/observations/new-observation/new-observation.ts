import { Component, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ObservationCreateUseCase } from 'src/app/core/aplication/use-cases/observation-usecase/observation-create.useCase';
import { firstValueFrom } from 'rxjs';
import {
  Imagen,
  ObservationEntity,
} from 'src/app/core/domain/entitys/observation.entity';
import { AuthService } from 'src/app/core/infrastructure/http/interceptors/auth.service';
import { ObservationRequestDto } from 'src/app/core/infrastructure/dto/request/observation/observation-request.dto';
import { LIST_TYPE } from 'src/app/core/domain/reusables/estados.constant';
import { types } from 'src/app/core/domain/entitys/observation.entity';
import { UpperCaseConstant } from 'src/app/core/domain/reusables/upper-case.constant';
import { CargandoAccionComponent } from '../../components/floads/cargando-accion-component/cargando-accion-component';
import { ObservationUpdateUseCase } from 'src/app/core/aplication/use-cases/observation-usecase/observation-update.useCase';

@Component({
  selector: 'app-observation-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    CargandoAccionComponent,
  ],
  templateUrl: './new-observation.html',
  styleUrl: './new-observation.scss',
})
export class NewObservation {
  readonly estados = LIST_TYPE;

  // servicios
  private fb = inject(FormBuilder);
  private observationService = inject(ObservationCreateUseCase);
  private updateObservation = inject(ObservationUpdateUseCase);
  private auth = inject(AuthService);
  private upperCase = inject(UpperCaseConstant);

  IdRegister = input<string | null>();
  onRegister = input<boolean>();
  ChangeData = input<ObservationEntity>();
  OnEditar = input<boolean>();
  CloseModal = output<boolean>();
  ChangeEditar = output<boolean>();
  NewObservationCreated = output<ObservationEntity>();

  // datos
  photos: File[] = [];
  photoPreviews = signal<string[]>([]);
  PhotoSave = signal<Imagen[]>([]);
  userId = this.auth.getUserId();
  responseData!: string; // respuesta de la peticion
  loader = signal<boolean>(false);
  listPhotosDelete = signal<string[]>([]);

  //datos del formulario
  form = this.fb.group({
    description: ['', [Validators.required, Validators.minLength(10)]],
    type: ['', Validators.required],
    notificaEmail: [false],
    notificaWhatsapp: [false],
  });

  ngOnInit(): void {
    if (this.OnEditar()) {
      this.llenaData();
    }
  }

  llenaData(): void {
    this.form.patchValue({
      description: this.ChangeData()?.description,
      type: this.ChangeData()?.type,
    });

    if (this.ChangeData()?.photos?.length! > 0) {
      this.ChangeData()?.photos?.forEach((data) => {
        this.PhotoSave.update((lista) => [
          ...lista,
          { id: data.id, photo: data.photo },
        ]);
      });
    }
  }

  onPhotosSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files) return;
    Array.from(input.files).forEach((file) => {
      this.photos.push(file);

      const previewUrl = URL.createObjectURL(file);
      this.photoPreviews.update((previews) => [...previews, previewUrl]);
    });
  }

  removePhoto(index: number) {
    this.photos.splice(index, 1);
    this.photoPreviews.update((previews) =>
      previews.filter((_, i) => i !== index),
    );
  }

  OnDeletePhoto(id: string | null, index: number): void {
    if (id) {
      this.listPhotosDelete.update((lista) => [...lista, id]);
    }
    this.PhotoSave.update((lista) => lista.filter((_, i) => i !== index));
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
      event.preventDefault();

      const textarea = event.target as HTMLTextAreaElement;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const spaces = '  ';

      textarea.value =
        textarea.value.substring(0, start) +
        spaces +
        textarea.value.substring(end);

      textarea.selectionStart = textarea.selectionEnd = start + spaces.length;

      this.form.get('description')?.setValue(textarea.value);
    }
  }

  async OnCreate(): Promise<void> {
    if (!this.valid()) {
      return;
    }

    try {
      this.loader.set(true);
      const formData = await this.obtenerDatos(this.IdRegister()!);

      const response: any = await firstValueFrom(
        this.observationService.execute(formData),
      );
      this.responseData = response;

      // Construir el objeto ObservationEntity completo con el ID retornado
      const newObservation: ObservationEntity = {
        id: response.id!, // El ID retornado por el backend
        idRegister: this.IdRegister()!,
        type: this.form.value.type!,
        description: this.form.value.description!,
        idUser: this.userId!,
        createdAt: new Date(),
        photos: this.photoPreviews().map((preview, index) => ({
          photo: preview,
          id: `${index}`,
        })),
      };

      // Emitir la nueva observación con todos los datos
      this.NewObservationCreated.emit(newObservation);
    } catch (error) {
      throw error;
    } finally {
      this.loader.set(false);
      this.ChangeEditar.emit(false);
      this.CloseModal.emit(false);
    }
  }

  async OnEdit(): Promise<void> {
    if (!this.valid()) {
      return;
    }

    const data = this.form.getRawValue();
    const setValues: ObservationRequestDto = {
      id: this.                           ChangeData()?.id!,
      IdRegister: this.ChangeData()?.idRegister!,
      Type: data.type! as types,
      Description: this.upperCase.formatParagraphs(data.description!),
      IdUser: this.ChangeData()?.idUser!,
      NotificaEmail: data?.notificaEmail!,
      NotificaWhatsapp: data?.notificaWhatsapp!,
      Photos: this.photoPreviews().length > 0 ? this.photos : [],
      listPhotosDelete: this.listPhotosDelete(),
    };

    try {
      this.loader.set(true);
      await firstValueFrom(this.updateObservation.execute(setValues));
    } catch (error) {
      throw error;
    } finally {
      this.loader.set(false);
      this.ChangeEditar.emit(false);
      this.CloseModal.emit(false);
    }
  }

  async onSubmit(): Promise<void> {
    if (!this.OnEditar()) {
      await this.OnCreate();
    } else {
      this.OnEdit();
    }
  }
}
