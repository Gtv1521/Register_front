import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ObservartionGetAllUseCase } from 'src/app/core/aplication/use-cases/observation-usecase/observartionGetAll.useCase';
import { ObservationEntity } from 'src/app/core/domain/entitys/observation.entity';

@Component({
  selector: 'app-see-observation',
  imports: [],
  templateUrl: './see-observation.html',
  styleUrl: './see-observation.scss',
})
export class SeeObservation implements OnInit {
  private route = inject(ActivatedRoute);
  private observations = inject(ObservartionGetAllUseCase);
  observationsList: ObservationEntity[] = [];

  ngOnInit(): void {
    const observationId = this.route.snapshot.paramMap.get('id');
    console.log('ID de la observación:', observationId);
    this.observations.execute(observationId!, 1, 30).subscribe({
      next: res => {
        this.observationsList = res;
        console.log('Observaciones obtenidas:', res);
      },
      error: err => console.error(err),
    });

  }
}

