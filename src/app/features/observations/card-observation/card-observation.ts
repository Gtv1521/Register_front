import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { ObservationEntity } from 'src/app/core/domain/entitys/observation.entity';

@Component({
  selector: 'app-card-observation',
  imports: [MatIcon, DatePipe],
  templateUrl: './card-observation.html',
  styleUrl: './card-observation.scss',
})
export class CardObservation {
  @Input() Observation!: ObservationEntity;

  ngOnInit() {}
}
