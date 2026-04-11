import { DatePipe } from '@angular/common';
import { Component, input, output, signal } from '@angular/core';
import {
  SessionInfo,
} from 'src/app/core/domain/entitys/session.entity';
import { LoaderComponent } from '../floads/loader-component/loader-component';

@Component({
  selector: 'app-data-session-component',
  imports: [DatePipe, LoaderComponent],
  templateUrl: './data-session-component.html',
  styleUrl: './data-session-component.scss',
})
export class DataSessionComponent {
  // data padre
  session = input<SessionInfo>(); // data session
  close = output<string>();

  // estados
  loaderLogout = signal<boolean>(false);

  onLogout(arg0: string | undefined) {
    if (typeof arg0 === 'string') {
      this.close.emit(arg0);
      this.loaderLogout.set(true);
    }
  }
}
