import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataSessionComponent } from './data-session-component';

describe('DataSessionComponent', () => {
  let component: DataSessionComponent;
  let fixture: ComponentFixture<DataSessionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataSessionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
