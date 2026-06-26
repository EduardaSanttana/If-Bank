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

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },

  {
    path: 'dashboard',
    component: Dashboard
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
    component: Transferencias
  },

  {
    path: 'extrato',
    component: Extrato
  },

  {
    path: 'investimentos',
    component: Investimentos
  },

  {
    path: 'gerente',
    component: Gerente
  },

  {
    path: 'perfil',
    component: Perfil
  },

  {
    path: 'login',
    component: Login
  }

];