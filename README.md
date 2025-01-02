# Application de Gestion d'Utilisateurs

## Introduction
Cette documentation décrit l'**Application de Gestion d'Utilisateurs** développée avec **Angular 17**. L'application permet de gérer les utilisateurs avec des rôles et des permissions, tout en utilisant une API fictive pour simuler les opérations CRUD.

## Objectif
L'objectif principal de cette application est de fournir une interface utilisateur pour gérer les utilisateurs, y compris l'ajout, la modification, la suppression et l'affichage des détails des utilisateurs.

---

## Simulation de Backend avec `db.json`

### Contexte
Pour gérer les données des utilisateurs, des appels API étaient nécessaires. En raison des restrictions sur la modification d'une API existante, une approche de backend fictif a été choisie.

### Solution
Un fichier JSON nommé `db.json` a été créé pour simuler un backend API.

#### Documentation des Endpoints

- **GET /users** : Récupère la liste de tous les utilisateurs.

- **GET /users/{id}** : Récupère les détails d'un utilisateur spécifique.
  - Paramètre : `id` (Identifiant unique de l'utilisateur)

- **POST /users** : Ajoute un nouvel utilisateur.
  - Corps de la requête :
    ```json
    {
      "name": "Jane Doe",
      "email": "jane.doe@example.com",
      "role": "user"
    }
    ```

- **PUT /users/{id}** : Met à jour les informations d'un utilisateur existant.
  - Paramètre : `id` (Identifiant unique de l'utilisateur)
  - Corps de la requête :
    ```json
    {
      "name": "John Updated",
      "email": "john.updated@example.com",
      "role": "admin"
    }
    ```

- **DELETE /users/{id}** : Supprime un utilisateur spécifique.
  - Paramètre : `id` (Identifiant unique de l'utilisateur)

#### Configuration des URLs
Les URLs suivantes ont été configurées pour imiter les endpoints API :
- `/login` : Page d'authentification.
- `/users` : Récupère la liste des utilisateurs.
- `/user/:id` : Récupère les détails d'un utilisateur spécifique.
- `/add-user` : Ajoute un nouvel utilisateur.
- `/edit-user/:id` : Met à jour les informations d'un utilisateur existant.

#### Structure de `db.json`
```json
{
  "users": [
       {
      "id": "fcc13a2a-003f-43d5-935f-1e423f70638c",
      "name": "Leanne Grahams",
      "username": "Brets",
      "password": "$2a$10$wcuF3J6w.qugQ8svPqhfqOAvB6og9jMdiOmJA.p.rQj./VlcSwq7C",
      "email": "Sincere@april.biz",
      "phone": "1-770-736-8031 x56442",
      "website": "hildegard.org",
      "company": {
        "name": "Romaguera-Crona",
        "catchPhrase": "Multi-layered client-server neural-net",
        "bs": "harness real-time e-markets"
      },
      "address": {
        "street": "Kulas Light",
        "suite": "Apt. 556",
        "city": "Gwenborough",
        "zipcode": "92998-3874",
        "geo": {
          "lat": "-37.3159",
          "lng": "81.1496"
        }
      },
      "role": "admin"
    }
  ]
}
```

### Intégration dans l'Application
L'application utilise `db.json` pour les opérations de lecture et d'écriture, simulant le comportement réel d'une API via des requêtes HTTP. Le module **json-server** est utilisé pour servir ce fichier comme une API RESTful.

#### Avantages
- **Développement Rapide** : Permet le développement et les tests sans dépendre d'une API externe.
- **Flexibilité** : Facilité de modification des données dans `db.json` pour tester divers scénarios.
- **Simulation Réaliste** : Imite les interactions API, facilitant le développement et les tests.

---

## Structure de l'Application (Composants Standalone)

### Détails des Dossiers et Composants

- **`components/`** : Contient tous les composants de l'application, organisés par fonctionnalité.
  - **`auth/`** : Gère l'authentification des utilisateurs (connexion et inscription).
    - `auth.component.ts`
  - **`layout/`** : Inclut les composants de mise en page comme `header` et `footer`.
  - **`user/`** : Gère les fonctionnalités liées aux utilisateurs :
    - `user-form.component.ts` : Formulaire principal utilisé dans divers contextes.
    - `user-details.component.ts` : Affiche les détails d'un utilisateur.
    - `create-user.component.ts` : Formulaire pour ajouter un nouvel utilisateur.
    - `edit-user.component.ts` : Formulaire pour modifier les informations d'un utilisateur.
    - `user-list.component.ts` : Affiche la liste des utilisateurs.

- **`services/`** : Services Angular gérant la logique métier et les interactions API.
  - `user.service.ts` : Gère les opérations CRUD des utilisateurs.
  - `auth.service.ts` : Gère l'authentification des utilisateurs.

- **`guards/`** : Protège les routes de l'application.
  - `auth.guard.ts` : Vérifie l'authentification avant d'accéder à certaines routes.

- **`models/`** : Définit les modèles de données.
  - `user.model.ts` : Représente la structure des données utilisateur.

#### Avantages des Composants Standalone
- **Modularité** : Chaque composant est autonome, améliorant la maintenabilité.
- **Réutilisabilité** : Les composants peuvent être réutilisés dans l'application, réduisant la duplication de code.
- **Clarté** : Une structure organisée facilite la compréhension et la navigation.

---

## Gestion des Rôles et Permissions

### Rôles
- **Admin** : Droits complets, y compris la gestion des utilisateurs.
- **User** : Droits limités, principalement pour visualiser et modifier ses propres informations.

### Configuration des Routes avec Guards
Les guards protègent les routes en fonction des rôles, garantissant que seuls les utilisateurs autorisés accèdent aux fonctionnalités spécifiques.

---

## Tests Unitaires

### Contexte
Les tests unitaires valident le fonctionnement des composants et services individuels, assurant la fiabilité de l'application.

### Outils Utilisés
- **Jasmine** : Framework pour écrire des tests unitaires.
- **Karma** : Test runner pour exécuter les tests dans les navigateurs.

### Structure des Tests
- Les fichiers de test se trouvent à côté des fichiers source avec l'extension `.spec.ts`. Exemple : `user.service.spec.ts` pour `user.service.ts`.

### Commande pour Exécuter les Tests
```bash
ng test
```

---

## Installation du Projet

1. Installer les dépendances :
   ```bash
   npm install
   ```
2. Démarrer le serveur Angular :
   ```bash
   ng serve
   ```
3. Démarrer le simulateur d'API backend :
   ```bash
   npx json-server --watch db.json --port 3000
   ```

Le projet est maintenant accessible à l'adresse : [http://localhost:4200](http://localhost:4200)

Le simulateur d'API backend est disponible à l'adresse : [http://localhost:3000/users](http://localhost:3000/users)

---

## Conclusion
Cette documentation fournit un aperçu complet de l'**Application de Gestion d'Utilisateurs**. En suivant les étapes décrites, vous pourrez configurer, développer et tester l'application efficacement.
