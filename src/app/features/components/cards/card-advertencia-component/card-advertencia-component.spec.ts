import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardAdvertenciaComponent } from './card-advertencia-component';

describe('CardAdvertenciaComponent', () => {
  let component: CardAdvertenciaComponent;
  let fixture: ComponentFixture<CardAdvertenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardAdvertenciaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardAdvertenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
