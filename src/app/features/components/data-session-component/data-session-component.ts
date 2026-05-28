import { DatePipe } from '@angular/common';
import { Component, inject, input, output, signal } from '@angular/core';
import { SessionInfo } from 'src/app/core/domain/entitys/session.entity';
import { LoaderComponent } from '../floads/loader-component/loader-component';
import { AuthService } from 'src/app/core/infrastructure/http/interceptors/auth.service';

@Component({
  selector: 'app-data-session-component',
  imports: [DatePipe, LoaderComponent],
  templateUrl: './data-session-component.html',
  styleUrl: './data-session-component.scss',
})
export class DataSessionComponent {
  private auth = inject(AuthService);

  // data padre
  session = input<SessionInfo>(); // data session
  user = input<string | null>(null); // id user
  close = output<string>();

  // estados
  loaderLogout = signal<boolean>(false);
  sessionOn = signal<boolean>(false);

  ngOnInit(): void {
    this.sessionOn.set(this.session()?.id === this.auth.sessionId());
  }
  onLogout(arg0: string | undefined) {
    if (typeof arg0 === 'string') {
      this.close.emit(arg0);
      this.loaderLogout.set(true);
    }
  }
}
