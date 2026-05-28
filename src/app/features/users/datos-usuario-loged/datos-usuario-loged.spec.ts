import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosUsuarioLoged } from './datos-usuario-loged';

describe('DatosUsuarioLoged', () => {
  let component: DatosUsuarioLoged;
  let fixture: ComponentFixture<DatosUsuarioLoged>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatosUsuarioLoged]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatosUsuarioLoged);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
