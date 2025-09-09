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

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'login', component: LoginComponent },
  { path: 'inscription', component: RegisterComponent },
  { path: 'reservations', component: ReservationsComponent },
  { path: 'passagers', component: PassagersComponent },
  { path: 'colis', component: ColisComponent },
  { path: 'paiements', component: PaiementsComponent },
  { path: 'rapports', component: RapportsComponent },
  { path: 'admin', component: AdminComponent },
  { path: '**', redirectTo: '' },
];
