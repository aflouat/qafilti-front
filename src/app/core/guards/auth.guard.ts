import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

/**
 * Guard pour protéger les routes qui nécessitent une authentification
 * Redirige vers /login si l'utilisateur n'est pas authentifié
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  // Rediriger vers login et sauvegarder l'URL demandée
  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url }
  });
};
