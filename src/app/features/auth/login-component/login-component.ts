import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login-component',
  imports: [ReactiveFormsModule],
  templateUrl: './login-component.html',
  styleUrl: './login-component.scss',
})
export class LoginComponent {
  estado: boolean = false;

  private router = inject(Router);
  private fb = inject(FormBuilder);


  login = this.fb.group({
    email: ['',[Validators.email, Validators.required]],
    password: [ '', [Validators.required, Validators.minLength(8)]]
  })

  togglePassword() {
    this.estado = !this.estado;
  }

  goSigIn() {
    this.router.navigate(['/sigin']);
  }

  goReset() {
    this.router.navigate(['/reset'])
  }

  onSubmit(){
    if (this.login.valid) {
      const data = this.login.value;

      console.log(data.email, data.password);
    }
  }
}
