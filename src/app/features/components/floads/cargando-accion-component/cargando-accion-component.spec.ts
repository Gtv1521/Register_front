import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargandoAccionComponent } from './cargando-accion-component';

describe('CargandoAccionComponent', () => {
  let component: CargandoAccionComponent;
  let fixture: ComponentFixture<CargandoAccionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CargandoAccionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CargandoAccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
