import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { SESSION_TOKEN } from './core/aplication/tokens/session.token';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { REGISTER_TOKEN } from './core/aplication/tokens/register.token';
import { UserHttpService } from './core/infrastructure/http/http-api/user-http.service';
import { USER_TOKEN } from './core/aplication/tokens/user.token';
import { SessionHttpService } from './core/infrastructure/http/http-api/session-http.service';
import { RegisterHttpService } from './core/infrastructure/http/http-api/register-http.service';
import { TokenInterceptor } from './core/infrastructure/http/interceptors/token.interceptor';
import { ObservationHttpService } from './core/infrastructure/http/http-api/observation-http.service';
import { OBSERVATION_TOKEN } from './core/aplication/tokens/observation.token';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withInterceptorsFromDi()),
    provideHttpClient(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
    { provide: SESSION_TOKEN, useClass: SessionHttpService }, // inyeccion de repository
    { provide: REGISTER_TOKEN, useClass: RegisterHttpService },
    { provide: USER_TOKEN, useClass: UserHttpService },
    provideRouter(routes),
  ],
    { provide: OBSERVATION_TOKEN, useClass: ObservationHttpService },
  ]
};
