import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MensajesFijosComponent } from './mensajes-fijos-component';

describe('MensajesFijosComponent', () => {
  let component: MensajesFijosComponent;
  let fixture: ComponentFixture<MensajesFijosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MensajesFijosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MensajesFijosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
