# Architecture Application - Points Clés

## 1. Étapes à Générer (Bootstrap)

### 1.1 Démarrage de l'Application
- Inscrire et mettre en place la base de données idae-machine
- S'assurer que la base de données existe
- Mettre en place un processus complet d'enregistrement et création

### 1.2 Schéma de Test
- Enregistrer le schéma de test (src\lib\demo\testScheme.ts) dans la base machine MongoDB
- Choisir le nom de la base ultérieurement

---

## 2. Architecture du Moteur

### Fonctionnalités Principales
- **Gestion des schémas** : Gérés en base de données prioritairement
- **Module d'import** : Pour modifier les schémas externes
- **Processus d'installation** : 
  - Envoyer le schéma au moteur
  - Le moteur crée l'applicatif

### Exemple Flux
- Application = Schéma défini
- Schéma → Moteur → Création applicative

---

## 3. Gestion Multi-Applicatif

### Principes
- **Plusieurs applicatifs** sur le même host
- **Noms de bases** différents par applicatif
- **Modèle principal** : Gestion centralisée dans la machine

### Structure
- Chaque application peut posséder **plusieurs bases de données**
- Les bases sont nommées et organisées dans le modèle de la machine
- Système compatible avec l'architecture Legacy existante

---

## 4. À Déterminer
- Noms définitifs des bases
- Détails du système Legacy en copie d'écran fournie 