# Qafilti Front

Application Angular (PrimeNG) pour la gestion d’un service de transport/voyage: réservations, passagers, colis, paiements, rapports et administration des paramètres. Interface maquettée (mock) prête à être branchée à un backend.

## Fonctionnalités disponibles
- Tableau de bord
  - Cartes KPI (réservations du jour, colis en transit, revenus mensuels)
- Réservations
  - Création et modification
  - Confirmation (Brouillon → Confirmée)
  - Impression simple (impression navigateur)
- Passagers
  - Liste avec ajout/édition/suppression (mock)
- Colis
  - Enregistrement (poids, tarif, statut), marquage « Livré »
- Paiements
  - Tableau de paiements (mock)
- Rapports
  - KPIs (ventes billets/colis, taux de remplissage estimé) et tableau des revenus par trajet (mock)
- Administration
  - Onglets PrimeNG (Trajets, Véhicules, Tarifs)
- Authentification (mock)
  - Connexion et Inscription (routes /login et /inscription)
  - Menubar dynamique (affiche « Se connecter/Inscription » ou « Bonjour, <nom> » + « Déconnexion »)

Ces écrans sont fonctionnels côté UI avec des données simulées pour exploration et validation UX.

## Structure du projet (extrait)
- src/app/features/
  - dashboard/
  - reservations/
  - passagers/
  - colis/
  - paiements/
  - rapports/
  - admin/
- Chaque feature est un composant standalone avec fichiers séparés: .ts, .html, .css
- Auth mock: src/app/auth/login/, src/app/auth/register/, service src/app/auth/auth.service.ts

## Thème PrimeNG et styles
- Thème appliqué: Lara Light (preset) via providePrimeNG
- Import dans src/app/app.config.ts:
```ts
import { providePrimeNG } from 'primeng/config';
import Lara from '@primeng/themes/lara';

providePrimeNG({
  theme: { preset: Lara }
});
```
- Ne pas importer de CSS de thème dans styles.css (ex: @primeng/themes/lara-light-blue.css) avec PrimeNG v20+.
- Icônes: primeicons sont importées dans src/styles.css.
- Mise en page: site centré avec un conteneur .app-container et une largeur maximale responsive (~80vw), fond gris clair sur les bords.

## Navigation
- Routes principales: 
  - / (Dashboard)
  - /reservations, /passagers, /colis, /paiements, /rapports, /admin
  - /login, /inscription (auth mock)

## Démarrer le projet
Installer les dépendances puis lancer le serveur de développement:
```bash
npm install
ng serve
```
Application disponible sur http://localhost:4200/

## Construction (build)
```bash
ng build
```

## Tests
```bash
ng test
```

## Notes
- Données mock: aucune persistance; rafraîchir la page réinitialise l’état.
- Les composants utilisent PrimeNG v20 et Angular standalone.

## Changelog (résumé)
- Correction PrimeNG Tabs (usage <p-tabs> + <p-tablist>/<p-tabpanels>) dans Administration.
- Passage au thème Lara via preset providePrimeNG, suppression de l’import CSS de thème.
- Mise en page centrée, largeur max responsive (~80vw).
- Refactor: 6 composants déplacés dans des sous-dossiers avec séparation HTML/CSS.
- Dashboard refactoré vers structure split.
- Ajout Auth (mock): Login/Registration + routes, Menubar dynamique.
- Correction d’avertissements Angular (*ngIf) via import de NgIf.
