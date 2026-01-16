import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { SESSION_TOKEN } from './core/aplication/tokens/session.token';
import { SessionHttpService } from './core/infrastructure/http/http-api/session-http.service';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(), 
    {provide: SESSION_TOKEN, useClass: SessionHttpService} // inyeccion de repository 
  ]
};
