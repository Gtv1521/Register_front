import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalImege } from './modal-imege';

describe('ModalImege', () => {
  let component: ModalImege;
  let fixture: ComponentFixture<ModalImege>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalImege]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalImege);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
