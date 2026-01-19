import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { SESSION_TOKEN } from './core/aplication/tokens/session.token';
import { SessionHttpService } from './core/infrastructure/http/http-api/session-http.service';
import { provideHttpClient } from '@angular/common/http';
import { RegisterHttpService } from './core/infrastructure/http/http-api/register-http.service';
import { REGISTER_TOKEN } from './core/aplication/tokens/register.token';
import { UserHttpService } from './core/infrastructure/http/http-api/user-http.service';
import { USER_TOKEN } from './core/aplication/tokens/user.token';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    { provide: SESSION_TOKEN, useClass: SessionHttpService }, // inyeccion de repository
    { provide: REGISTER_TOKEN, useClass: RegisterHttpService },
    { provide: USER_TOKEN, useClass: UserHttpService },
  ]
};
