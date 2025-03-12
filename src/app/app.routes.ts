import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'compromissos',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: 'compromissos',
    loadComponent: () =>
      import('./components/compromissos/compromissos.component').then(
        (m) => m.CompromissosComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: 'contatos',
    loadComponent: () =>
      import('./components/contatos/contatos.component').then(
        (m) => m.ContatosComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: 'locais',
    loadComponent: () =>
      import('./components/locais/locais.component').then(
        (m) => m.LocaisComponent
      ),
    canActivate: [authGuard, adminGuard],
  },
  {
    path: '**',
    redirectTo: 'compromissos',
  },
];
