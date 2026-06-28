import { Routes } from '@angular/router';

import { Dashboard } from './pages/dashboard/dashboard';
import { Home } from './pages/home/home';
import { AbrirConta } from './pages/abrir-conta/abrir-conta';
import { Transferencias } from './pages/transferencias/transferencias';
import { Extrato } from './pages/extrato/extrato';
import { Investimentos } from './pages/investimentos/investimentos';
import { Gerente } from './pages/gerente/gerente';
import { Perfil } from './pages/perfil/perfil';
import { Login } from './pages/login/login';
import { authGuard } from './auth.guard';
import { gerenteGuard } from './gerente.guard';
import { clienteGuard } from './cliente.guard';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: 'login',
    component: Login
  },

  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [authGuard, clienteGuard]
  },

  {
    path: 'home',
    component: Home
  },

  {
    path: 'abrir-conta',
    component: AbrirConta
  },

  {
    path: 'transferencias',
    component: Transferencias,
    canActivate: [authGuard, clienteGuard]
  },

  {
    path: 'extrato',
    component: Extrato,
    canActivate: [authGuard, clienteGuard]
  },

  {
    path: 'investimentos',
    component: Investimentos,
    canActivate: [authGuard, clienteGuard]
  },

  {
    path: 'gerente',
    component: Gerente,
    canActivate: [authGuard, gerenteGuard]
  },

  {
    path: 'perfil',
    component: Perfil,
    canActivate: [authGuard]
  }

];
