# Docker Setup

Ce projet utilise Docker et Docker Compose pour orchestrer les services backend et frontend.

## Prérequis

- Docker Desktop installé et en cours d'exécution
- Docker Compose (inclus avec Docker Desktop)

## Architecture

Le projet contient deux services Docker :

- **server** : API backend Express.js (TypeScript)
- **client** : Frontend React avec nginx

## Construction et démarrage

### Première fois / Après modifications

```bash
docker-compose up --build
```

Cette commande va :
1. Construire les images Docker pour le serveur et le client
2. Démarrer les conteneurs
3. Afficher les logs en temps réel

### Démarrer en arrière-plan

```bash
docker-compose up -d --build
```

## Services disponibles

Une fois les conteneurs démarrés, les services sont accessibles sur :

- **Backend API**: http://localhost:3001
- **Frontend**: http://localhost:3000

Le frontend est configuré avec un proxy nginx qui redirige les requêtes `/api` vers le backend.

## Commandes utiles

### Gestion des conteneurs

```bash
# Démarrer les services
docker-compose up -d

# Arrêter les services
docker-compose down

# Arrêter et supprimer les volumes
docker-compose down -v

# Redémarrer un service spécifique
docker-compose restart server
docker-compose restart client
```

### Logs

```bash
# Voir tous les logs
docker-compose logs -f

# Logs d'un service spécifique
docker-compose logs -f server
docker-compose logs -f client

# Dernières 100 lignes
docker-compose logs --tail=100
```

### Rebuild

```bash
# Reconstruire toutes les images
docker-compose build --no-cache

# Reconstruire un service spécifique
docker-compose build --no-cache server
docker-compose build --no-cache client

# Reconstruire et redémarrer
docker-compose up --build
```

### Inspection

```bash
# Voir les conteneurs en cours d'exécution
docker-compose ps

# Voir l'utilisation des ressources
docker stats

# Exécuter une commande dans un conteneur
docker-compose exec server sh
docker-compose exec client sh
```

## Structure des Dockerfiles

### Backend (packages/server/Dockerfile)

- Build multi-stage pour optimiser la taille
- Stage 1 : Compilation TypeScript
- Stage 2 : Image de production avec uniquement les dépendances nécessaires
- Port exposé : 3001

### Frontend (packages/client/Dockerfile)

- Build multi-stage
- Stage 1 : Build de l'application React avec Vite
- Stage 2 : Serveur nginx pour servir les fichiers statiques
- Configuration nginx avec proxy vers le backend
- Port exposé : 80 (mappé sur 3000)

## Volumes

Le dossier `packages/server/src/data` est monté comme volume pour persister les données des todos entre les redémarrages des conteneurs.

## Dépannage

### Les conteneurs ne démarrent pas

```bash
# Vérifier les logs d'erreur
docker-compose logs

# Vérifier que les ports ne sont pas déjà utilisés
netstat -ano | findstr :3000
netstat -ano | findstr :3001
```

### Rebuild complet

```bash
# Supprimer les images et reconstruire
docker-compose down
docker system prune -a
docker-compose up --build
```

### Problèmes de cache

```bash
# Rebuild sans cache
docker-compose build --no-cache
docker-compose up
```

## CI/CD

Les images Docker sont automatiquement construites dans la CI GitHub Actions lors des pull requests et des tags de version. Voir `.github/workflows/ci.yml` pour plus de détails.

