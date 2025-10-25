# Documentation Technique - Qafilti Front

## Table des Matières

1. [Vue d'Ensemble](#vue-densemble)
2. [Architecture](#architecture)
3. [Stack Technique](#stack-technique)
4. [Structure du Projet](#structure-du-projet)
5. [Services](#services)
6. [Composants](#composants)
7. [Authentification & Autorisation](#authentification--autorisation)
8. [Routing & Guards](#routing--guards)
9. [State Management](#state-management)
10. [API Integration](#api-integration)
11. [Build & Déploiement](#build--déploiement)
12. [Tests](#tests)
13. [Bonnes Pratiques](#bonnes-pratiques)

---

## Vue d'Ensemble

**Qafilti Front** est une application Angular 20 moderne pour la gestion d'un service de transport/voyage. Elle utilise l'architecture **standalone components** et **Angular Signals** pour une gestion d'état réactive.

### Caractéristiques Principales

- ✅ Architecture moderne avec composants standalone
- ✅ State management avec Angular Signals
- ✅ Système RBAC (Role-Based Access Control)
- ✅ UI/UX avec PrimeNG + Tailwind CSS
- ✅ TypeScript strict mode
- ✅ Responsive design
- ✅ Prêt pour l'intégration API

---

## Architecture

### Pattern Architectural

```
┌─────────────────────────────────────────────────────────┐
│                    Presentation Layer                    │
│                  (Standalone Components)                 │
├─────────────────────────────────────────────────────────┤
│                     Service Layer                        │
│              (Injectable Services + Signals)             │
├─────────────────────────────────────────────────────────┤
│                   Core Layer (Guards)                    │
│              (Authentication & Authorization)            │
├─────────────────────────────────────────────────────────┤
│                    Data Layer (Mock)                     │
│              (In-Memory / Future: HTTP API)              │
└─────────────────────────────────────────────────────────┘
```

### Principes de Conception

1. **Separation of Concerns** : Composants vs Services
2. **Reactive Programming** : Angular Signals partout
3. **Dependency Injection** : `inject()` function
4. **Type Safety** : TypeScript strict + Interfaces
5. **Single Responsibility** : Un service = Une responsabilité

---

## Stack Technique

### Framework & Core

| Technologie | Version | Usage |
|-------------|---------|-------|
| **Angular** | 20.2.0 | Framework principal |
| **TypeScript** | 5.9.2 | Langage de programmation |
| **RxJS** | 7.8.0 | Programmation réactive |
| **Zone.js** | 15.0 | Change detection |

### UI/UX

| Technologie | Version | Usage |
|-------------|---------|-------|
| **PrimeNG** | 20.1.1 | Composants UI |
| **Tailwind CSS** | 4.1.12 | Styling utility-first |
| **PrimeIcons** | 7.0.0 | Icônes |
| **Lara Theme** | Latest | Thème PrimeNG |

### Build & Tools

| Outil | Version | Usage |
|-------|---------|-------|
| **Angular CLI** | 20.2.1 | Build & Dev server |
| **PostCSS** | 8.5.6 | CSS processing |
| **Prettier** | Latest | Code formatting |
| **Karma/Jasmine** | Latest | Testing |

---

## Structure du Projet

```
qafilti-front/
├── src/
│   ├── app/
│   │   ├── core/                      # Module core
│   │   │   ├── guards/                # Route guards
│   │   │   │   ├── auth.guard.ts     # Protection authentification
│   │   │   │   └── role.guard.ts     # Protection rôles
│   │   │   └── services/              # Services métier
│   │   │       ├── reservations.service.ts
│   │   │       ├── passagers.service.ts
│   │   │       ├── colis.service.ts
│   │   │       ├── paiements.service.ts
│   │   │       ├── trajets.service.ts
│   │   │       ├── vehicules.service.ts
│   │   │       ├── tarifs.service.ts
│   │   │       └── rapports.service.ts
│   │   │
│   │   ├── auth/                      # Module authentification
│   │   │   ├── auth.service.ts       # Service d'authentification
│   │   │   ├── login/                # Composant login
│   │   │   └── register/             # Composant inscription
│   │   │
│   │   ├── features/                  # Modules fonctionnels
│   │   │   ├── dashboard/
│   │   │   │   ├── dashboard.component.ts
│   │   │   │   ├── dashboard.component.html
│   │   │   │   └── dashboard.component.css
│   │   │   ├── reservations/
│   │   │   ├── passagers/
│   │   │   ├── colis/
│   │   │   ├── paiements/
│   │   │   ├── rapports/
│   │   │   └── admin/
│   │   │
│   │   ├── app.ts                     # Root component
│   │   ├── app.config.ts              # Application config
│   │   └── app.routes.ts              # Routes configuration
│   │
│   ├── assets/
│   │   └── qafilti-mockoon.json      # Mock API config
│   │
│   ├── environements/
│   │   ├── environment.ts            # Dev environment
│   │   └── environment.prod.ts       # Prod environment
│   │
│   ├── styles.css                    # Global styles
│   ├── main.ts                       # Bootstrap
│   └── index.html                    # HTML template
│
├── angular.json                      # Angular config
├── tsconfig.json                     # TypeScript config
├── package.json                      # Dependencies
└── README.md                         # Documentation
```

---

## Services

### Architecture des Services

Tous les services suivent le même pattern :

```typescript
import { Injectable, signal, computed } from '@angular/core';

export interface Entity {
  id: number;
  // ... propriétés
}

@Injectable({ providedIn: 'root' })
export class EntityService {
  // Private writable signal
  private readonly _entities = signal<Entity[]>([]);

  // Public readonly signal
  readonly entities = this._entities.asReadonly();

  // Computed signals
  readonly count = computed(() => this._entities().length);

  // CRUD Methods
  getAll(): Entity[] { /* ... */ }
  getById(id: number): Entity | undefined { /* ... */ }
  create(entity: Omit<Entity, 'id'>): Entity { /* ... */ }
  update(id: number, updates: Partial<Entity>): boolean { /* ... */ }
  delete(id: number): boolean { /* ... */ }

  // Business logic methods
  // ...
}
```

### Liste des Services

#### 1. ReservationsService

**Fichier** : `src/app/core/services/reservations.service.ts`

**Responsabilité** : Gestion des réservations de voyage

**Interface** :
```typescript
interface Reservation {
  id: number;
  code: string;
  passager: string;
  trajet: string;
  date: Date;
  prix: number;
  statut: 'Brouillon' | 'Confirmée';
}
```

**Méthodes** :
- `getAll()`: Récupérer toutes les réservations
- `create()`: Créer une réservation (génère code auto)
- `update()`: Modifier une réservation
- `delete()`: Supprimer une réservation
- `confirm()`: Confirmer une réservation (Brouillon → Confirmée)

**Signals** :
- `reservations`: Liste des réservations
- `reservationsCount`: Nombre total
- `confirmedCount`: Nombre confirmées
- `todayCount`: Réservations du jour

#### 2. PassagersService

**Fichier** : `src/app/core/services/passagers.service.ts`

**Interface** :
```typescript
interface Passager {
  id: number;
  nom: string;
  telephone: string;
  document: string;
}
```

**Méthodes** : CRUD standard

**Signals** :
- `passagers`: Liste des passagers
- `passagersCount`: Nombre total

#### 3. ColisService

**Fichier** : `src/app/core/services/colis.service.ts`

**Interface** :
```typescript
interface Colis {
  id: number;
  code: string;
  expediteur: string;
  destinataire: string;
  poids: number;
  tarif: number;
  statut: 'En transit' | 'Livré';
}
```

**Méthodes** :
- CRUD standard
- `markAsDelivered()`: Marquer comme livré
- `getInTransit()`: Récupérer colis en transit

**Signals** :
- `colis`: Liste des colis
- `colisCount`: Nombre total
- `inTransitCount`: En transit
- `deliveredCount`: Livrés

#### 4. PaiementsService

**Fichier** : `src/app/core/services/paiements.service.ts`

**Interface** :
```typescript
interface Paiement {
  id: number;
  ref: string;
  type: 'Acompte' | 'Solde';
  montant: number;
  mode: 'Carte bancaire' | 'Virement' | 'Espèces';
  note?: string;
}
```

**Signals** :
- `paiements`: Liste des paiements
- `totalAmount`: Montant total
- `acompteAmount`: Total acomptes
- `soldeAmount`: Total soldes

#### 5. TrajetsService

**Fichier** : `src/app/core/services/trajets.service.ts`

**Interface** :
```typescript
interface Trajet {
  id: number;
  code: string;
  origine: string;
  destination: string;
}
```

#### 6. VehiculesService

**Fichier** : `src/app/core/services/vehicules.service.ts`

**Interface** :
```typescript
interface Vehicule {
  id: number;
  matricule: string;
  modele: string;
  capacite: number;
}
```

**Signals** :
- `totalCapacity`: Capacité totale de la flotte

#### 7. TarifsService

**Fichier** : `src/app/core/services/tarifs.service.ts`

**Interface** :
```typescript
interface Tarif {
  id: number;
  trajet: string;
  prix: number;
}
```

**Méthodes** :
- `findByRoute()`: Trouver tarif par trajet

**Signals** :
- `averagePrice`: Prix moyen

#### 8. RapportsService

**Fichier** : `src/app/core/services/rapports.service.ts`

**Particularité** : Service composite qui utilise les autres services

**Signals** :
- `kpis`: KPIs calculés (billets, colis, fillRate)
- `revenueByRoute`: Revenus par trajet

---

## Composants

### Architecture des Composants

Tous les composants utilisent :
- **Standalone** : `standalone: true`
- **Inject function** : `inject()` au lieu de constructor DI
- **Signals** : Accès aux données des services

### Pattern de Composant

```typescript
import { Component, inject } from '@angular/core';
import { ServiceName } from '../../core/services/service-name.service';

@Component({
  standalone: true,
  selector: 'app-feature',
  imports: [/* PrimeNG modules */],
  templateUrl: './feature.component.html',
  styleUrls: ['./feature.component.css']
})
export class FeatureComponent {
  private readonly service = inject(ServiceName);

  // Exposer les signals du service
  readonly data = this.service.data;

  // État local du composant
  dialog = false;
  form: Partial<Entity> = {};

  // Méthodes du composant
  openDialog() { /* ... */ }
  save() { /* ... */ }
}
```

### Liste des Composants

| Composant | Route | Responsabilité |
|-----------|-------|----------------|
| DashboardComponent | `/` | Tableau de bord KPIs |
| ReservationsComponent | `/reservations` | Gestion réservations |
| PassagersComponent | `/passagers` | Gestion passagers |
| ColisComponent | `/colis` | Gestion colis |
| PaiementsComponent | `/paiements` | Consultation paiements |
| RapportsComponent | `/rapports` | Rapports & analytics |
| AdminComponent | `/admin` | Administration système |
| LoginComponent | `/login` | Authentification |
| RegisterComponent | `/inscription` | Inscription |

---

## Authentification & Autorisation

### AuthService

**Fichier** : `src/app/auth/auth.service.ts`

**Type de rôle** :
```typescript
export type UserRole = 'comptoir' | 'caissier' | 'admin';
```

**Interface utilisateur** :
```typescript
export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}
```

### Utilisateurs Mock

| Rôle | Email | Password |
|------|-------|----------|
| Comptoir | comptoir@qafilti.com | comptoir123 |
| Caissier | caissier@qafilti.com | caissier123 |
| Admin | admin@qafilti.com | admin123 |

### Méthodes AuthService

```typescript
// Authentification
login(email: string, password: string): boolean
logout(): void

// Vérification de rôles
hasRole(role: UserRole): boolean
hasAnyRole(roles: UserRole[]): boolean
canAccess(allowedRoles: UserRole[]): boolean

// Utilitaires
getMockUsers(): MockUser[]
```

### Persistance

Session sauvegardée dans **localStorage** :
- Clé : `qafilti_auth_user`
- Restauration automatique au démarrage

---

## Routing & Guards

### Configuration des Routes

**Fichier** : `src/app/app.routes.ts`

```typescript
export const routes: Routes = [
  // Public
  { path: 'login', component: LoginComponent },

  // Protected with auth only
  { path: '', component: DashboardComponent, canActivate: [authGuard] },

  // Protected with auth + role
  {
    path: 'reservations',
    component: ReservationsComponent,
    canActivate: [authGuard, roleGuard(['comptoir', 'admin'])]
  },
];
```

### Guards

#### AuthGuard

**Fichier** : `src/app/core/guards/auth.guard.ts`

**Type** : `CanActivateFn`

**Comportement** :
- Vérifie `isAuthenticated` signal
- Si non authentifié → Redirection `/login?returnUrl=...`
- Si authentifié → Accès autorisé

**Utilisation** :
```typescript
canActivate: [authGuard]
```

#### RoleGuard

**Fichier** : `src/app/core/guards/role.guard.ts`

**Type** : Factory qui retourne `CanActivateFn`

**Comportement** :
- Vérifie d'abord l'authentification
- Vérifie ensuite les rôles autorisés
- **Admin a accès universel**
- Si refusé → Redirection `/` avec `error=access-denied`

**Utilisation** :
```typescript
canActivate: [authGuard, roleGuard(['admin', 'comptoir'])]
```

### Matrice de Permissions

| Route | Comptoir | Caissier | Admin |
|-------|----------|----------|-------|
| `/` | ✅ | ✅ | ✅ |
| `/reservations` | ✅ | ❌ | ✅ |
| `/passagers` | ✅ | ❌ | ✅ |
| `/colis` | ❌ | ✅ | ✅ |
| `/paiements` | ❌ | ✅ | ✅ |
| `/rapports` | ❌ | ❌ | ✅ |
| `/admin` | ❌ | ❌ | ✅ |

---

## State Management

### Angular Signals

Le projet utilise **Angular Signals** pour la gestion d'état réactive.

#### Pattern Signal

```typescript
// 1. Signal privé writable
private readonly _data = signal<Type[]>([]);

// 2. Signal public readonly
readonly data = this._data.asReadonly();

// 3. Computed signals
readonly count = computed(() => this._data().length);

// 4. Mise à jour
this._data.set([...newData]);
this._data.update(current => [...current, newItem]);
```

#### Avantages

- ✅ **Performance** : Change detection optimisée
- ✅ **Simplicité** : Pas besoin de RxJS pour l'état local
- ✅ **Type-safe** : TypeScript strict
- ✅ **Reactivity** : Mises à jour automatiques

#### Dans les Templates

```html
<!-- Appel de signal avec () -->
<div *ngFor="let item of items()">
  {{ item.name }}
</div>

<!-- Computed signal -->
<p>Total: {{ totalCount() }}</p>
```

---

## API Integration

### État Actuel

- ✅ Services utilisent **données mock en mémoire**
- ✅ HttpClient **configuré** mais non utilisé
- ✅ Environnements **configurés**
- ✅ Mockoon config **disponible** (29 endpoints)

### Configuration Environnement

**Development** (`src/environements/environment.ts`) :
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3002/api'
};
```

**Production** (`src/environements/environment.prod.ts`) :
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.qafilti.com/api'
};
```

### HttpClient Setup

**Fichier** : `src/app/app.config.ts`

```typescript
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    // ...
  ]
};
```

### Migration vers HTTP

Un exemple complet est fourni dans :
`src/app/core/services/reservations.service.http-example.ts`

**Pattern HTTP + Signals** :

```typescript
@Injectable({ providedIn: 'root' })
export class ServiceName {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/endpoint`;
  private readonly _data = signal<Type[]>([]);

  constructor() {
    this.loadData();
  }

  private loadData(): void {
    this.http.get<Type[]>(this.apiUrl)
      .subscribe(data => this._data.set(data));
  }

  create(item: Omit<Type, 'id'>): Observable<Type> {
    return this.http.post<Type>(this.apiUrl, item)
      .pipe(tap(newItem => {
        this._data.update(list => [newItem, ...list]);
      }));
  }
}
```

### Mockoon API

**Configuration** : `src/assets/qafilti-mockoon.json`

**Endpoints disponibles** : 29 routes

Voir `API_INTEGRATION.md` pour la liste complète.

---

## Build & Déploiement

### Scripts NPM

```bash
# Development
npm start              # ng serve (http://localhost:4200)
npm run watch          # ng build --watch

# Build
npm run build          # ng build (production)

# Tests
npm test              # ng test (Karma + Jasmine)
```

### Build de Production

```bash
npm run build
```

**Output** : `dist/qafilti-ui/browser/`

**Configuration** : `angular.json`

```json
{
  "budgets": [
    {
      "type": "initial",
      "maximumWarning": "500kB",
      "maximumError": "1MB"
    }
  ]
}
```

### Variables d'Environnement

Lors du build, Angular utilise automatiquement :
- **Dev** : `src/environements/environment.ts`
- **Prod** : `src/environements/environment.prod.ts`

---

## Tests

### Framework de Test

- **Karma** : Test runner
- **Jasmine** : Framework de test

### Lancer les Tests

```bash
npm test
```

### Pattern de Test (Exemple)

```typescript
import { TestBed } from '@angular/core/testing';
import { ServiceName } from './service-name.service';

describe('ServiceName', () => {
  let service: ServiceName;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceName);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create item', () => {
    const item = service.create({ name: 'Test' });
    expect(item.id).toBeDefined();
    expect(service.getAll().length).toBe(1);
  });
});
```

---

## Bonnes Pratiques

### Code Style

**Prettier** : Configuration dans `.prettierrc`
```json
{
  "printWidth": 100,
  "singleQuote": true
}
```

**EditorConfig** : Configuration dans `.editorconfig`
```
indent_style = space
indent_size = 2
quote_type = single
```

### TypeScript

**Strict Mode** : Activé dans `tsconfig.json`
```json
{
  "compilerOptions": {
    "strict": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true
  }
}
```

### Conventions de Nommage

| Élément | Convention | Exemple |
|---------|-----------|---------|
| **Composants** | PascalCase + Component | `DashboardComponent` |
| **Services** | PascalCase + Service | `ReservationsService` |
| **Interfaces** | PascalCase | `Reservation` |
| **Fichiers** | kebab-case | `dashboard.component.ts` |
| **Variables** | camelCase | `isAuthenticated` |
| **Constantes** | UPPER_SNAKE_CASE | `API_URL` |

### Structure des Imports

```typescript
// 1. Angular core
import { Component, inject } from '@angular/core';

// 2. Angular common
import { CommonModule } from '@angular/common';

// 3. Third-party
import { CardModule } from 'primeng/card';

// 4. Application
import { AuthService } from '../../auth/auth.service';
```

### Signals Best Practices

```typescript
// ✅ DO: Readonly public signals
readonly data = this.service.data;

// ❌ DON'T: Writable public signals
data = signal([]);

// ✅ DO: Computed for derived data
readonly total = computed(() => this.items().length);

// ❌ DON'T: Manual calculation
get total() { return this.items().length; }
```

### Services Best Practices

```typescript
// ✅ DO: providedIn root
@Injectable({ providedIn: 'root' })

// ✅ DO: Inject function
private readonly http = inject(HttpClient);

// ✅ DO: Readonly signals
readonly data = this._data.asReadonly();

// ✅ DO: Type-safe interfaces
interface Entity { id: number; /* ... */ }
```

---

## Dépendances

### Production

```json
{
  "@angular/animations": "^20.2.0",
  "@angular/common": "^20.2.0",
  "@angular/compiler": "^20.2.0",
  "@angular/core": "^20.2.0",
  "@angular/forms": "^20.2.0",
  "@angular/platform-browser": "^20.2.0",
  "@angular/router": "^20.2.0",
  "primeng": "^20.1.1",
  "@primeng/themes": "^20.1.1",
  "rxjs": "~7.8.0",
  "tslib": "^2.3.0",
  "zone.js": "~15.0.0"
}
```

### Development

```json
{
  "@angular-devkit/build-angular": "^20.2.1",
  "@angular/cli": "^20.2.1",
  "@angular/compiler-cli": "^20.2.0",
  "karma": "~6.4.0",
  "karma-jasmine": "~5.1.0",
  "typescript": "~5.9.2"
}
```

---

## Ressources & Références

### Documentation Officielle

- [Angular Docs](https://angular.dev)
- [Angular Signals](https://angular.dev/guide/signals)
- [PrimeNG](https://primeng.org)
- [Tailwind CSS](https://tailwindcss.com)

### Documentation Projet

- `README.md` : Vue d'ensemble
- `API_INTEGRATION.md` : Guide d'intégration API
- `ROLES_PERMISSIONS.md` : Système de rôles
- `DOCUMENTATION_FONCTIONNELLE.md` : Guide utilisateur

### Support

Pour toute question technique, consulter :
1. Cette documentation
2. Les commentaires dans le code
3. Les fichiers d'exemple (*.http-example.ts)

---

## Changelog Technique

### v0.0.3 (Actuel)
- ✅ Système RBAC complet (3 rôles)
- ✅ Guards (auth + role)
- ✅ Persistance session localStorage
- ✅ UI login améliorée

### v0.0.2
- ✅ 8 services avec Signals
- ✅ Refactoring composants
- ✅ Préparation API (HttpClient)
- ✅ Environnements configurés

### v0.0.1
- ✅ MVP initial
- ✅ Composants standalone
- ✅ PrimeNG + Tailwind
- ✅ Mock data

---

**Documentation mise à jour le** : 25 Octobre 2024
**Version de l'application** : 0.0.3
**Angular** : 20.2.0
