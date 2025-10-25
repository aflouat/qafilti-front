# Guide d'Intégration API

Ce document explique comment passer des données mock aux APIs réelles pour le projet Qafilti Front.

## État Actuel

✅ **Configuration HttpClient** : Ajoutée dans `app.config.ts`
✅ **Fichiers d'environnement** : Configurés avec URL API
✅ **Services avec Signals** : 8 services prêts pour l'intégration
✅ **Configuration Mockoon** : 29 endpoints disponibles dans `src/assets/qafilti-mockoon.json`

❌ **Services utilisent actuellement** : Données mock en mémoire
❌ **HttpClient non implémenté** : Dans les services actifs

---

## Architecture Actuelle vs Future

### Actuellement (Mock)
```typescript
@Injectable({ providedIn: 'root' })
export class ReservationsService {
  private readonly _reservations = signal<Reservation[]>([
    { id: 1, code: 'RSV-0001', ... }  // Données hardcodées
  ]);

  create(reservation: Omit<Reservation, 'id' | 'code'>): Reservation {
    const newReservation = { id: this.generateId(), ... };
    this._reservations.update(reservations => [newReservation, ...reservations]);
    return newReservation;
  }
}
```

### Avec API (HttpClient)
```typescript
@Injectable({ providedIn: 'root' })
export class ReservationsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/reservations`;

  private readonly _reservations = signal<Reservation[]>([]);

  constructor() {
    this.loadReservations(); // Charger depuis l'API
  }

  create(reservation: Omit<Reservation, 'id' | 'code'>): Observable<Reservation> {
    return this.http.post<Reservation>(this.apiUrl, reservation)
      .pipe(tap(r => this._reservations.update(list => [r, ...list])));
  }
}
```

---

## Configuration de l'Environnement

### Fichiers créés

**Development** (`src/environements/environment.ts`):
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3002/api'
};
```

**Production** (`src/environements/environment.prod.ts`):
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.qafilti.com/api' // À remplacer par votre URL
};
```

### Configuration HttpClient

**`src/app/app.config.ts`** - Déjà configuré ✅
```typescript
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    // ...
    provideHttpClient(withInterceptorsFromDi()),
    // ...
  ]
};
```

---

## Utiliser Mockoon pour le Développement

### 1. Installation de Mockoon

**Desktop App** (Recommandé):
```bash
# Télécharger depuis https://mockoon.com/download/
# Ou via npm:
npm install -g @mockoon/cli
```

### 2. Démarrer le serveur Mock

**Option A: Desktop App**
1. Ouvrir Mockoon Desktop
2. File → Open environment → Sélectionner `src/assets/qafilti-mockoon.json`
3. Cliquer sur le bouton "Play" pour démarrer le serveur
4. Le serveur écoute sur `http://localhost:3002`

**Option B: CLI**
```bash
mockoon-cli start --data src/assets/qafilti-mockoon.json
```

### 3. Vérifier que Mockoon fonctionne

```bash
# Tester l'API
curl http://localhost:3002/api/reservations

# Devrait retourner un tableau JSON de réservations
```

---

## Endpoints API Disponibles

D'après la configuration Mockoon (`src/assets/qafilti-mockoon.json`), voici les endpoints:

### Réservations
- `GET    /api/reservations` - Liste toutes les réservations
- `POST   /api/reservations` - Créer une réservation
- `GET    /api/reservations/:id` - Détails d'une réservation
- `PUT    /api/reservations/:id` - Modifier une réservation
- `DELETE /api/reservations/:id` - Supprimer une réservation

### Passagers
- `GET    /api/passengers` - Liste tous les passagers
- `POST   /api/passengers` - Créer un passager
- `PUT    /api/passengers/:id` - Modifier un passager
- `DELETE /api/passengers/:id` - Supprimer un passager

### Colis
- `GET    /api/parcels` - Liste tous les colis
- `POST   /api/parcels` - Créer un colis
- `PUT    /api/parcels/:id` - Modifier un colis
- `DELETE /api/parcels/:id` - Supprimer un colis

### Paiements
- `GET    /api/payments` - Liste tous les paiements
- `POST   /api/payments` - Créer un paiement

### Rapports
- `GET    /api/reports/kpis` - Récupérer les KPIs
- `GET    /api/reports/revenue-by-trip` - Revenus par trajet

### Administration
- `GET    /api/buses` - Liste des véhicules
- `POST   /api/buses` - Créer un véhicule
- `PUT    /api/buses/:id` - Modifier un véhicule
- `DELETE /api/buses/:id` - Supprimer un véhicule

- `GET    /api/trips` - Liste des trajets
- `GET    /api/tariffs` - Liste des tarifs
- `POST   /api/tariffs` - Créer un tarif
- `PUT    /api/tariffs/:id` - Modifier un tarif
- `DELETE /api/tariffs/:id` - Supprimer un tarif

### Villes
- `GET    /api/cities` - Liste des villes
- `POST   /api/cities` - Créer une ville
- `GET    /api/cities/:id` - Détails d'une ville
- `PUT    /api/cities/:id` - Modifier une ville
- `DELETE /api/cities/:id` - Supprimer une ville
- `GET    /api/cities/search` - Rechercher des villes

---

## Migration Étape par Étape

### Exemple: Migrer ReservationsService

Un fichier exemple a été créé : `src/app/core/services/reservations.service.http-example.ts`

**Étapes pour migrer:**

1. **Sauvegarder la version mock actuelle** (optionnel):
```bash
cp src/app/core/services/reservations.service.ts \
   src/app/core/services/reservations.service.mock.ts
```

2. **Copier l'exemple HTTP**:
```bash
cp src/app/core/services/reservations.service.http-example.ts \
   src/app/core/services/reservations.service.ts
```

3. **Démarrer Mockoon** (voir section ci-dessus)

4. **Lancer l'application**:
```bash
npm start
```

5. **Tester dans le navigateur**:
- Ouvrir `http://localhost:4200/reservations`
- Les données devraient maintenant venir de l'API Mockoon
- Vérifier la console du navigateur (F12) pour les logs HTTP

### Pattern à Suivre pour Tous les Services

```typescript
import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environements/environment';

@Injectable({ providedIn: 'root' })
export class YourService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/your-endpoint`;

  private readonly _data = signal<YourType[]>([]);
  readonly data = this._data.asReadonly();

  constructor() {
    this.loadData(); // Chargement initial
  }

  private loadData(): void {
    this.http.get<YourType[]>(this.apiUrl)
      .subscribe({
        next: (data) => this._data.set(data),
        error: (err) => console.error('Erreur API:', err)
      });
  }

  create(item: Omit<YourType, 'id'>): Observable<YourType> {
    return this.http.post<YourType>(this.apiUrl, item)
      .pipe(tap(newItem => this._data.update(list => [newItem, ...list])));
  }

  update(id: number, updates: Partial<YourType>): Observable<YourType> {
    return this.http.put<YourType>(`${this.apiUrl}/${id}`, updates)
      .pipe(tap(updated => {
        const index = this._data().findIndex(x => x.id === id);
        if (index !== -1) {
          this._data.update(list => {
            const newList = [...list];
            newList[index] = updated;
            return newList;
          });
        }
      }));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(tap(() => {
        this._data.update(list => list.filter(x => x.id !== id));
      }));
  }
}
```

---

## Gestion des Erreurs

### Intercepteur HTTP (Optionnel mais Recommandé)

Créer `src/app/core/interceptors/error.interceptor.ts`:

```typescript
import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error) => {
      console.error('Erreur HTTP:', error);

      if (error.status === 401) {
        // Rediriger vers login
      }

      if (error.status === 500) {
        // Afficher un message d'erreur global
      }

      return throwError(() => error);
    })
  );
};
```

**Enregistrer dans `app.config.ts`:**
```typescript
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { errorInterceptor } from './core/interceptors/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // ...
    provideHttpClient(
      withInterceptors([errorInterceptor])
    ),
    // ...
  ]
};
```

---

## Gestion des Composants

### Mise à Jour Nécessaire dans les Composants

**AVANT** (avec services mock synchrones):
```typescript
save() {
  if (this.currentId) {
    this.reservationsService.update(this.currentId, this.form);
  } else {
    this.reservationsService.create(this.form);
  }
  this.dialog = false;
}
```

**APRÈS** (avec services HTTP asynchrones):
```typescript
save() {
  if (this.currentId) {
    this.reservationsService.update(this.currentId, this.form)
      .subscribe({
        next: () => {
          this.dialog = false;
          // Optionnel: afficher un message de succès
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour:', err);
          // Optionnel: afficher un message d'erreur
        }
      });
  } else {
    this.reservationsService.create(this.form)
      .subscribe({
        next: () => {
          this.dialog = false;
        },
        error: (err) => {
          console.error('Erreur lors de la création:', err);
        }
      });
  }
}
```

---

## Checklist de Migration

### Par Service

- [ ] **ReservationsService**
  - [ ] Ajouter HttpClient
  - [ ] Implémenter loadReservations()
  - [ ] Convertir create() en Observable
  - [ ] Convertir update() en Observable
  - [ ] Convertir delete() en Observable
  - [ ] Mettre à jour ReservationsComponent

- [ ] **PassagersService**
  - [ ] Ajouter HttpClient
  - [ ] Implémenter CRUD avec HTTP
  - [ ] Mettre à jour PassagersComponent

- [ ] **ColisService**
  - [ ] Ajouter HttpClient
  - [ ] Implémenter CRUD avec HTTP
  - [ ] Mettre à jour ColisComponent

- [ ] **PaiementsService**
  - [ ] Ajouter HttpClient
  - [ ] Implémenter GET avec HTTP
  - [ ] Mettre à jour PaiementsComponent

- [ ] **TrajetsService**
  - [ ] Ajouter HttpClient
  - [ ] Implémenter CRUD avec HTTP

- [ ] **VehiculesService**
  - [ ] Ajouter HttpClient
  - [ ] Implémenter CRUD avec HTTP

- [ ] **TarifsService**
  - [ ] Ajouter HttpClient
  - [ ] Implémenter CRUD avec HTTP

- [ ] **RapportsService**
  - [ ] Ajouter HttpClient
  - [ ] Implémenter GET KPIs
  - [ ] Implémenter GET Revenue

---

## Tests

### Tester avec Mockoon

```bash
# Terminal 1: Démarrer Mockoon
mockoon-cli start --data src/assets/qafilti-mockoon.json

# Terminal 2: Démarrer Angular
npm start

# Navigateur: Ouvrir
http://localhost:4200
```

### Tester avec Backend Réel

1. Mettre à jour `src/environements/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api' // Port de votre backend
};
```

2. S'assurer que le backend est démarré

3. Relancer Angular: `npm start`

---

## Déploiement en Production

### 1. Configuration

**`src/environements/environment.prod.ts`:**
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.qafilti.com/api' // URL de production
};
```

### 2. Build

```bash
npm run build
# Les fichiers sont dans dist/qafilti-ui/browser/
```

### 3. Variables d'Environnement (Alternative)

Pour éviter de hardcoder l'URL, utiliser un fichier `assets/config.json`:

**`src/assets/config.json`:**
```json
{
  "apiUrl": "http://localhost:3002/api"
}
```

**Charger au démarrage de l'app:**
```typescript
// src/app/app.config.ts
import { APP_INITIALIZER } from '@angular/core';
import { HttpClient } from '@angular/common/http';

function loadConfig(http: HttpClient) {
  return () => http.get('/assets/config.json')
    .toPromise()
    .then((config: any) => {
      // Stocker config globalement
      (window as any).config = config;
    });
}

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: loadConfig,
      deps: [HttpClient],
      multi: true
    },
    // ...
  ]
};
```

---

## Résumé

| Aspect | État | Action |
|--------|------|--------|
| Fichiers d'environnement | ✅ Créés | Mettre à jour l'URL de production |
| HttpClient | ✅ Configuré | Prêt à utiliser |
| Services | ⚠️ Mock | Migrer vers HTTP (exemple fourni) |
| Mockoon | ✅ Disponible | Démarrer pour tester |
| Composants | ⚠️ Sync | Convertir en async (subscribe) |

**Pour commencer**: Utiliser `reservations.service.http-example.ts` comme template et migrer un service à la fois.
