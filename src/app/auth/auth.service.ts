import { Injectable, signal, computed } from '@angular/core';

export type UserRole = 'comptoir' | 'caissier' | 'admin';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

interface MockUser {
  email: string;
  password: string;
  name: string;
  role: UserRole;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Mock users database
  private readonly mockUsers: MockUser[] = [
    {
      email: 'comptoir@qafilti.com',
      password: 'comptoir123',
      name: 'Agent Comptoir',
      role: 'comptoir'
    },
    {
      email: 'caissier@qafilti.com',
      password: 'caissier123',
      name: 'Agent Caissier',
      role: 'caissier'
    },
    {
      email: 'admin@qafilti.com',
      password: 'admin123',
      name: 'Administrateur',
      role: 'admin'
    }
  ];

  readonly isAuthenticated = signal<boolean>(false);
  readonly user = signal<AuthUser | null>(null);
  readonly userRole = computed(() => this.user()?.role || null);

  constructor() {
    // Restaurer la session depuis localStorage si elle existe
    this.restoreSession();
  }

  login(email: string, password: string): boolean {
    // Rechercher l'utilisateur dans la base mock
    const mockUser = this.mockUsers.find(
      u => u.email === email && u.password === password
    );

    if (mockUser) {
      const authUser: AuthUser = {
        id: this.mockUsers.indexOf(mockUser) + 1,
        name: mockUser.name,
        email: mockUser.email,
        role: mockUser.role
      };

      this.user.set(authUser);
      this.isAuthenticated.set(true);

      // Sauvegarder la session
      this.saveSession(authUser);

      return true;
    }

    return false;
  }

  register(name: string, email: string, password: string): boolean {
    // Mock: accept any non-empty values et assigner rôle comptoir par défaut
    if (name?.trim() && email?.trim() && password?.trim()) {
      const authUser: AuthUser = {
        id: 999,
        name,
        email,
        role: 'comptoir' // Rôle par défaut pour les nouveaux utilisateurs
      };

      this.user.set(authUser);
      this.isAuthenticated.set(true);
      this.saveSession(authUser);

      return true;
    }
    return false;
  }

  logout(): void {
    this.user.set(null);
    this.isAuthenticated.set(false);
    localStorage.removeItem('qafilti_auth_user');
  }

  // Vérifier si l'utilisateur a un rôle spécifique
  hasRole(role: UserRole): boolean {
    return this.user()?.role === role;
  }

  // Vérifier si l'utilisateur a l'un des rôles spécifiés
  hasAnyRole(roles: UserRole[]): boolean {
    const currentRole = this.user()?.role;
    return currentRole ? roles.includes(currentRole) : false;
  }

  // Admin a accès à tout
  canAccess(allowedRoles: UserRole[]): boolean {
    const currentRole = this.user()?.role;
    if (!currentRole) return false;

    // Admin a accès à tout
    if (currentRole === 'admin') return true;

    return allowedRoles.includes(currentRole);
  }

  // Obtenir les utilisateurs mock (pour affichage sur la page de connexion)
  getMockUsers(): { email: string; password: string; role: UserRole }[] {
    return this.mockUsers.map(u => ({
      email: u.email,
      password: u.password,
      role: u.role
    }));
  }

  private saveSession(user: AuthUser): void {
    localStorage.setItem('qafilti_auth_user', JSON.stringify(user));
  }

  private restoreSession(): void {
    const saved = localStorage.getItem('qafilti_auth_user');
    if (saved) {
      try {
        const user = JSON.parse(saved) as AuthUser;
        this.user.set(user);
        this.isAuthenticated.set(true);
      } catch (e) {
        localStorage.removeItem('qafilti_auth_user');
      }
    }
  }
}
