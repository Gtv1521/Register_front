import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewObservation } from './new-observation';

describe('NewObservation', () => {
  let component: NewObservation;
  let fixture: ComponentFixture<NewObservation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewObservation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewObservation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
