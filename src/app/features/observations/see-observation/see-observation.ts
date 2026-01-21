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

type filterMode = 'todo' | 'Ultimos' | 'Primeros';

@Component({
  selector: 'app-see-observation',
  imports: [MatIconModule, CardObservation, FormsModule],
  templateUrl: './see-observation.html',
  styleUrl: './see-observation.scss',
})
export class SeeObservation implements OnInit {
  private route = inject(ActivatedRoute);
  private observations = inject(ObservartionGetAllUseCase);
  private registers = inject(RegisterUseCase);
  private clients = inject(ClientGetUseCase);
  // private user = inject(RegisterUseCase);
  // usuario: UserEntity | any;
  client: ClientEntity | any;
  register: RegisterEntity | any;
  observationsList: ObservationEntity[] = [];
  busqueda: string = '';
  filterActual: filterMode = 'todo';

  async ngOnInit(): Promise<void> {
    const observationId = this.route.snapshot.paramMap.get('id');

    this.observationsList = await firstValueFrom(
      this.observations.execute(observationId!, 1, 30)
    );

    if (this.observationsList.length > 0 && this.observationsList[0].idRegister) {
      console.log('ID de registro obtenido:', this.observationsList[0].idRegister);

      this.register = await firstValueFrom(
        this.registers.execute(this.observationsList[0].idRegister),
      );
      console.log('Registro obtenido:', this.register);
      this.client = await firstValueFrom(
        this.clients.execute(this.register.idClient),
      );
      console.log('Cliente obtenido:', this.client);
    }




    // this.user.execute(this.register.idUser).subscribe({
    //   next: res => {
    //     this.usuario = res;
    //     console.log('Usuario obtenido:', this.usuario);
    //   },
    //   error: err => console.error(err),
    // });
    // faltante obtener cliente

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

