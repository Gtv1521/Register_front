import { Component, inject, signal, viewChild } from '@angular/core';
import { Router, RouterOutlet, RouterLinkWithHref, RouterLinkActive } from '@angular/router';
import { AuthService } from 'src/app/core/infrastructure/http/interceptors/auth.service';
import { MatIcon } from "@angular/material/icon";
import { SigInFormComponent } from '../../forms/sig-in-form-component/sig-in-form-component';

@Component({
  selector: 'app-data-user-component',
  imports: [RouterOutlet, RouterLinkWithHref, MatIcon, RouterLinkActive],
  templateUrl: './data-user-component.html',
  styleUrl: './data-user-component.scss',
})
export class DataUserComponent {
  private auth = inject(AuthService);
  private route = inject(Router);

  Users = viewChild<SigInFormComponent>('usuarios');
  user = signal<string | null>( this.auth.getUserId());

  onVolver() {
    this.route.navigate(['dashboard']);
  }
}
