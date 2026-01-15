import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login-component/login-component';
import { AuthComponent } from './features/auth/auth-component/auth-component';
import { SigInComponent } from './features/auth/sig-in-component/sig-in-component';
import { ResetComponent } from './features/auth/reset-component/reset-component';
import { DashboardLayout } from './features/dashboard/dashboard-layout/dashboard-layout';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: '',
    component: AuthComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'sigin', component: SigInComponent },
      { path: 'reset', component: ResetComponent },
      { path: 'dashboard', component: DashboardLayout },
    ],
  },


];
