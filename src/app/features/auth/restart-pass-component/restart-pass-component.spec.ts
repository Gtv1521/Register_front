import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestartPassComponent } from './restart-pass-component';

describe('RestartPassComponent', () => {
  let component: RestartPassComponent;
  let fixture: ComponentFixture<RestartPassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RestartPassComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RestartPassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
