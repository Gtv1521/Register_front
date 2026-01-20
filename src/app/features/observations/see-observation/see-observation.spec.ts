import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeeObservation } from './see-observation';

describe('SeeObservation', () => {
  let component: SeeObservation;
  let fixture: ComponentFixture<SeeObservation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeeObservation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeeObservation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
