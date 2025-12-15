# Todo List - Projet CI/CD

Ce projet contient une application "Todo List" (client + serveur) dotée d'une pipeline CI/CD complète et sécurisée utilisant GitHub Actions.

## Membres du Groupe

| NOM        | Prénom   |
| ---------- | -------- |
| Arare      | Kaoutar  |
| Agre       | William  |

---

## 🚀 Architecture & Choix Techniques

### Backend
- **Framework** : Node.js avec Express.js.
- **Langage** : TypeScript.
- **Données** : Un simple fichier `todos.json` fait office de base de données.
- **Tests** : Jest & Supertest pour les tests unitaires et d'intégration des routes de l'API.
- **Observabilité** : Sentry est intégré pour le suivi des erreurs et le profiling.

### Frontend
- **Framework** : Vue + Vite
- **Langage** : TypeScript
- **Style** : Tailwind CSS

### CI/CD (GitHub Actions)
- **Qualité du code** : Linting des commits (`commitlint`), tests unitaires (`jest`), et analyse de la couverture de code.
- **Sécurité** : Scan des dépendances (`npm audit`) et scan de l'image Docker (`Trivy`) pour détecter les vulnérabilités.
- **Packaging** : L'application backend est packagée dans une image Docker multi-stage optimisée.
- **Déploiement** :
  - Le frontend est déployé sur **Vercel**.
  - Le backend est déployé sur **Render**.
  - Le déploiement est déclenché automatiquement **uniquement lors de la création d'un tag Git** (ex: `v1.0.0`).
- **Notifications** : Le statut de la pipeline (succès ou échec) est notifié sur un serveur Discord.

---

## 🌐 URLs de Déploiement

- **Frontend (Vercel)** : `https://todo-list-zeta-ruby.vercel.app/`
- **Backend (Render)** : `http://todo-api-amev.onrender.com/`

---

## 🛠️ Installation et Test en Local

1.  **Cloner le repository :**
    ```bash
    git clone https://github.com/kao-outar/TodoList.git
    cd todos-client-server
    ```

2.  **Installer les dépendances (client & serveur) :**
    ```bash
    # Installer les dépendances du serveur
    cd packages/server
    npm install

    # Installer les dépendances du client
    cd ../client
    npm install
    ```

3.  **Lancer l'application en mode développement :**
    ```bash
    # Depuis la racine /packages/server
    npm run dev

    # Depuis la racine /packages/client
    npm run dev
    ```

4.  **Lancer les tests du backend :**
    ```bash
    # Depuis la racine /packages/server
    npm test
    ```

---
## 🐳 Docker

Le projet utilise Docker et Docker Compose pour orchestrer les services backend et frontend.

### Prérequis

- Docker Desktop installé et en cours d'exécution
- Docker Compose (inclus avec Docker Desktop)

### Architecture Docker

Le projet contient deux services Docker :

- **server** : API backend Express.js (TypeScript) sur le port 3001
- **client** : Frontend Vue avec nginx sur le port 3000

### Construction et démarrage

**Première fois / Après modifications :**
```bash
docker-compose up --build
```

**Démarrer en arrière-plan :**
```bash
docker-compose up -d --build
```

### Services disponibles

Une fois les conteneurs démarrés, les services sont accessibles sur :

- **Backend API**: http://localhost:3001
- **Frontend**: http://localhost:3000

Le frontend est configuré avec un proxy nginx qui redirige les requêtes `/api` vers le backend.

### Commandes utiles

```bash
# Démarrer les services
docker-compose up -d

# Arrêter les services
docker-compose down

# Voir les logs
docker-compose logs -f

# Reconstruire les images
docker-compose build --no-cache

# Redémarrer un service spécifique
docker-compose restart server
docker-compose restart client
```

### Structure des Dockerfiles

**Backend** (`packages/server/Dockerfile`) :
- Build multi-stage optimisé
- Stage 1 : Compilation TypeScript
- Stage 2 : Image de production avec uniquement les dépendances nécessaires
- Port exposé : 3001

**Frontend** (`packages/client/Dockerfile`) :
- Build multi-stage
- Stage 1 : Build de l'application Vue avec Vite
- Stage 2 : Serveur nginx pour servir les fichiers statiques
- Configuration nginx avec proxy vers le backend
- Port exposé : 80 (mappé sur 3000)

### Volumes

Le dossier `packages/server/src/data` est monté comme volume pour persister les données des todos entre les redémarrages des conteneurs.

---

## 🔄 Stratégie de Rollback

Notre stratégie de déploiement basée sur les tags Git et les images Docker versionnées rend le rollback simple et sécurisé.

Si la version `v1.0.2` que nous venons de déployer est buggée, pour revenir à la version stable `v1.0.1`, il suffit de :

1.  **Redéployer l'image Docker précédente sur Render**. Chaque image poussée sur Docker Hub est taguée avec la version Git correspondante (ex: `mon-user/todo-api:v1.0.1`). Il suffit d'aller sur le dashboard Render et de forcer le déploiement en spécifiant ce tag d'image. Render va alors tirer cette version et remplacer le conteneur défectueux.

2.  **(Optionnel) Re-taguer le commit stable**. Pour formaliser le rollback dans Git, on peut créer un nouveau tag sur le commit de la v1.0.1 :
    ```bash
    # Créer un tag de "revert" ou "hotfix"
    git tag v1.0.3 <hash_du_commit_de_la_v1.0.1>
    git push origin v1.0.3
    ```
    Cela déclenchera la pipeline CI/CD qui redéploiera officiellement la version `v1.0.1` (sous le nouveau nom de tag `v1.0.3`).

---

## 📸 Preuve Sentry

<img width="1580" height="261" alt="image" src="https://github.com/user-attachments/assets/a34d4001-21f9-4d76-8fe3-bf94c90c4d7e" />




