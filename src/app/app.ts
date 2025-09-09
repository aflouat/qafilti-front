import { Component, computed } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, MenubarModule, ButtonModule],
  template: `
    <div class="app-container">
      <p-menubar [model]="items()" class="mb-3"></p-menubar>
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
    const base = [
      { label: 'Tableau de bord', icon: 'pi pi-home', routerLink: [''] },
      {
        label: 'Opérations', icon: 'pi pi-briefcase', items: [
          { label: 'Réservations', icon: 'pi pi-ticket', routerLink: ['reservations'] },
          { label: 'Passagers', icon: 'pi pi-users', routerLink: ['passagers'] },
          { label: 'Colis', icon: 'pi pi-inbox', routerLink: ['colis'] },
          { label: 'Paiements', icon: 'pi pi-wallet', routerLink: ['paiements'] }
        ]
      },
      { label: 'Rapports', icon: 'pi pi-chart-line', routerLink: ['rapports'] },
      { label: 'Administration', icon: 'pi pi-cog', routerLink: ['admin'] }
    ];

    const isAuth = this.auth.isAuthenticated();
    const user = this.auth.user();

    const authItems = isAuth
      ? [
          { label: `Bonjour, ${user?.name ?? 'Utilisateur'}`, icon: 'pi pi-user' },
          { label: 'Déconnexion', icon: 'pi pi-sign-out', command: () => this.logout() }
        ]
      : [
          { label: 'Se connecter', icon: 'pi pi-sign-in', routerLink: ['/login'] },
          { label: 'Inscription', icon: 'pi pi-user-plus', routerLink: ['/inscription'] }
        ];

    return [...base, ...authItems];
  });

  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/');
  }
}
