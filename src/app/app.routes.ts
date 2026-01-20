import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login-component/login-component';
import { AuthComponent } from './features/auth/auth-component/auth-component';
import { SigInComponent } from './features/auth/sig-in-component/sig-in-component';
import { ResetComponent } from './features/auth/reset-component/reset-component';
import { DashboardLayout } from './features/dashboard/dashboard-layout/dashboard-layout';
import { NotFound } from './features/not-found/not-found';
import { SeeObservation } from './features/observations/see-observation/see-observation';

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
  { path: '**', component: NotFound },
  { path: 'dashboard/see-observation/:id', component: SeeObservation },


];
