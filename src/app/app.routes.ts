import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { CompromissosComponent } from './components/compromissos/compromissos.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/agenda', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'agenda',
    component: CompromissosComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'contatos',
    loadComponent: () =>
      import('./components/contatos/contatos.component').then(
        (m) => m.ContatosComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'locais',
    loadComponent: () =>
      import('./components/locais/locais.component').then(
        (m) => m.LocaisComponent
      ),
    canActivate: [AuthGuard, AdminGuard],
  },
  { path: '**', redirectTo: '/agenda' },
];
