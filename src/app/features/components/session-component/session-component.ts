import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/infrastructure/http/interceptors/auth.service';

@Component({
  selector: 'app-session-component',
  imports: [],
  templateUrl: './session-component.html',
  styleUrl: './session-component.css',
})
export class SessionComponent {
  private auth = inject(AuthService);
  private route = inject(Router);

  ngOnInit() {
    if (this.auth.getSession() == null) {
      this.route.navigate(['/login']);
    }
  }
}
