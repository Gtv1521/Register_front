import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormUsuarioComponent } from './form-usuario.component';

describe('FormUsuarioComponent', () => {
  let component: FormUsuarioComponent;
  let fixture: ComponentFixture<FormUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ FormUsuarioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty form', () => {
    expect(component.usuarioForm.get('name')?.value).toBe('');
    expect(component.usuarioForm.get('email')?.value).toBe('');
    expect(component.usuarioForm.get('password')?.value).toBe('');
  });

  it('should initialize emailExiste as false', () => {
    expect(component.emailExiste).toBeFalsy();
  });

  it('should validate required fields', () => {
    const form = component.usuarioForm;
    expect(form.valid).toBeFalsy();
    
    form.patchValue({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      confPassword: 'password123',
      rol: 'Administrador'
    });

    expect(form.valid).toBeTruthy();
  });

  it('should call onSubmit when form is valid and email does not exist', async () => {
    spyOn(console, 'log');
    const form = component.usuarioForm;
    component.emailExiste = false;
    
    form.patchValue({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      confPassword: 'password123',
      rol: 'Administrador'
    });

    await component.onSubmit();
    expect(console.log).toHaveBeenCalled();
  });

  it('should not call onSubmit when email exists', async () => {
    spyOn(console, 'log');
    const form = component.usuarioForm;
    component.emailExiste = true;
    
    form.patchValue({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      confPassword: 'password123',
      rol: 'Administrador'
    });

    await component.onSubmit();
    expect(console.log).not.toHaveBeenCalled();
  });

  it('should reset form on onReset', () => {
    const form = component.usuarioForm;
    form.patchValue({
      name: 'John Doe',
      email: 'john@example.com'
    });

    component.onReset();
    expect(form.get('name')?.value).toBeNull();
    expect(form.get('email')?.value).toBeNull();
  });
});
