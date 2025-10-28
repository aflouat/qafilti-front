import { Component, computed } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, MenubarModule, ButtonModule],
  styles: [`
    .app-menubar {
      border-bottom: 2px solid var(--border-color);
      background: white;
    }

    .app-logo {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-weight: 800;
      font-size: 1.5rem;
      color: var(--primary-color);
      margin-right: 2rem;
      padding: 0.5rem;
      background: var(--gradient-primary);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .app-logo i {
      font-size: 2rem;
      background: var(--gradient-primary);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .app-name {
      font-family: 'Inter', sans-serif;
      letter-spacing: -0.02em;
    }
  `],
  template: `
    <div class="app-container">
      <p-menubar [model]="items()" class="app-menubar">
        <ng-template pTemplate="start">
          <div class="app-logo">
            <i class="pi pi-ticket"></i>
            <span class="app-name">Qafilti</span>
          </div>
        </ng-template>
      </p-menubar>
      <div class="content p-3">
        <router-outlet></router-outlet>
      </div>
    </div>
  `
})
export class App {
  constructor(private auth: AuthService, private router: Router) {}

  // Use a computed signal to stabilize the Menubar model identity and avoid re-creation every CD cycle
  readonly items = computed(() => {
    const isAuth = this.auth.isAuthenticated();
    const user = this.auth.user();
    const role = user?.role || 'comptoir';

    // Tableau de bord - accessible à tous
    const menuItems: any[] = [
      { label: 'Tableau de bord', icon: 'pi pi-home', routerLink: [''] }
    ];

    // Menu Opérations - varie selon le rôle
    const operationsItems: any[] = [
      { label: 'Réservations', icon: 'pi pi-ticket', routerLink: ['reservations'] },
      { label: 'Passagers', icon: 'pi pi-users', routerLink: ['passagers'] },
      { label: 'Colis', icon: 'pi pi-inbox', routerLink: ['colis'] }
    ];

    // Paiements - accessible uniquement au caissier et admin
    if (role === 'caissier' || role === 'admin') {
      operationsItems.push({ label: 'Paiements', icon: 'pi pi-wallet', routerLink: ['paiements'] });
    }

    menuItems.push({
      label: 'Opérations', icon: 'pi pi-briefcase', items: operationsItems
    });

    // Rapports - accessible uniquement au caissier et admin
    if (role === 'caissier' || role === 'admin') {
      menuItems.push({ label: 'Rapports', icon: 'pi pi-chart-line', routerLink: ['rapports'] });
    }

    // Administration - accessible uniquement à l'admin
    if (role === 'admin') {
      menuItems.push({
        label: 'Administration', icon: 'pi pi-cog', items: [
          { label: 'Bus', icon: 'pi pi-car', routerLink: ['admin'], queryParams: { tab: 'bus' } },
          { label: 'Villes', icon: 'pi pi-map-marker', routerLink: ['admin'], queryParams: { tab: 'villes' } },
          { label: 'Trips', icon: 'pi pi-calendar', routerLink: ['admin'], queryParams: { tab: 'trips' } },
          { label: 'Trajets', icon: 'pi pi-directions', routerLink: ['admin'], queryParams: { tab: 'trajets' } },
          { label: 'Tarifs', icon: 'pi pi-dollar', routerLink: ['admin'], queryParams: { tab: 'tarifs' } }
        ]
      });
    }

    const authItems = isAuth
      ? [
          { label: `Bonjour, ${user?.name ?? 'Utilisateur'} (${role})`, icon: 'pi pi-user' },
          { label: 'Déconnexion', icon: 'pi pi-sign-out', command: () => this.logout() }
        ]
      : [
          { label: 'Se connecter', icon: 'pi pi-sign-in', routerLink: ['/login'] },
          { label: 'Inscription', icon: 'pi pi-user-plus', routerLink: ['/inscription'] }
        ];

    return [...menuItems, ...authItems];
  });

  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/');
  }
}
