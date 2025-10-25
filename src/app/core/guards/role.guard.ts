import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService, UserRole } from '../../auth/auth.service';

/**
 * Factory pour créer un guard basé sur les rôles
 *
 * @param allowedRoles - Liste des rôles autorisés à accéder à la route
 * @returns CanActivateFn
 *
 * @example
 * // Dans app.routes.ts
 * {
 *   path: 'admin',
 *   component: AdminComponent,
 *   canActivate: [authGuard, roleGuard(['admin'])]
 * }
 */
export const roleGuard = (allowedRoles: UserRole[]): CanActivateFn => {
  return (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    // Vérifier d'abord si l'utilisateur est authentifié
    if (!authService.isAuthenticated()) {
      return router.createUrlTree(['/login']);
    }

    // Vérifier si l'utilisateur a l'un des rôles autorisés
    // (Admin a accès à tout grâce à la logique dans canAccess)
    if (authService.canAccess(allowedRoles)) {
      return true;
    }

    // Accès refusé - rediriger vers le tableau de bord
    console.warn(`Accès refusé : rôle requis = ${allowedRoles.join(', ')}, rôle actuel = ${authService.userRole()}`);
    return router.createUrlTree(['/'], {
      queryParams: { error: 'access-denied' }
    });
  };
};
