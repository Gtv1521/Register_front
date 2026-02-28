import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LogOutService } from 'src/app/core/infrastructure/services/_/log-out.service';

@Component({
  selector: 'app-logout-component',
  imports: [],
  templateUrl: './logout-component.html',
  styleUrl: './logout-component.scss',
})
export class LogoutComponent {
  private router = inject(Router);
  private states = inject(LogOutService);
  ngOnInit() {
    setTimeout(() => {
      this.states.close();
      this.router.navigate(['login']);
    }, 1000);
  }
}
