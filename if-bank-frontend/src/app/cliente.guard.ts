import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from './auth.service';

/**
 * Restringe o acesso a rotas que são exclusivas do perfil CLIENTE
 * (dashboard, transferências, extrato, investimentos). O perfil
 * GERENTE não opera conta bancária própria pelo sistema — seu
 * acesso fica limitado à aprovação de contas e ao próprio perfil.
 * Deve ser usado em conjunto com o authGuard (que garante login).
 */
export const clienteGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const usuario = authService.getUsuario();

  if (usuario?.perfil !== 'GERENTE') {
    return true;
  }

  return router.createUrlTree(['/gerente']);
};
