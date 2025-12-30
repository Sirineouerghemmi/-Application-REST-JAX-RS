# Frontend REST - Gestion des Personnes

Frontend HTML/CSS/JavaScript qui consomme exclusivement une API REST JAX-RS pour la gestion des personnes.

## 📋 Description

Ce projet est un frontend web qui communique uniquement via des appels HTTP REST avec un backend JAX-RS. Aucun accès direct à la base de données n'est effectué depuis le frontend.

## 🚀 Fonctionnalités

- ✅ **CRUD complet** (Create, Read, Update, Delete) des personnes
- ✅ **Consommation 100% API REST** (GET, POST, PUT, DELETE)
- ✅ **Interface utilisateur responsive** (Bootstrap 5)
- ✅ **Validation des formulaires** côté client
- ✅ **Recherche en temps réel** par nom
- ✅ **Statistiques** (nombre total, âge moyen, plus jeune)
- ✅ **Journal des requêtes** API en temps réel
- ✅ **Gestion des erreurs** et retours utilisateur
- ✅ **Mode édition** avec annulation
- ✅ **Indicateur de connexion** API

## 🛠 Technologies utilisées

- **HTML5** - Structure de la page
- **CSS3** - Styles personnalisés et responsive
- **JavaScript (ES6+)** - Logique métier et appels API
- **Bootstrap 5** - Framework CSS pour le design
- **Font Awesome** - Icônes
- **Fetch API** - Pour les appels HTTP REST

## 🔌 API REST consommée

Le frontend communique avec les endpoints suivants :

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/persons/health` | Vérifier l'état de l'API |
| GET | `/persons/all` | Récupérer toutes les personnes |
| GET | `/persons/{id}` | Récupérer une personne par ID |
| GET | `/persons/search/{name}` | Rechercher une personne par nom |
| POST | `/persons/add` | Ajouter une nouvelle personne |
| PUT | `/persons/update` | Mettre à jour une personne |
| DELETE | `/persons/delete/{id}` | Supprimer une personne |

## 📁 Structure des fichiers
tp333-frontend/
├── index.html # Page principale
├── style.css # Styles personnalisés
├── script.js # Logique JavaScript
├── README.md # Documentation

### Dépot sur github 
https://github.com/Sirineouerghemmi/-Application-REST-JAX-RS.git

## 🚀 Installation et exécution

### Prérequis

1. **Backend JAX-RS** déployé et accessible sur `http://localhost:8080/tp333`
2. **Navigateur web** moderne (Chrome, Firefox, Edge, Safari)
3. **Serveur web local** (optionnel, vous pouvez ouvrir directement index.html)

### Étapes

1. **Cloner ou télécharger** les fichiers frontend
2. **Ouvrir `index.html`** dans un navigateur web
3. **Vérifier** que le backend est en cours d'exécution
4. **Utiliser l'interface** pour gérer les personnes

> **Note**: Si le backend n'est pas sur localhost:8080, modifier la variable `BASE_URL` dans `script.js`

## 🔧 Configuration

Modifier la configuration API dans `script.js` :

```javascript
const API_CONFIG = {
    BASE_URL: 'http://localhost:8080/tp333/api',
    // ... autres configurations
};
📱 Fonctionnement
Ajouter une personne
Remplir le formulaire "Nom" et "Âge"

Cliquer sur "Ajouter Personne"

La personne apparaît dans la liste

Modifier une personne
Cliquer sur le bouton ✏️ (éditer) dans la liste

Les champs se remplissent automatiquement

Modifier les informations

Cliquer sur "Mettre à Jour"

Supprimer une personne
Cliquer sur le bouton 🗑️ (supprimer) dans la liste

Confirmer la suppression

La personne disparaît de la liste

Rechercher une personne
Entrer un nom dans le champ de recherche

La liste se filtre automatiquement

🧪 Tests
Le frontend inclut plusieurs mécanismes de test :

Journal des requêtes : Toutes les requêtes API sont affichées

Indicateur de connexion : Statut de l'API en temps réel

Gestion des erreurs : Messages d'erreur clairs

Validation : Validation des formulaires avant envoi


## 5. **Instructions pour exécuter le frontend**

### Étape 1: Préparer le backend
1. Assurez-vous que votre backend JAX-RS est déployé et fonctionne sur Tomcat
2. L'URL de base doit être: `http://localhost:8080/tp333`
3. Vérifiez que les endpoints API sont accessibles:
   - `http://localhost:8080/tp333/api/persons/health`
Ouvrez votre navigateur à http://localhost:8000 (ou double-cliquez sur index.html)

Vérifiez que l'indicateur API indique "Connecté"

Utilisez le formulaire pour ajouter des personnes

Utilisez les boutons d'action pour modifier/supprimer


