import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditaRolComponent } from './edita-rol-component';

describe('EditaRolComponent', () => {
  let component: EditaRolComponent;
  let fixture: ComponentFixture<EditaRolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditaRolComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditaRolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
