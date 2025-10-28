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
- ✅ **API Mockoon intégrée** (29 endpoints actifs)

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
│                    Data Layer (HTTP)                     │
│              (Mockoon API via HttpClient)                │
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

Tous les services suivent le même pattern avec **HttpClient + Signals** :

```typescript
import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environements/environment';

export interface Entity {
  id: number;
  // ... propriétés
}

@Injectable({ providedIn: 'root' })
export class EntityService {
  private readonly http = inject(HttpClient);

  // Private writable signal
  private readonly _entities = signal<Entity[]>([]);

  // Public readonly signal
  readonly entities = this._entities.asReadonly();

  // Computed signals
  readonly count = computed(() => this._entities().length);

  constructor() {
    this.loadEntities();  // Chargement automatique au démarrage
  }

  // Load data from API
  loadEntities(): void {
    this.http.get<Entity[]>(`${environment.apiUrl}/entities`)
      .subscribe({
        next: (entities) => this._entities.set(entities || []),
        error: (error) => {
          console.error('Error loading entities:', error);
          this._entities.set([]);
        }
      });
  }

  // CRUD Methods (local + API)
  getAll(): Entity[] { /* ... */ }
  getById(id: number): Entity | undefined { /* ... */ }
  create(entity: Omit<Entity, 'id'>): Entity { /* ... */ }
  update(id: number, updates: Partial<Entity>): boolean { /* ... */ }
  delete(id: number): boolean { /* ... */ }
}
```

### Liste des Services

#### 1. ReservationsService

**Fichier** : `src/app/core/services/reservations.service.ts`

**Responsabilité** : Gestion des réservations de voyage

**API Endpoint** : `GET /api/reservation` (Mockoon)

**Interface** :
```typescript
interface Reservation {
  reservationId?: string;
  id?: number;
  code?: string;
  passager?: string;
  passengerName?: string;
  passengerPhone?: string;
  telephone1?: string;  // ✅ NOUVEAU: Premier numéro de téléphone
  telephone2?: string;  // ✅ NOUVEAU: Second numéro de téléphone (optionnel)
  tripId?: string;
  trajet?: string;
  date?: Date | string;
  prix?: number;
  netAmount?: number;
  seatNumber?: string;
  statut?: 'En attente' | 'Validée' | 'CONFIRMED' | 'PENDING' | 'CREATED';  // ✅ MODIFIÉ: Libellés mis à jour
  status?: string;
  createdAt?: string;
}
```

**Méthodes** :
- `loadReservations()`: Charger depuis API Mockoon
- `getAll()`: Récupérer toutes les réservations
- `create()`: Créer une réservation (génère code auto)
- `update()`: Modifier une réservation
- `delete()`: Supprimer une réservation
- `confirm()`: Confirmer une réservation (En attente → Validée)
- `validate()`: Valider une réservation (alias de confirm)

**Signals** :
- `reservations`: Liste des réservations
- `reservationsCount`: Nombre total
- `confirmedCount`: Nombre confirmées
- `todayCount`: Réservations du jour

#### 2. PassagersService

**Fichier** : `src/app/core/services/passagers.service.ts`

**API Endpoints** :
- `GET /api/passagers` (liste)
- `POST /api/passagers` (création)
- `PUT /api/passagers/:id` (mise à jour)
- `DELETE /api/passagers/:id` (suppression)

**Interface** :
```typescript
interface Passager {
  id: number;
  nom: string;
  telephone: string;
  // document: string;  // ❌ SUPPRIMÉ: Le champ document a été retiré
}
```

**Méthodes** :
- `loadPassagers()`: Charger depuis API Mockoon
- CRUD standard

**Signals** :
- `passagers`: Liste des passagers
- `passagersCount`: Nombre total

#### 3. ColisService

**Fichier** : `src/app/core/services/colis.service.ts`

**API Endpoints** :
- `GET /api/colis` (liste)
- `POST /api/colis` (création)
- `PUT /api/colis/:id` (mise à jour)
- `DELETE /api/colis/:id` (suppression)

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
- `loadColis()`: Charger depuis API Mockoon
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

**API Endpoints** :
- `GET /api/paiements` (liste)
- `POST /api/paiements` (création)

**Interface** :
```typescript
interface Paiement {
  id?: number;
  ref: string;
  type: 'Acompte' | 'Solde';
  montant: number;
  mode: 'Carte bancaire' | 'Virement' | 'Espèces';
  note?: string;
}
```

**Méthodes** :
- `loadPaiements()`: Charger depuis API Mockoon
- CRUD standard

**Signals** :
- `paiements`: Liste des paiements
- `totalAmount`: Montant total
- `acompteAmount`: Total acomptes
- `soldeAmount`: Total soldes

#### 5. TrajetsService

**Fichier** : `src/app/core/services/trajets.service.ts`

**API Endpoint** : `GET /api/trajets` (Mockoon) - ✅ CORRIGÉ de `/api/trips`

**Interface** :
```typescript
interface Trajet {
  id?: number;
  code?: string;
  tripId?: string;
  origine?: string;
  destination?: string;
  departureCityName?: string;
  arrivalCityName?: string;
  date?: string;
  vehicleId?: string;
  departureTime?: string;
  arrivalTime?: string;
}
```

**Méthodes** :
- `loadTrajets()`: Charger depuis API Mockoon
- CRUD standard

#### 6. VehiculesService

**Fichier** : `src/app/core/services/vehicules.service.ts`

**API Endpoints** :
- `GET /api/vehicules` (liste)
- `POST /api/vehicules` (création)
- `PUT /api/vehicules/:id` (mise à jour)
- `DELETE /api/vehicules/:id` (suppression)

**Interface** :
```typescript
interface Vehicule {
  id: number;
  matricule: string;
  modele: string;
  capacite: number;
}
```

**Méthodes** :
- `loadVehicules()`: Charger depuis API Mockoon
- CRUD standard

**Signals** :
- `totalCapacity`: Capacité totale de la flotte

#### 7. TarifsService

**Fichier** : `src/app/core/services/tarifs.service.ts`

**API Endpoints** :
- `GET /api/tarifs` (liste)
- `POST /api/tarifs` (création)
- `PUT /api/tarifs/:id` (mise à jour)
- `DELETE /api/tarifs/:id` (suppression)

**Interface** :
```typescript
interface Tarif {
  id: number;
  trajet: string;
  prix: number;
}
```

**Méthodes** :
- `loadTarifs()`: Charger depuis API Mockoon
- `findByRoute()`: Trouver tarif par trajet
- CRUD standard

**Signals** :
- `averagePrice`: Prix moyen

#### 8. RapportsService

**Fichier** : `src/app/core/services/rapports.service.ts`

**API Endpoints** :
- `GET /api/rapports/kpis` (KPIs)
- `GET /api/rapports/revenus` (Revenus par trajet)

**Particularité** : Service composite qui utilise les autres services + API Mockoon

**Méthodes** :
- `loadKPIs()`: Charger KPIs depuis API
- `loadRevenueByRoute()`: Charger revenus depuis API

**Signals** :
- `kpis`: KPIs (préfère API, sinon calcule localement)
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
| TicketPrintComponent | (pas de route) | Impression ticket bilingue |

### Composant Spécialisé : TicketPrintComponent

**Fichier** : `src/app/features/reservations/ticket-print.component.ts`

**Type** : Composant standalone utilitaire

**Responsabilité** : Afficher et imprimer un ticket de réservation bilingue (Français/Arabe)

**Utilisation** : Intégré dans ReservationsComponent pour l'impression

**Caractéristiques** :

- **Format** : 80mm (papier imprimante thermique)
- **Layout bilingue** :
  - Français à gauche (LTR)
  - Arabe à droite (RTL avec `direction: rtl`)
- **Branding** : Logo QAFILTI en français et arabe
- **Champs affichés** :
  - Code réservation
  - Statut (Brouillon/Confirmée)
  - Nom et téléphone du passager
  - Trajet (origine → destination)
  - Date et heure de départ
  - Numéro de place
  - Montant (EUR)

**Interface d'entrée** :
```typescript
@Input() reservation?: Reservation;
```

**Méthodes** :
```typescript
// Conversion du statut en français
getStatus(): string {
  if (!this.reservation?.statut) return '-';
  const statusMap: { [key: string]: string } = {
    'Brouillon': 'Brouillon',
    'Confirmée': 'Confirmée',
    'CONFIRMED': 'Confirmée',
    'PENDING': 'En attente',
    'CREATED': 'Créée'
  };
  return statusMap[this.reservation.statut] || this.reservation.statut;
}

// Conversion du statut en arabe
getStatusAr(): string {
  if (!this.reservation?.statut) return '-';
  const statusMap: { [key: string]: string } = {
    'Brouillon': 'مسودة',
    'Confirmée': 'مؤكدة',
    'CONFIRMED': 'مؤكدة',
    'PENDING': 'قيد الانتظار',
    'CREATED': 'تم الإنشاء'
  };
  return statusMap[this.reservation.statut] || this.reservation.statut;
}
```

**Styles d'impression** :
```css
@media print {
  /* Masquer tout le contenu de la page */
  body * {
    visibility: hidden;
  }

  /* Afficher uniquement le ticket */
  .ticket-container,
  .ticket-container * {
    visibility: visible;
  }

  /* Configuration page */
  @page {
    size: 80mm auto;
    margin: 0;
  }
}
```

**Intégration dans ReservationsComponent** :
```typescript
// reservations.component.ts
export class ReservationsComponent {
  ticketToPrint?: Reservation;  // Réservation à imprimer

  print(r: Reservation) {
    // Charger la réservation dans le ticket
    this.ticketToPrint = r;

    // Attendre le rendu puis imprimer
    setTimeout(() => {
      window.print();
      // Nettoyer après impression
      setTimeout(() => this.ticketToPrint = undefined, 100);
    }, 100);
  }
}
```

```html
<!-- reservations.component.html -->
<!-- Ticket caché à l'écran, visible uniquement lors de l'impression -->
<app-ticket-print [reservation]="ticketToPrint"></app-ticket-print>
```

```css
/* reservations.component.css */
app-ticket-print {
  display: none;  /* Caché à l'écran */
}

@media print {
  app-ticket-print {
    display: block;  /* Visible lors de l'impression */
  }
}
```

**Workflow d'impression** :
1. Utilisateur clique sur bouton "Imprimer" (icône `pi-print`)
2. ReservationsComponent charge la réservation dans `ticketToPrint`
3. TicketPrintComponent s'affiche (invisible à l'écran)
4. `window.print()` ouvre la boîte de dialogue d'impression
5. Seul le ticket est visible dans l'aperçu/impression
6. Après impression, `ticketToPrint` est réinitialisé à `undefined`

**Rôle utilisateur** : Principalement utilisé par le **Caissier** après confirmation de réservation et paiement

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
| `/` (Dashboard) | ✅ | ✅ | ✅ |
| `/reservations` | ✅ (Création "En attente") | ✅ (Validation) | ✅ (Complet) |
| `/passagers` | ✅ | ✅ | ✅ |
| `/colis` | ✅ | ✅ | ✅ |
| `/paiements` | ❌ | ✅ | ✅ |
| `/rapports` | ❌ | ✅ | ✅ |
| `/admin` | ❌ | ❌ | ✅ |

**Permissions spéciales** :
- **Validation réservations** : Caissier et Admin uniquement
- **Impression tickets** : Caissier et Admin uniquement
- **Suppression réservations** :
  - Comptoir : Peut supprimer uniquement les réservations "En attente"
  - Caissier/Admin : Peuvent supprimer toutes les réservations

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

- ✅ **Tous les services utilisent Mockoon API via HttpClient**
- ✅ HttpClient **configuré et actif**
- ✅ Environnements **configurés**
- ✅ **29 endpoints Mockoon actifs**
- ✅ Chargement automatique des données au démarrage de l'app

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

### Pattern HTTP + Signals Utilisé

**Tous les services suivent ce pattern** :

```typescript
@Injectable({ providedIn: 'root' })
export class ServiceName {
  private readonly http = inject(HttpClient);
  private readonly _data = signal<Type[]>([]);

  readonly data = this._data.asReadonly();

  constructor() {
    this.loadData();  // Chargement automatique
  }

  // Chargement depuis API
  loadData(): void {
    this.http.get<Type[]>(`${environment.apiUrl}/endpoint`)
      .subscribe({
        next: (data) => this._data.set(data || []),
        error: (error) => {
          console.error('Error loading data:', error);
          this._data.set([]);  // Fallback gracieux
        }
      });
  }

  // CRUD local (met à jour les signals)
  create(item: Omit<Type, 'id'>): Type { /* ... */ }
  update(id: number, updates: Partial<Type>): boolean { /* ... */ }
  delete(id: number): boolean { /* ... */ }
}
```

### Démarrer Mockoon API

**Prérequis** : L'application nécessite Mockoon pour fonctionner correctement.

**Configuration** : `src/assets/qafilti-mockoon.json`

**Port** : 3002

**Endpoints disponibles** : 29 routes CRUD

#### Option 1 : Mockoon Desktop (Recommandé)

```bash
# 1. Télécharger Mockoon Desktop
https://mockoon.com/download/

# 2. Ouvrir Mockoon
# 3. File → Open Environment
# 4. Sélectionner: src/assets/qafilti-mockoon.json
# 5. Cliquer sur "Start server" (port 3002)
```

#### Option 2 : Mockoon CLI

```bash
# Installer CLI
npm install -g @mockoon/cli

# Démarrer le serveur
mockoon-cli start --data src/assets/qafilti-mockoon.json

# Ou avec logs
mockoon-cli start --data src/assets/qafilti-mockoon.json --log-level debug
```

#### Option 3 : Docker

```bash
docker run -p 3002:3002 \
  -v $(pwd)/src/assets:/data \
  mockoon/cli:latest \
  start --data /data/qafilti-mockoon.json
```

#### Vérifier que Mockoon fonctionne

```bash
# Tester un endpoint
curl http://localhost:3002/api/passagers

# Devrait retourner la liste des passagers
```

### Endpoints Mockoon Utilisés

| Service | Endpoint | Méthode | Description |
|---------|----------|---------|-------------|
| ReservationsService | `/api/reservation` | GET | Liste réservations |
| PassagersService | `/api/passagers` | GET, POST, PUT, DELETE | CRUD passagers |
| ColisService | `/api/colis` | GET, POST, PUT, DELETE | CRUD colis |
| PaiementsService | `/api/paiements` | GET, POST | Liste/Créer paiements |
| TrajetsService | `/api/trips` | GET | Liste trajets |
| VehiculesService | `/api/vehicules` | GET, POST, PUT, DELETE | CRUD véhicules |
| TarifsService | `/api/tarifs` | GET, POST, PUT, DELETE | CRUD tarifs |
| RapportsService | `/api/rapports/kpis` | GET | KPIs |
| RapportsService | `/api/rapports/revenus` | GET | Revenus par trajet |

Voir `API_INTEGRATION.md` pour la liste complète des 29 endpoints.

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

## Devise et Formatage

**Devise officielle** : MRU (Ouguiya Mauritanien)

Toute l'application a été convertie de EUR (Euro) à MRU pour refléter le contexte mauritanien.

**Format d'affichage** :
- Pattern utilisé : `{{ montant | number:'1.2-2' }} MRU`
- Exemple : `1500.00 MRU`
- Le pipe `number` avec suffixe est utilisé au lieu de `currency:'MRU'` pour un meilleur contrôle du format

**Fichiers concernés** :
- reservations.component.html
- paiements.component.html
- rapports.component.html
- dashboard.component.html
- colis.component.html
- admin.component.html (section tarifs)

**Imports requis** : `DecimalPipe` depuis `@angular/common`

---

## Menu Dynamique par Rôle

**Fichier** : `src/app/app.ts`

Le menu principal s'adapte automatiquement selon le rôle de l'utilisateur connecté.

**Affichage par rôle** :

**Comptoir** :
- Tableau de bord
- Opérations : Réservations, Passagers, Colis
- ❌ Paiements (caché)
- ❌ Rapports (caché)
- ❌ Administration (caché)

**Caissier** :
- Tableau de bord
- Opérations : Réservations, Passagers, Colis, Paiements
- Rapports
- ❌ Administration (caché)

**Admin** :
- Accès complet (tous les menus visibles)
- Administration visible

Le menu affiche également le rôle de l'utilisateur : "Bonjour, Nom (role)"

**Sécurité** : Double protection via menu (affichage) + route guards (accès direct URL)

---

## Changelog Technique

### v0.0.5 (Actuel)
- ✅ **Conversion complète EUR → MRU** (Ouguiya mauritanien)
- ✅ **Format monétaire amélioré** : `555.00 MRU` au lieu de `MRU555.00`
- ✅ **Menu dynamique basé sur les rôles** (affichage conditionnel)
- ✅ **Deux numéros de téléphone** dans les réservations (telephone1, telephone2)
- ✅ **Suppression du champ document** des passagers
- ✅ **Affichage du nom du passager** au lieu de l'ID dans réservations
- ✅ **Permissions avancées** : Comptoir peut supprimer uniquement réservations "En attente"
- ✅ **Changement libellés statuts** : "Brouillon" → "En attente", "Confirmée" → "Validée"
- ✅ **Correction endpoint Trajets** : `/api/trips` → `/api/trajets`
- ✅ **Pagination ajoutée** à toutes les tables d'administration
- ✅ **Suppression de la page Véhicules** de l'administration
- ✅ **Ajout trajetCode dans Trips** avec dropdown dans le formulaire
- ✅ **Données mauritaniennes** : Trajets (Nouakchott-Nouadhibou), tarifs en MRU, noms mauritaniens
- ✅ **Imports DecimalPipe** corrigés pour pipe `number`
- ✅ **Tooltips PrimeNG** : `tooltip` → `pTooltip`
- ✅ Documentation technique et fonctionnelle complètement mise à jour

### v0.0.4
- ✅ Migration complète vers Mockoon API (29 endpoints)
- ✅ Tous les services utilisent HttpClient pour charger les données
- ✅ Correction workflow réservations (Comptoir → Caissier)
- ✅ **Ticket d'impression bilingue (FR/AR)** pour réservations
- ✅ Format thermique 80mm avec layout RTL pour arabe
- ✅ Documentation technique et fonctionnelle mise à jour

### v0.0.3
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

**Documentation mise à jour le** : 28 Octobre 2025
**Version de l'application** : 0.0.5
**Angular** : 20.2.0
