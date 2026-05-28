import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login-component/login-component';
import { AuthComponent } from './features/auth/auth-component/auth-component';
import { SigInComponent } from './features/auth/sig-in-component/sig-in-component';
import { ResetComponent } from './features/auth/reset-component/reset-component';
import { DashboardLayout } from './features/dashboard/dashboard-layout/dashboard-layout';
import { NotFound } from './features/no-range/not-found/not-found';
import { SeeObservation } from './features/observations/see-observation/see-observation';
import { SessionsComponent } from './features/components/floads/sessions-component/sessions-component';
import { LogoutComponent } from './features/auth/logout-component/logout-component';
import { CompaniesComponent } from './features/dashboard/companies-component/companies-component';
import { DataCompanyComponent } from './features/dashboard/data-company-component/data-company-component';
import { Rol } from './core/infrastructure/dto/request/sig-in-request.dto';
import { roleGuard } from './core/infrastructure/services/permisos/role-guard';
import { NoAccessComponent } from './features/no-range/no-access-component/no-access-component';
import { NewUserComponent } from './features/components/new-user-component/new-user-component';
import { ThemeComponent } from './features/components/theme-component/theme-component';
import { NewRegisterComponent } from './features/components/new-register-component/new-register-component';
import { qrAccessGuard } from './core/infrastructure/services/permisos/qr-access.guard';
import { OfflineComponent } from './features/no-range/offline-component/offline-component';
import { DatosUsuarioLoged } from './features/users/datos-usuario-loged/datos-usuario-loged';
import { EditRolComponet } from './features/users/edit-rol-componet/edit-rol-componet';
import { UsersComponent } from './features/users/users-component/users-component';
import { DataUserComponent } from './features/users/data-user-component/data-user-component';
import { MensajesFijosComponent } from './features/users/mensajes-fijos-component/mensajes-fijos-component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
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
  {
    path: 'registro/:id',
    component: SeeObservation,
    canActivate: [qrAccessGuard],
  },
  { path: 'new-registro', component: NewRegisterComponent },
  { path: 'logout', component: LogoutComponent },
  {
    path: 'user',
    component: DataUserComponent,
    children: [
      { path: '', redirectTo: 'data/:id', pathMatch: 'full' },
      { path: 'data/:id', component: DatosUsuarioLoged },
      { path: 'sessions/:id', component: SessionsComponent },
    ],
  },
  {
    path: 'users',
    component: UsersComponent,
    canActivate: [roleGuard],
    data: { roles: [Rol.Administrador, Rol.Super] },
    children: [
      { path: '', redirectTo: 'edit', pathMatch: 'full' },
      { path: 'edit', component: EditRolComponet },
      { path: 'add', component: NewUserComponent },
      { path: 'fijados', component: MensajesFijosComponent },
      {
        path: 'company/:id',
        component: DataCompanyComponent,
        canActivate: [roleGuard],
        data: { roles: [Rol.Administrador, Rol.Super] },
      },
    ],
  },
  { path: 'theme', component: ThemeComponent },
  {
    path: 'componies',
    component: CompaniesComponent,
    canActivate: [roleGuard],
    data: { roles: [Rol.Administrador, Rol.Super] },
  },
  { path: 'no-access', component: NoAccessComponent },
  { path: 'offline', component: OfflineComponent },
  { path: '**', component: NotFound },
];
