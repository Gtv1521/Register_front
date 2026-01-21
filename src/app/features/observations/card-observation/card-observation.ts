import { Component, Input } from '@angular/core';
import { MatIcon } from "@angular/material/icon";


@Component({
  selector: 'app-card-observation',
  imports: [MatIcon],
  templateUrl: './card-observation.html',
  styleUrl: './card-observation.scss',
})
export class CardObservation {
  @Input() Observation: any;

  ngOnInit() {
  }
}
