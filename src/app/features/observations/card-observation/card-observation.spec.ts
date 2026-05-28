import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardObservation } from './card-observation';

describe('CardObservation', () => {
  let component: CardObservation;
  let fixture: ComponentFixture<CardObservation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardObservation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardObservation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
