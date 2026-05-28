import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRolComponet } from './edit-rol-componet';

describe('EditRolComponet', () => {
  let component: EditRolComponet;
  let fixture: ComponentFixture<EditRolComponet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditRolComponet]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditRolComponet);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
