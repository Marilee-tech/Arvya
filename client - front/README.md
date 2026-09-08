# ARVYA

## Le carnet de vie partagé

ARVYA est une application web permettant aux familles et aux professionnels de l'accompagnement de partager les informations importantes concernant une personne accompagnée.

L'objectif est de centraliser les transmissions, les rendez-vous, les contacts et les informations utiles afin de faciliter la communication entre les différents intervenants.

> Projet réalisé dans le cadre de ma formation en développement web.

---

## Fonctionnalités

### Authentification
- Connexion utilisateur
- Mot de passe sécurisé avec bcrypt
- Authentification avec JWT
- Gestion des comptes actifs et inactifs

### Gestion des rôles

L'application possède trois types d'utilisateurs :

- Administrateur
- Professionnel
- Famille

Les autorisations sont contrôlées côté backend selon le rôle de l'utilisateur.

### Personnes accompagnées
- Création
- Consultation
- Modification
- Suppression

Une famille peut uniquement consulter les personnes accompagnées auxquelles elle est associée.

### Transmissions
- Création
- Consultation
- Modification
- Suppression
- Gestion de la visibilité des transmissions

Les transmissions peuvent notamment être rendues visibles à la famille.

Une famille peut uniquement consulter les transmissions autorisées concernant les personnes auxquelles elle est associée.

### Rendez-vous
- Création
- Consultation
- Modification
- Suppression

### Contacts
- Création
- Consultation
- Modification
- Suppression

### Associations

Une table Association permet de relier les utilisateurs aux personnes accompagnées.

Elle permet notamment de contrôler les données accessibles aux utilisateurs ayant le rôle Famille.

---

## Technologies utilisées

### Frontend

- React
- JavaScript
- HTML
- CSS

### Backend

- Node.js
- Express.js
- MySQL
- mysql2

### Sécurité

- bcrypt
- JSON Web Token (JWT)
- Middleware d'authentification
- Gestion des autorisations par rôle

### Outils

- Visual Studio Code
- DBeaver
- Thunder Client
- Git
- GitHub
- Figma

---

## Base de données

La base de données ARVYA contient notamment les tables suivantes :

- Utilisateur
- Personne_Accompagnee
- Association
- Contact
- Transmission
- Rendez_vous

---

## Architecture du backend

Le backend utilise une organisation basée sur :

- **Routes** : définissent les endpoints de l'API.
- **Controllers** : traitent les requêtes et les réponses.
- **Models** : communiquent avec la base de données MySQL.
- **Middleware** : contrôle l'authentification et les autorisations.

Exemple :

Utilisateur → Route → Middleware → Controller → Model → MySQL

---

## Installation

Cloner le projet :

```bash
git clone URL_DU_REPOSITORY
```

Installer les dépendances :

```bash
npm install
```

Créer un fichier `.env` avec les variables d'environnement nécessaires.

Exemple :

```env
DB_HOST=
DB_USER=
DB_PASSWORD=
DB_NAME=
JWT_SECRET=
PORT=3000
```

⚠️ Le fichier `.env` ne doit jamais être envoyé sur GitHub.

---

## Lancer le backend

Depuis le dossier backend :

```bash
npm run dev
```

Le serveur est accessible par défaut sur :

```text
http://localhost:3000
```

---

## API

Quelques exemples de routes disponibles :

```text
POST   /auth/login

GET    /users
POST   /users
PUT    /users/:id
DELETE /users/:id

GET    /patients
POST   /patients
PUT    /patients/:id
DELETE /patients/:id

GET    /contacts
POST   /contacts
PUT    /contacts/:id
DELETE /contacts/:id

GET    /transmissions
POST   /transmissions
PUT    /transmissions/:id
DELETE /transmissions/:id

GET    /rendezvous
POST   /rendezvous
PUT    /rendezvous/:id
DELETE /rendezvous/:id
```

Certaines routes nécessitent un JWT et des autorisations spécifiques selon le rôle de l'utilisateur.

---

## État du projet

🚧 ARVYA est actuellement en cours de développement.

Backend :
- CRUD : terminé
- Connexion MySQL : terminée
- Authentification JWT : terminée
- Gestion des rôles : terminée
- Filtrage des données Famille : terminé
- Tests et vérifications finales : en cours

Frontend :
- Maquettes : réalisées
- Développement React : en cours

---

## Évolutions envisagées

À terme, ARVYA pourrait intégrer :

- une application mobile ;
- des notifications ;
- la transcription vocale ;
- des statistiques et tableaux de bord ;
- des fonctionnalités basées sur l'intelligence artificielle ;
- la reformulation de certaines transmissions professionnelles dans un langage plus accessible aux familles.

---

## Auteur

Projet développé par Marilee Caille dans le cadre de sa formation en développement web.