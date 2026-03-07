import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataCompanyComponent } from './data-company-component';

describe('DataCompanyComponent', () => {
  let component: DataCompanyComponent;
  let fixture: ComponentFixture<DataCompanyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataCompanyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
