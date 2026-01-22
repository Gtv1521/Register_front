import { Component, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { ObservartionGetAllUseCase } from 'src/app/core/aplication/use-cases/observation-usecase/observartionGetAll.useCase';
import { RegisterUseCase } from 'src/app/core/aplication/use-cases/register-usecase/register.useCase';
import { ClientEntity } from 'src/app/core/domain/entitys/client.entity';
import { ObservationEntity } from 'src/app/core/domain/entitys/observation.entity';
import { RegisterEntity } from 'src/app/core/domain/entitys/register.entity';
import { UserEntity } from 'src/app/core/domain/entitys/user.entity';
import { CardObservation } from '../card-observation/card-observation';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { ClientGetUseCase } from 'src/app/core/aplication/use-cases/client-useCase/client-get.useCase';
import { UserGetUseCase } from 'src/app/core/aplication/use-cases/user-usecase/user-get.useCase';
import { AuthService } from 'src/app/core/infrastructure/http/interceptors/auth.service';

type filterMode = 'todo' | 'Ultimos' | 'Primeros';

@Component({
  selector: 'app-see-observation',
  imports: [MatIconModule, CardObservation, FormsModule],
  templateUrl: './see-observation.html',
  styleUrl: './see-observation.scss',
})
export class SeeObservation implements OnInit {
  // llamado a los casos de uso
  private route = inject(ActivatedRoute);
  private observations = inject(ObservartionGetAllUseCase);
  private registers = inject(RegisterUseCase);
  private clients = inject(ClientGetUseCase);
  private user = inject(UserGetUseCase)
  private auth = inject(AuthService)

  // datos para usar en el formulario
  usuario: UserEntity | any;
  client: ClientEntity | any;
  register: RegisterEntity | any;
  observationsList: ObservationEntity[] = [];
  busqueda: string = '';
  filterActual: filterMode = 'todo';

  // funcion principal para la traida de datos
  async ngOnInit(): Promise<void> {
    const observationId = this.route.snapshot.paramMap.get('id');

    this.observationsList = await firstValueFrom(
      this.observations.execute(observationId!, 1, 30)
    );

    this.register = await firstValueFrom(
      this.registers.execute(this.observationsList[0].idRegister),
    );

    this.client = await firstValueFrom(
      this.clients.execute(this.register.idClient),
    );

    this.usuario = await firstValueFrom(
      this.user.execute(`${this.auth.getUserId()}`),

    );

  }
  goBack(): void {
    window.history.back();
  }
  onBuscar(): void {
    this.filterActual = 'Primeros';
  }

  onVerTodos(): void {
    this.filterActual = 'todo';
    this.busqueda = '';
  }
  onVerUltimos(): void {
    this.filterActual = 'Ultimos';
    this.busqueda = '';
  }
  onVerPrimeros(): void {
    this.filterActual = 'Primeros';
    this.busqueda = '';
  }
}

