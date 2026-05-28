import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAdvertenciaComponent } from './new-advertencia-component';

describe('NewAdvertenciaComponent', () => {
  let component: NewAdvertenciaComponent;
  let fixture: ComponentFixture<NewAdvertenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewAdvertenciaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewAdvertenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
