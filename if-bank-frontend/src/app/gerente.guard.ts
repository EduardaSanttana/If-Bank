import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from './auth.service';

/**
 * Restringe o acesso a rotas que só o perfil GERENTE pode usar
 * (requisito 6: aprovação de abertura de contas).
 * Deve ser usado em conjunto com o authGuard (que garante login).
 */
export const gerenteGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const usuario = authService.getUsuario();

  if (usuario?.perfil === 'GERENTE') {
    return true;
  }

  return router.createUrlTree(['/dashboard']);
};
