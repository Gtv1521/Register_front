import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login-component/login-component';
import { AuthComponent } from './features/auth/auth-component/auth-component';
import { SigInComponent } from './features/auth/sig-in-component/sig-in-component';
import { ResetComponent } from './features/auth/reset-component/reset-component';
import { DashboardLayout } from './features/dashboard/dashboard-layout/dashboard-layout';
import { NotFound } from './features/not-found/not-found';
import { SeeObservation } from './features/observations/see-observation/see-observation';
import { NewObservation } from './features/observations/new-observation/new-observation';
import { SessionsComponent } from './features/components/floads/sessions-component/sessions-component';
import { LogoutComponent } from './features/auth/logout-component/logout-component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: '',
    component: AuthComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'sigin', component: SigInComponent },
      { path: 'reset', component: ResetComponent },
    ],
  },
  { path: 'dashboard', component: DashboardLayout },
  { path: 'register/:id', component: DashboardLayout }, //  esta es la ruta para mostrar los registros
  { path: 'sessions/:id', component: SessionsComponent }, // esta es la ruta para mostrar las sesiones
  { path: 'dashboard/see-observation/:id', component: SeeObservation },
  { path: 'dashboard/new-observation/:registerId', component: NewObservation },
  { path: 'logout', component: LogoutComponent },
  { path: '**', component: NotFound },
];
