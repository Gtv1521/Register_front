import { Component, inject, signal } from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { AuthService } from 'src/app/core/infrastructure/http/interceptors/auth.service';

@Component({
  selector: 'app-users-component',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, MatIcon],
  templateUrl: './users-component.html',
  styleUrl: './users-component.scss',
})
export class UsersComponent {
  private router = inject(Router);
  private auth = inject(AuthService);

  company = signal<string>('');

  ngOnInit(): void {
    this.company.set(this.auth.companyId()!);
  }

  onBack() {
    this.router.navigate(['dashboard']);
  }
}
