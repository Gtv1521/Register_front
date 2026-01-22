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
import { ClientGetUseCase } from 'src/app/core/aplication/use-cases/client-useCase/client-get.useCase';
import { UserGetUseCase } from 'src/app/core/aplication/use-cases/user-usecase/user-get.useCase';
import { DatePipe } from '@angular/common';
import { PhonePipe } from "../../../core/infrastructure/http/pipes/phone-pipe";

type filterMode = 'todo' | 'Ultimos' | 'Primeros';

@Component({
  selector: 'app-see-observation',
  imports: [MatIconModule, CardObservation, FormsModule, DatePipe, PhonePipe],
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
    const registro = this.route.snapshot.paramMap.get('id');

    if (registro !== null) {
      await this.LoadRegister(registro);
      await this.LoadObservations(registro);
    }
  }

  async LoadObservations(registro: string) {
    this.observations.execute(registro, 1, 30).subscribe({
      next: (res) => (this.observationsList = res),
      error: (err) => console.log(err),
    });
  }

  // carga data
  async LoadRegister(register: string) {
    this.registers.execute(register).subscribe({
      next: (res) => {
        this.register = res;
        this.LoadClient(res.idClient);
      },
      error: (err) => console.log(err),
    });
  }

  // carga da cliente
  async LoadClient(cliente: string) {
    this.clients.execute(cliente).subscribe({
      next: (res) => {
        this.client = res;
      },
      error: (err) => console.log(err),
    });
  }

  async LoadUser(userId: string) {
    this.user.execute(userId).subscribe({
      next: (res) => (this.usuario = res),
      error: (err) => console.log(err),
    });
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
