import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoaderSessionComponent } from './loader-session-component';

describe('LoaderSessionComponent', () => {
  let component: LoaderSessionComponent;
  let fixture: ComponentFixture<LoaderSessionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoaderSessionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoaderSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
