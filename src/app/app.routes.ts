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
 * - comptoir : Crée les réservations (En attente), gère passagers et colis
 * - caissier : Valide et imprime les réservations, gère paiements, accède aux rapports
 * - admin : Accès complet (administration, rapports et toutes opérations)
 *
 * Droits d'accès par page :
 * - Dashboard : Tous
 * - Réservations, Passagers, Colis : Tous (comptoir, caissier, admin)
 * - Paiements, Rapports : Caissier et admin uniquement
 * - Administration : Admin uniquement
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

  // Réservations - Accessible à tous les rôles
  {
    path: 'reservations',
    component: ReservationsComponent,
    canActivate: [authGuard, roleGuard(['comptoir', 'caissier', 'admin'])]
  },

  // Passagers - Accessible à tous les rôles
  {
    path: 'passagers',
    component: PassagersComponent,
    canActivate: [authGuard, roleGuard(['comptoir', 'caissier', 'admin'])]
  },

  // Colis - Accessible à tous les rôles
  {
    path: 'colis',
    component: ColisComponent,
    canActivate: [authGuard, roleGuard(['comptoir', 'caissier', 'admin'])]
  },

  // Paiements - Accessible au caissier et admin uniquement
  {
    path: 'paiements',
    component: PaiementsComponent,
    canActivate: [authGuard, roleGuard(['caissier', 'admin'])]
  },

  // Rapports - Accessible au caissier et admin uniquement
  {
    path: 'rapports',
    component: RapportsComponent,
    canActivate: [authGuard, roleGuard(['caissier', 'admin'])]
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
