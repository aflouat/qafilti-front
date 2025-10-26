import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard.component';
import { ReservationsComponent } from './features/reservations/reservations.component';
import { PassagersComponent } from './features/passagers/passagers.component';
import { ColisComponent } from './features/colis/colis.component';
import { PaiementsComponent } from './features/paiements/paiements.component';
import { RapportsComponent } from './features/rapports/rapports.component';
import { AdminComponent } from './features/admin/admin.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

/**
 * Configuration des routes avec protection par authentification et rôles
 *
 * Rôles disponibles :
 * - comptoir : Crée les réservations (brouillon) et gère les passagers
 * - caissier : Confirme les réservations après paiement, gère colis et paiements
 * - admin : Accès complet (administration et rapports)
 */
export const routes: Routes = [
  // Routes publiques
  { path: 'login', component: LoginComponent },
  { path: 'inscription', component: RegisterComponent },

  // Dashboard - Accessible à tous les utilisateurs authentifiés
  {
    path: '',
    component: DashboardComponent,
    canActivate: [authGuard]
  },

  // Réservations - Accessible au comptoir (création), caissier (confirmation) et admin
  {
    path: 'reservations',
    component: ReservationsComponent,
    canActivate: [authGuard, roleGuard(['comptoir', 'caissier', 'admin'])]
  },

  // Passagers - Accessible au comptoir et admin
  {
    path: 'passagers',
    component: PassagersComponent,
    canActivate: [authGuard, roleGuard(['comptoir', 'admin'])]
  },

  // Colis - Accessible au caissier et admin
  {
    path: 'colis',
    component: ColisComponent,
    canActivate: [authGuard, roleGuard(['caissier', 'admin'])]
  },

  // Paiements - Accessible au caissier et admin
  {
    path: 'paiements',
    component: PaiementsComponent,
    canActivate: [authGuard, roleGuard(['caissier', 'admin'])]
  },

  // Rapports - Accessible uniquement à l'admin
  {
    path: 'rapports',
    component: RapportsComponent,
    canActivate: [authGuard, roleGuard(['admin'])]
  },

  // Administration - Accessible uniquement à l'admin
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [authGuard, roleGuard(['admin'])]
  },

  // Redirection par défaut
  { path: '**', redirectTo: '' },
];
