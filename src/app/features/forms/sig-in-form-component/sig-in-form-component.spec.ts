import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SigInFormComponent } from './sig-in-form-component';

describe('SigInFormComponent', () => {
  let component: SigInFormComponent;
  let fixture: ComponentFixture<SigInFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SigInFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SigInFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
