# Documentation Fonctionnelle - Qafilti Front

## Table des Matières

1. [Introduction](#introduction)
2. [Accès à l'Application](#accès-à-lapplication)
3. [Rôles et Permissions](#rôles-et-permissions)
4. [Connexion](#connexion)
5. [Tableau de Bord](#tableau-de-bord)
6. [Gestion des Réservations](#gestion-des-réservations)
7. [Gestion des Passagers](#gestion-des-passagers)
8. [Gestion des Colis](#gestion-des-colis)
9. [Gestion des Paiements](#gestion-des-paiements)
10. [Rapports et Statistiques](#rapports-et-statistiques)
11. [Administration](#administration)
12. [Guide Utilisateur par Rôle](#guide-utilisateur-par-rôle)
13. [FAQ](#faq)

---

## Introduction

**Qafilti Front** est une application web moderne de gestion complète pour un service de transport/voyage. Elle permet de gérer efficacement les réservations, les passagers, les colis, les paiements et d'obtenir des rapports détaillés sur l'activité.

### Fonctionnalités Principales

- 📊 **Tableau de bord** avec indicateurs clés de performance
- 🎫 **Réservations** : Création, modification, confirmation
- 👥 **Passagers** : Base de données clients
- 📦 **Colis** : Suivi des expéditions
- 💳 **Paiements** : Gestion financière
- 📈 **Rapports** : Statistiques et analyses
- ⚙️ **Administration** : Configuration système

### Objectifs

- Simplifier la gestion quotidienne du transport
- Centraliser toutes les informations
- Améliorer le suivi des réservations et colis
- Fournir des rapports en temps réel

---

## Accès à l'Application

### URL d'Accès

**Développement** : `http://localhost:4200`
**Production** : `https://votre-domaine.com`

### Navigation

L'application dispose d'un menu principal en haut de page permettant d'accéder à toutes les fonctionnalités selon vos permissions.

### Support Navigateurs

| Navigateur | Version Minimale |
|------------|------------------|
| Chrome | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| Edge | 90+ |

---

## Rôles et Permissions

L'application utilise un système de rôles pour contrôler l'accès aux fonctionnalités.

### Les 3 Rôles

#### 🔵 Agent Comptoir

**Responsabilités** : Gestion des voyageurs et réservations

**Accès** :
- ✅ Tableau de bord
- ✅ Réservations (création, modification, confirmation)
- ✅ Passagers (gestion complète)
- ❌ Colis
- ❌ Paiements
- ❌ Rapports
- ❌ Administration

**Cas d'usage typique** :
- Accueillir les clients au comptoir
- Créer de nouvelles réservations
- Confirmer les réservations
- Enregistrer les informations passagers

#### 🟢 Agent Caissier

**Responsabilités** : Gestion financière et logistique

**Accès** :
- ✅ Tableau de bord
- ❌ Réservations
- ❌ Passagers
- ✅ Colis (enregistrement, suivi, livraison)
- ✅ Paiements (consultation)
- ❌ Rapports
- ❌ Administration

**Cas d'usage typique** :
- Enregistrer les colis à expédier
- Marquer les colis comme livrés
- Consulter les paiements
- Gérer les encaissements

#### 🔴 Administrateur

**Responsabilités** : Supervision et configuration

**Accès** :
- ✅ **Accès complet à toutes les fonctionnalités**
- ✅ Rapports et statistiques
- ✅ Configuration système (trajets, véhicules, tarifs)

**Cas d'usage typique** :
- Superviser l'activité globale
- Consulter les rapports
- Configurer les trajets et tarifs
- Gérer la flotte de véhicules

### Matrice de Permissions

| Fonctionnalité | Comptoir | Caissier | Admin |
|----------------|----------|----------|-------|
| Tableau de bord | ✅ | ✅ | ✅ |
| Réservations | ✅ | ❌ | ✅ |
| Passagers | ✅ | ❌ | ✅ |
| Colis | ❌ | ✅ | ✅ |
| Paiements | ❌ | ✅ | ✅ |
| Rapports | ❌ | ❌ | ✅ |
| Administration | ❌ | ❌ | ✅ |

---

## Connexion

### Page de Connexion

1. Ouvrir l'application dans votre navigateur
2. Vous serez automatiquement redirigé vers la page de connexion
3. Saisir votre email et mot de passe
4. Cliquer sur **Connexion**

### Comptes de Test

Pour la phase de test/démonstration, utilisez ces comptes :

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| **Agent Comptoir** | comptoir@qafilti.com | comptoir123 |
| **Agent Caissier** | caissier@qafilti.com | caissier123 |
| **Administrateur** | admin@qafilti.com | admin123 |

💡 **Astuce** : Ces comptes sont affichés directement sur la page de connexion avec un bouton "Utiliser" pour remplir automatiquement le formulaire.

### Que faire si...

**❌ "Email ou mot de passe incorrect"**
- Vérifiez que vous avez bien saisi l'email complet
- Vérifiez les majuscules/minuscules du mot de passe
- Utilisez un des comptes de test ci-dessus

**❌ "Accès refusé" après connexion**
- Vérifiez que votre rôle vous donne accès à cette page
- Consultez la matrice de permissions ci-dessus
- Contactez un administrateur si nécessaire

### Déconnexion

1. Cliquer sur votre nom en haut à droite du menu
2. Sélectionner **Déconnexion**

---

## Tableau de Bord

### Vue d'Ensemble

Le tableau de bord est la page d'accueil après connexion. Il affiche les indicateurs clés de performance (KPI) en temps réel.

### Indicateurs Affichés

#### 📊 Réservations du Jour

Nombre de réservations effectuées aujourd'hui.

**Utilité** : Suivre l'activité quotidienne

#### 📦 Colis en Transit

Nombre de colis actuellement en cours d'acheminement.

**Utilité** : Surveiller les expéditions en cours

#### 💰 Revenus du Mois

Montant total des revenus du mois en cours.

**Utilité** : Suivi financier mensuel

### Actions Disponibles

Chaque carte KPI peut vous rediriger vers la section détaillée correspondante.

---

## Gestion des Réservations

**🔑 Accès** : Agent Comptoir, Administrateur

### Vue d'Ensemble

La page **Réservations** permet de gérer l'ensemble des réservations de voyage.

### Fonctionnalités

#### 📋 Liste des Réservations

**Colonnes affichées** :
- **Code** : Identifiant unique (ex: RSV-0001)
- **Passager** : Nom du voyageur
- **Trajet** : Origine → Destination
- **Date** : Date du voyage
- **Prix** : Montant en euros
- **Statut** : Brouillon ou Confirmée

**Actions sur chaque ligne** :
- ✏️ **Modifier** : Éditer les détails
- ✅ **Confirmer** : Passer de Brouillon à Confirmée
- 🖨️ **Imprimer** : Imprimer la réservation
- ❌ **Supprimer** : Supprimer la réservation

#### ➕ Créer une Réservation

1. Cliquer sur le bouton **Nouvelle**
2. Remplir le formulaire :
   - **Passager** : Nom complet
   - **Trajet** : Route (ex: Casa → Rabat)
   - **Date** : Date du voyage
   - **Prix** : Montant en euros
   - **Statut** : Brouillon (par défaut)
3. Cliquer sur **Enregistrer**

**💡 Note** : Un code unique est généré automatiquement (RSV-XXXX)

#### ✏️ Modifier une Réservation

1. Cliquer sur l'icône **Modifier** (crayon)
2. Modifier les informations souhaitées
3. Cliquer sur **Enregistrer**

#### ✅ Confirmer une Réservation

Les réservations sont créées en statut **Brouillon** par défaut.

**Pour confirmer** :
1. Cliquer sur l'icône **Confirmer** (coche verte)
2. Le statut passe automatiquement à **Confirmée**

**Différence** :
- **Brouillon** : Réservation provisoire, peut être modifiée librement
- **Confirmée** : Réservation validée, engagement client

#### 🖨️ Imprimer une Réservation

1. Cliquer sur l'icône **Imprimer**
2. La fenêtre d'impression du navigateur s'ouvre
3. Sélectionner votre imprimante ou enregistrer en PDF

#### 🔍 Rechercher une Réservation

Utilisez la barre de recherche en haut de la liste pour filtrer par :
- Code de réservation
- Nom du passager
- Trajet
- Statut

---

## Gestion des Passagers

**🔑 Accès** : Agent Comptoir, Administrateur

### Vue d'Ensemble

La page **Passagers** permet de gérer la base de données des clients.

### Fonctionnalités

#### 📋 Liste des Passagers

**Colonnes affichées** :
- **Nom** : Nom complet du passager
- **Téléphone** : Numéro de contact
- **Document** : CIN ou Passeport

**Actions sur chaque ligne** :
- ✏️ **Modifier** : Éditer les informations
- ❌ **Supprimer** : Supprimer le passager

#### ➕ Ajouter un Passager

1. Cliquer sur le bouton **Ajouter**
2. Remplir le formulaire :
   - **Nom complet**
   - **Téléphone**
   - **Document** : Numéro CIN ou Passeport
3. Cliquer sur **Enregistrer**

#### ✏️ Modifier un Passager

1. Cliquer sur l'icône **Modifier**
2. Modifier les informations
3. Cliquer sur **Enregistrer**

#### 🔍 Rechercher un Passager

Utilisez la barre de recherche pour filtrer par :
- Nom
- Téléphone
- Numéro de document

### Bonnes Pratiques

- ✅ Vérifier que le passager n'existe pas déjà avant d'en créer un nouveau
- ✅ Saisir le numéro de téléphone complet (avec indicatif)
- ✅ Vérifier l'orthographe du nom (utilisé pour les réservations)

---

## Gestion des Colis

**🔑 Accès** : Agent Caissier, Administrateur

### Vue d'Ensemble

La page **Colis** permet de gérer les expéditions de colis.

### Fonctionnalités

#### 📋 Liste des Colis

**Colonnes affichées** :
- **Code** : Identifiant unique (ex: CLS-0001)
- **Expéditeur** : Nom de l'expéditeur
- **Destinataire** : Nom du destinataire
- **Poids** : Poids en kg
- **Tarif** : Coût de l'expédition
- **Statut** : En transit ou Livré

**Actions sur chaque ligne** :
- ✏️ **Modifier** : Éditer les détails
- ✅ **Marquer livré** : Changer le statut à Livré
- ❌ **Supprimer** : Supprimer le colis

#### ➕ Enregistrer un Colis

1. Cliquer sur le bouton **Nouveau**
2. Remplir le formulaire :
   - **Expéditeur** : Nom de l'expéditeur
   - **Destinataire** : Nom du destinataire
   - **Poids** : Poids en kilogrammes
   - **Tarif** : Montant à payer
   - **Statut** : En transit (par défaut)
3. Cliquer sur **Enregistrer**

**💡 Note** : Un code unique est généré automatiquement (CLS-XXXX)

#### 📍 Suivre un Colis

**Statuts disponibles** :
- 🟡 **En transit** : Colis en cours d'acheminement
- 🟢 **Livré** : Colis remis au destinataire

#### ✅ Marquer un Colis comme Livré

1. Localiser le colis dans la liste
2. Cliquer sur l'icône **Marquer livré**
3. Le statut passe automatiquement à **Livré**

#### 🔍 Rechercher un Colis

Utilisez la barre de recherche pour filtrer par :
- Code de colis
- Nom de l'expéditeur
- Nom du destinataire
- Statut

### Workflow Typique

1. **Réception** : Client apporte un colis → Enregistrer dans le système
2. **Transit** : Colis chargé dans le véhicule → Statut "En transit"
3. **Livraison** : Colis remis au destinataire → Marquer comme "Livré"

---

## Gestion des Paiements

**🔑 Accès** : Agent Caissier, Administrateur

### Vue d'Ensemble

La page **Paiements** permet de consulter l'historique des transactions financières.

### Fonctionnalités

#### 📋 Liste des Paiements

**Colonnes affichées** :
- **Référence** : Numéro de paiement
- **Type** : Acompte ou Solde
- **Montant** : Somme payée
- **Mode** : Carte bancaire, Virement, ou Espèces
- **Note** : Commentaire optionnel

#### 💳 Types de Paiement

**Acompte** : Paiement partiel initial
- Exemple : 500 € sur un total de 2000 €

**Solde** : Paiement final du reste dû
- Exemple : 1500 € restants

#### 🏦 Modes de Paiement

- **Carte bancaire** : Paiement par CB
- **Virement** : Virement bancaire
- **Espèces** : Paiement en liquide

#### 🔍 Rechercher un Paiement

Utilisez la barre de recherche pour filtrer par :
- Référence
- Type
- Mode de paiement
- Montant

### Consultation

**Note** : Dans la version actuelle, la page Paiements est en **lecture seule**. L'enregistrement des paiements se fait via le module de réservation.

---

## Rapports et Statistiques

**🔑 Accès** : Administrateur uniquement

### Vue d'Ensemble

La page **Rapports** fournit une vision analytique de l'activité.

### KPIs Globaux

#### 📊 Ventes de Billets

Nombre total de billets vendus (calculé en euros).

#### 📦 Ventes de Colis

Chiffre d'affaires généré par les expéditions de colis.

#### 📈 Taux de Remplissage

Pourcentage d'occupation moyenne des véhicules.

**Interprétation** :
- **> 80%** : Excellente occupation
- **60-80%** : Bonne occupation
- **< 60%** : Occupation à améliorer

### Revenus par Trajet

Tableau détaillé affichant pour chaque trajet :
- **Trajet** : Origine → Destination
- **Nombre** : Nombre de réservations
- **Revenu** : Chiffre d'affaires généré

**Utilité** :
- Identifier les trajets les plus rentables
- Optimiser les horaires selon la demande
- Ajuster les tarifs

### Analyse

Ces rapports permettent de :
- ✅ Suivre la performance globale
- ✅ Identifier les tendances
- ✅ Prendre des décisions stratégiques
- ✅ Optimiser la rentabilité

---

## Administration

**🔑 Accès** : Administrateur uniquement

### Vue d'Ensemble

La page **Administration** permet de configurer les paramètres système essentiels.

### Sections

L'interface est organisée en 3 onglets :

#### 🗺️ Trajets

**Gestion des routes** disponibles pour les voyages.

**Informations** :
- **Code** : Identifiant du trajet (ex: TRJ-01)
- **Origine** : Ville de départ
- **Destination** : Ville d'arrivée

**Actions** :
- ➕ **Ajouter** un nouveau trajet
- ✏️ **Modifier** un trajet existant
- ❌ **Supprimer** un trajet

**Exemple** :
- Code : TRJ-01
- Origine : Casa
- Destination : Rabat

#### 🚌 Véhicules

**Gestion de la flotte** de transport.

**Informations** :
- **Matricule** : Immatriculation du véhicule
- **Modèle** : Type de véhicule
- **Capacité** : Nombre de places

**Actions** :
- ➕ **Ajouter** un nouveau véhicule
- ✏️ **Modifier** un véhicule existant
- ❌ **Supprimer** un véhicule

**Exemple** :
- Matricule : ABC-123
- Modèle : Mercedes Sprinter
- Capacité : 18 places

#### 💰 Tarifs

**Gestion des prix** par trajet.

**Informations** :
- **Trajet** : Route concernée
- **Prix** : Tarif en euros

**Actions** :
- ➕ **Ajouter** un nouveau tarif
- ✏️ **Modifier** un tarif existant
- ❌ **Supprimer** un tarif

**Exemple** :
- Trajet : Casa → Rabat
- Prix : 12 €

### Bonnes Pratiques

- ✅ Vérifier qu'un trajet existe avant de créer un tarif
- ✅ Maintenir les informations véhicules à jour
- ✅ Ajuster les tarifs selon la demande
- ⚠️ Ne pas supprimer un trajet avec des réservations actives

---

## Guide Utilisateur par Rôle

### 🔵 Agent Comptoir - Journée Type

**8h00 - Ouverture**
1. Se connecter avec `comptoir@qafilti.com`
2. Consulter le tableau de bord
3. Vérifier les réservations du jour

**9h00-12h00 - Gestion des Réservations**
1. Accueillir les clients
2. Créer de nouvelles réservations
3. Enregistrer les informations passagers
4. Confirmer les réservations payées

**14h00-17h00 - Suivi**
1. Modifier les réservations si nécessaire
2. Imprimer les confirmations
3. Mettre à jour la base passagers

**Tâches Principales** :
- ✅ Création de réservations
- ✅ Confirmation des réservations
- ✅ Gestion des passagers
- ✅ Service client

---

### 🟢 Agent Caissier - Journée Type

**8h00 - Ouverture**
1. Se connecter avec `caissier@qafilti.com`
2. Consulter le tableau de bord
3. Vérifier les colis en transit

**9h00-12h00 - Enregistrement Colis**
1. Réceptionner les colis clients
2. Enregistrer dans le système
3. Calculer et encaisser les frais
4. Remettre un reçu

**14h00-17h00 - Livraisons**
1. Marquer les colis livrés
2. Consulter les paiements
3. Gérer les encaissements

**Tâches Principales** :
- ✅ Enregistrement des colis
- ✅ Suivi des livraisons
- ✅ Gestion des paiements
- ✅ Caisse

---

### 🔴 Administrateur - Tâches

**Quotidiennes**
1. Se connecter avec `admin@qafilti.com`
2. Consulter le tableau de bord global
3. Vérifier les rapports

**Hebdomadaires**
1. Analyser les revenus par trajet
2. Évaluer le taux de remplissage
3. Identifier les optimisations possibles

**Mensuelles**
1. Ajuster les tarifs si nécessaire
2. Mettre à jour la flotte de véhicules
3. Ajouter de nouveaux trajets si demande

**Tâches Principales** :
- ✅ Supervision globale
- ✅ Analyse des performances
- ✅ Configuration système
- ✅ Optimisation

---

## FAQ

### Questions Générales

**Q: Puis-je accéder à l'application depuis mon téléphone ?**
R: Oui, l'application est responsive et fonctionne sur mobile, tablette et ordinateur.

**Q: Mes données sont-elles sauvegardées ?**
R: Actuellement, les données sont en mode "démo" et se réinitialisent au rafraîchissement de la page. En production, toutes les données seront sauvegardées sur le serveur.

**Q: Puis-je changer mon mot de passe ?**
R: Cette fonctionnalité sera disponible dans une version future.

### Connexion

**Q: J'ai oublié mon mot de passe**
R: Contactez un administrateur pour réinitialiser votre mot de passe.

**Q: Pourquoi suis-je redirigé vers /login ?**
R: Votre session a expiré ou vous n'êtes pas authentifié. Reconnectez-vous.

### Permissions

**Q: Je ne vois pas le menu "Administration"**
R: Cette section est réservée aux administrateurs. Contactez votre responsable si vous pensez avoir besoin de cet accès.

**Q: Message "Accès refusé" affiché**
R: Vous tentez d'accéder à une page pour laquelle vous n'avez pas les permissions. Vérifiez la matrice de permissions de votre rôle.

### Réservations

**Q: Comment annuler une réservation ?**
R: Utilisez le bouton "Supprimer" sur la ligne de la réservation concernée.

**Q: Puis-je modifier une réservation confirmée ?**
R: Oui, cliquez sur "Modifier" même pour les réservations confirmées.

**Q: Le code RSV-XXXX est-il unique ?**
R: Oui, chaque réservation reçoit un code unique généré automatiquement.

### Colis

**Q: Comment suivre un colis ?**
R: Recherchez le code du colis (CLS-XXXX) dans la liste. Le statut indique s'il est en transit ou livré.

**Q: Puis-je annuler un marquage "Livré" ?**
R: Oui, modifiez le colis et changez le statut à "En transit".

**Q: Comment calculer le tarif d'un colis ?**
R: Consultez la grille tarifaire dans Administration → Tarifs, ou contactez un administrateur.

### Rapports

**Q: Les rapports sont-ils en temps réel ?**
R: Oui, les KPIs et statistiques sont calculés en temps réel à partir des données actuelles.

**Q: Puis-je exporter les rapports ?**
R: Cette fonctionnalité sera disponible dans une version future (export Excel/PDF).

### Technique

**Q: Quelle est la limite de caractères pour les champs ?**
R: Aucune limite stricte, mais restez raisonnables (nom: ~50 caractères, notes: ~200 caractères).

**Q: L'application fonctionne-t-elle hors ligne ?**
R: Non, une connexion internet est requise.

**Q: Quels navigateurs sont supportés ?**
R: Chrome, Firefox, Safari et Edge (versions récentes).

---

## Support et Contact

### Aide

Pour toute question ou problème :

1. **Documentation** : Consultez ce guide en premier
2. **Administrateur** : Contactez votre administrateur système
3. **Support technique** : support@qafilti.com (si configuré)

### Signaler un Bug

Si vous rencontrez un problème :

1. Notez les étapes pour reproduire le bug
2. Faites une capture d'écran si possible
3. Contactez l'administrateur avec ces informations

### Demande de Fonctionnalité

Pour suggérer une amélioration :

1. Décrivez clairement la fonctionnalité souhaitée
2. Expliquez le cas d'usage
3. Contactez l'administrateur

---

## Glossaire

| Terme | Définition |
|-------|------------|
| **Brouillon** | Réservation non confirmée, provisoire |
| **Confirmée** | Réservation validée et payée |
| **En transit** | Colis en cours d'acheminement |
| **Livré** | Colis remis au destinataire |
| **KPI** | Indicateur clé de performance |
| **Acompte** | Paiement partiel initial |
| **Solde** | Paiement final du reste dû |
| **RBAC** | Contrôle d'accès basé sur les rôles |

---

## Annexes

### Raccourcis Clavier

| Raccourci | Action |
|-----------|--------|
| Ctrl + P | Imprimer (sur une réservation) |
| Entrée | Valider un formulaire |
| Échap | Fermer un dialogue |

### Codes Couleur

| Couleur | Signification |
|---------|---------------|
| 🟢 Vert | Confirmé / Livré / Actif |
| 🟡 Jaune | Brouillon / En transit / En attente |
| 🔴 Rouge | Action de suppression |
| 🔵 Bleu | Information / Navigation |

---

**Documentation mise à jour le** : 25 Octobre 2024
**Version de l'application** : 0.0.3

---

## Historique des Versions

### Version 0.0.3 (Actuelle)
- ✅ Système de rôles et permissions
- ✅ Comptes de test disponibles
- ✅ Amélioration UI page de connexion

### Version 0.0.2
- ✅ Séparation en services
- ✅ Amélioration des performances
- ✅ Préparation intégration API

### Version 0.0.1
- ✅ MVP initial
- ✅ Fonctionnalités de base
- ✅ Interface utilisateur

---

**Merci d'utiliser Qafilti Front !** 🚀
