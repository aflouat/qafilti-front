# Système de Rôles et Permissions

Ce document décrit le système d'authentification et d'autorisation basé sur les rôles implémenté dans l'application Qafilti Front.

## Vue d'Ensemble

L'application utilise un système de contrôle d'accès basé sur les rôles (RBAC - Role-Based Access Control) avec trois rôles principaux :

- **Comptoir** : Agent de comptoir (création de réservations "En attente", gestion des passagers et colis)
- **Caissier** : Agent caissier (validation de réservations après paiement, gestion des colis, paiements et rapports)
- **Admin** : Administrateur (accès complet)

**Nouveau dans v0.0.5** :
- Menu dynamique qui s'adapte au rôle
- Permissions de suppression granulaires
- Accès du caissier aux rapports

## Utilisateurs Mock Disponibles

Pour tester l'application, trois utilisateurs sont disponibles :

| Rôle | Email | Mot de passe | Nom |
|------|-------|--------------|-----|
| **Comptoir** | comptoir@qafilti.com | comptoir123 | Agent Comptoir |
| **Caissier** | caissier@qafilti.com | caissier123 | Agent Caissier |
| **Admin** | admin@qafilti.com | admin123 | Administrateur |

Ces utilisateurs sont affichés directement sur la page de connexion pour faciliter les tests.

## Matrice des Permissions

| Page/Fonctionnalité | Comptoir | Caissier | Admin |
|---------------------|----------|----------|-------|
| **Dashboard** | ✅ | ✅ | ✅ |
| **Réservations** | ✅ (Création) | ✅ (Validation) | ✅ (Complet) |
| **Passagers** | ✅ | ✅ | ✅ |
| **Colis** | ✅ | ✅ | ✅ |
| **Paiements** | ❌ | ✅ | ✅ |
| **Rapports** | ❌ | ✅ | ✅ |
| **Administration** | ❌ | ❌ | ✅ |

**Permissions spéciales** :

| Action | Comptoir | Caissier | Admin |
|--------|----------|----------|-------|
| **Créer réservation** | ✅ (Statut "En attente") | ✅ | ✅ |
| **Valider réservation** | ❌ | ✅ | ✅ |
| **Imprimer ticket** | ❌ | ✅ | ✅ |
| **Supprimer réservation "En attente"** | ✅ | ✅ | ✅ |
| **Supprimer réservation "Validée"** | ❌ | ✅ | ✅ |

**Notes** :
- **Comptoir** : Crée les réservations avec statut "En attente" uniquement, peut supprimer uniquement les réservations "En attente"
- **Caissier** : Valide les réservations après paiement (En attente → Validée), imprime les tickets, accède aux rapports
- **Admin** : Accès complet à toutes les fonctionnalités

**Menu dynamique** : Les liens du menu principal s'affichent automatiquement selon le rôle de l'utilisateur connecté.

## Architecture Technique

### 1. AuthService

**Fichier** : `src/app/auth/auth.service.ts`

Le service d'authentification gère :
- La connexion/déconnexion des utilisateurs
- La persistance de session (localStorage)
- La vérification des rôles
- Les utilisateurs mock

**Méthodes principales** :

```typescript
// Connexion
login(email: string, password: string): boolean

// Déconnexion
logout(): void

// Vérifier si l'utilisateur a un rôle spécifique
hasRole(role: UserRole): boolean

// Vérifier si l'utilisateur a l'un des rôles
hasAnyRole(roles: UserRole[]): boolean

// Vérifier l'accès (Admin a accès à tout)
canAccess(allowedRoles: UserRole[]): boolean
```

**Signals disponibles** :

```typescript
readonly isAuthenticated: Signal<boolean>
readonly user: Signal<AuthUser | null>
readonly userRole: Signal<UserRole | null>
```

### 2. Guards

#### AuthGuard

**Fichier** : `src/app/core/guards/auth.guard.ts`

Protège les routes qui nécessitent une authentification.

**Comportement** :
- Si l'utilisateur est authentifié → Accès autorisé
- Si l'utilisateur n'est pas authentifié → Redirection vers `/login`
- Sauvegarde l'URL demandée dans `returnUrl` pour rediriger après connexion

**Utilisation** :

```typescript
{
  path: '',
  component: DashboardComponent,
  canActivate: [authGuard]
}
```

#### RoleGuard

**Fichier** : `src/app/core/guards/role.guard.ts`

Protège les routes basées sur les rôles utilisateur.

**Comportement** :
- Vérifie d'abord l'authentification
- Vérifie si l'utilisateur a l'un des rôles autorisés
- **Admin a accès à toutes les routes** (logique intégrée)
- Si accès refusé → Redirection vers `/` avec paramètre `error=access-denied`

**Utilisation** :

```typescript
{
  path: 'reservations',
  component: ReservationsComponent,
  canActivate: [authGuard, roleGuard(['comptoir', 'admin'])]
}
```

### 3. Configuration des Routes

**Fichier** : `src/app/app.routes.ts`

Toutes les routes sont protégées sauf `/login` et `/inscription`.

**Exemple** :

```typescript
// Route publique
{ path: 'login', component: LoginComponent }

// Route protégée - Authentification seule
{
  path: '',
  component: DashboardComponent,
  canActivate: [authGuard]
}

// Route protégée - Authentification + Rôles
{
  path: 'reservations',
  component: ReservationsComponent,
  canActivate: [authGuard, roleGuard(['comptoir', 'caissier', 'admin'])]
},
{
  path: 'rapports',
  component: RapportsComponent,
  canActivate: [authGuard, roleGuard(['caissier', 'admin'])]  // ✅ NOUVEAU: Caissier a accès
}
```

### 4. Menu Dynamique par Rôle

**Fichier** : `src/app/app.ts`

**Nouveau dans v0.0.5** : Le menu s'adapte automatiquement au rôle.

**Fonctionnement** :
```typescript
readonly items = computed(() => {
  const role = this.auth.user()?.role || 'comptoir';
  const menuItems: any[] = [
    { label: 'Tableau de bord', icon: 'pi pi-home', routerLink: [''] }
  ];

  // Menu Opérations - accessible à tous
  const operationsItems = [
    { label: 'Réservations', icon: 'pi pi-ticket', routerLink: ['reservations'] },
    { label: 'Passagers', icon: 'pi pi-users', routerLink: ['passagers'] },
    { label: 'Colis', icon: 'pi pi-inbox', routerLink: ['colis'] }
  ];

  // Paiements - caissier et admin uniquement
  if (role === 'caissier' || role === 'admin') {
    operationsItems.push({ label: 'Paiements', icon: 'pi pi-wallet', routerLink: ['paiements'] });
  }

  menuItems.push({ label: 'Opérations', icon: 'pi pi-briefcase', items: operationsItems });

  // Rapports - caissier et admin uniquement
  if (role === 'caissier' || role === 'admin') {
    menuItems.push({ label: 'Rapports', icon: 'pi pi-chart-line', routerLink: ['rapports'] });
  }

  // Administration - admin uniquement
  if (role === 'admin') {
    menuItems.push({ label: 'Administration', icon: 'pi pi-cog', items: [...] });
  }

  return [...menuItems, ...authItems];
});
```

**Sécurité** :
- Menu : Cache les liens non autorisés
- Routes : Bloque l'accès direct via URL
- Double protection pour maximum de sécurité

## Persistance de Session

La session utilisateur est sauvegardée dans `localStorage` sous la clé `qafilti_auth_user`.

**Avantages** :
- La session persiste après un rafraîchissement de page
- L'utilisateur reste connecté jusqu'à déconnexion explicite

**Données sauvegardées** :

```typescript
{
  id: number;
  name: string;
  email: string;
  role: UserRole;
}
```

## Page de Connexion

**Fichier** : `src/app/auth/login/login.component.ts`

La page de connexion affiche :
1. Formulaire de connexion standard
2. **Liste des utilisateurs de test** avec bouton "Utiliser" pour remplir automatiquement le formulaire
3. **Légende des permissions** par rôle

**Fonctionnalités** :
- Validation des credentials
- Messages d'erreur clairs
- Redirection vers l'URL demandée après connexion (`returnUrl`)
- Affichage des utilisateurs mock pour faciliter les tests

## Utilisation dans les Composants

### Vérifier le rôle de l'utilisateur

```typescript
import { Component, inject } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({ /* ... */ })
export class MyComponent {
  private readonly authService = inject(AuthService);

  ngOnInit() {
    // Vérifier si l'utilisateur est admin
    if (this.authService.hasRole('admin')) {
      console.log('Utilisateur admin');
    }

    // Vérifier si l'utilisateur a l'un des rôles
    if (this.authService.hasAnyRole(['comptoir', 'admin'])) {
      console.log('Accès autorisé');
    }

    // Récupérer le rôle actuel
    const role = this.authService.userRole();
  }
}
```

### Affichage conditionnel dans le template

```html
<!-- Afficher uniquement pour l'admin -->
<div *ngIf="authService.hasRole('admin')">
  <button>Supprimer</button>
</div>

<!-- Afficher le rôle de l'utilisateur -->
<p>Connecté en tant que : {{ authService.user()?.role }}</p>
```

## Tests

### Scénario 1 : Accès non autorisé

1. Ouvrir `http://localhost:4200/reservations` sans être connecté
2. **Résultat attendu** : Redirection vers `/login?returnUrl=/reservations`
3. Se connecter avec `comptoir@qafilti.com`
4. **Résultat attendu** : Redirection automatique vers `/reservations`

### Scénario 2 : Rôle insuffisant

1. Se connecter avec `caissier@qafilti.com` (mot de passe: `caissier123`)
2. Tenter d'accéder à `/passagers`
3. **Résultat attendu** : Redirection vers `/` avec message d'erreur dans la console

### Scénario 3 : Admin a accès à tout

1. Se connecter avec `admin@qafilti.com` (mot de passe: `admin123`)
2. Naviguer vers toutes les pages
3. **Résultat attendu** : Accès autorisé à toutes les routes

### Scénario 4 : Persistance de session

1. Se connecter
2. Rafraîchir la page (F5)
3. **Résultat attendu** : L'utilisateur reste connecté

## Sécurité

### Limitations Actuelles (Mock)

⚠️ **Ce système est uniquement pour le développement/démonstration** :

- Les mots de passe sont stockés en clair dans le code
- Aucune vérification côté serveur
- Les tokens ne sont pas utilisés
- La session est stockée en clair dans localStorage

### Recommandations pour la Production

Lorsque vous intégrerez une vraie API :

1. **JWT Tokens** : Utiliser des tokens JWT pour l'authentification
2. **HttpInterceptor** : Ajouter le token dans les headers HTTP
3. **Refresh Tokens** : Implémenter le renouvellement automatique
4. **Hashage** : Ne jamais stocker les mots de passe en clair
5. **HTTPS** : Utiliser HTTPS en production
6. **Expiration** : Implémenter l'expiration de session
7. **Validation Backend** : Toujours vérifier les permissions côté serveur

### Exemple d'Intercepteur HTTP (Future)

```typescript
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

  return next(req);
};
```

## Extension du Système

### Ajouter un Nouveau Rôle

1. Mettre à jour le type `UserRole` dans `auth.service.ts`:

```typescript
export type UserRole = 'comptoir' | 'caissier' | 'admin' | 'nouveau-role';
```

2. Ajouter un utilisateur mock :

```typescript
{
  email: 'nouveau@qafilti.com',
  password: 'nouveau123',
  name: 'Nouveau Rôle',
  role: 'nouveau-role'
}
```

3. Mettre à jour les routes avec les permissions appropriées

### Ajouter des Permissions Granulaires

Pour des permissions plus fines (ex: lecture seule vs lecture/écriture), vous pouvez étendre le système :

```typescript
export interface Permission {
  resource: string;
  actions: ('create' | 'read' | 'update' | 'delete')[];
}

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  comptoir: [
    { resource: 'reservations', actions: ['create', 'read', 'update'] },
    { resource: 'passagers', actions: ['create', 'read', 'update'] }
  ],
  // ...
};
```

## Résumé

| Aspect | État | Fichiers Principaux |
|--------|------|---------------------|
| Authentification | ✅ Implémenté | `auth.service.ts` |
| Autorisation (Rôles) | ✅ Implémenté | `auth.service.ts`, `role.guard.ts` |
| Protection Routes | ✅ Implémenté | `auth.guard.ts`, `app.routes.ts` |
| Persistance Session | ✅ Implémenté | `auth.service.ts` (localStorage) |
| UI Connexion | ✅ Implémenté | `login.component.ts/html` |
| Documentation | ✅ Complète | Ce fichier |

## Permissions Granulaires dans les Composants

**Nouveau dans v0.0.5** : Permissions au niveau des actions

**Exemple - ReservationsComponent** :
```typescript
// Méthode pour vérifier si l'utilisateur peut supprimer une réservation
canDelete(reservation: Reservation): boolean {
  const role = this.userRole();
  // Admin et caissier peuvent supprimer n'importe quelle réservation
  if (role === 'admin' || role === 'caissier') return true;
  // Comptoir peut uniquement supprimer les réservations "En attente"
  if (role === 'comptoir') return reservation.statut === 'En attente';
  return false;
}

// Computed signals pour les actions sensibles
readonly canValidate = computed(() => {
  const role = this.userRole();
  return role === 'caissier' || role === 'admin';
});

readonly canPrint = computed(() => {
  const role = this.userRole();
  return role === 'caissier' || role === 'admin';
});
```

**Utilisation dans le template** :
```html
<!-- Bouton valider - visible uniquement si canValidate() -->
<button *ngIf="canValidate()" (click)="validate(r)">Valider</button>

<!-- Bouton supprimer - visible si canDelete() retourne true -->
<button *ngIf="canDelete(r)" (click)="remove(r)">Supprimer</button>
```

---

**Le système de rôles et permissions est opérationnel et prêt pour les tests !** 🎉

**Version actuelle** : 0.0.5
**Date de mise à jour** : 28 Octobre 2025

**Nouveautés v0.0.5** :
- ✅ Menu dynamique par rôle
- ✅ Permissions de suppression granulaires
- ✅ Caissier accède aux rapports
- ✅ Nouveaux statuts : "En attente" / "Validée"
