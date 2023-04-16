# **PROJET Failleware**
*Aladin SALEH - Argaïl GISCLARD*  
*Projet réalisé dans le cadre du cours de FIWARE de l'ESIEE*  


# **Cahier des charges**
Interface d'analyse de données de jeux (League of Legend)

* Recourir à FIWARE pour la récupération et l'analyse des données de jeux.
* Utilisation de l'API de RIOT GAMES (League of Legend) pour la récupération des données de jeux.
* Utilisation de l'API de GOOGLE pour la connexion via google +.
* Création d'une interface permettant la récupération et l'analyse des données de jeux.


## **Principe de l'application.**

L'application à pour but de développer une interface relié à FIWARE permettant la récupération et l'analyse de données de jeux issue de l'API de RIOT GAMES (League of Legend) afin d'établir des paris sur la victoire/défaite de ses amis.  

**L'application vise à remplir deux objectif :**  
- Analyser les données de jeux afin de déterminer les chances de victoire d'un joueur en fonction de ses statistiques dans le but de faire des paris entre amis.
- Analyser ses statistiques afin de déterminer les points à améliorer afin d'augmenter ses chances de victoire.

## **Fonctionnalités**
 
* Possibilité de se connecter via google + (création de compte)  

* Possibilté de parier sur les parties des joueurs auxquels on est abonné. 
* Consulter les statistiques de n’importe quel joueur. 

* Analyse de partie en temps réelles (Gold + Stuff + Dégât). 

* Leaderboard des meilleurs parieurs. 

* Leaderboard des meilleurs joueurs de l’application. 

* Lier un compte Riot avec un compte utilisateur. 

* Rechercher un joueur par son pseudo.


<br>

# **Analyse des données de jeux**

L'application propose divers niveaux d'analyse des données de jeux.

## **Donnée de base :**
* RANK du joueur
* WINRATE du joueur
* TOP 3 Champions du joueur
* Historique des dernières parties (les 20 dernières).

## **Donnée de niveau 2 :**
* Comparaison des stats avec d’autres joueurs de son rang
* Suivi de stat en temps réelle
* Abonnement sur les tranches d’heure les winnable
* Abonnement sur le lancement d’une partie d’un joueur, et implémenter la fonctionnalité de parier sur la victoire ou non du joueur
* Taux de winrate du champion 
* Taux de winrate du joueur sur le champion
* Taux de winrate du joueur contre les champions adverses sur son champion 
* Taux de winrate du joueur contre le champion au global  
* Taux de winrate du champion au global
* Ranking des parieurs

## **Donnée premium optionnelle :**
Comparaison avec les meilleurs joueurs sur un champions.



# Installation

## **Prérequis**

Le projet utilise les conteneurs Docker pour le déploiement de l'application.
Il est donc nécessaire d'installer Docker sur votre machine.

```
https://docs.docker.com/get-docker/
```

## **Installation**

### **Cloner le projet**
Il est nécessaire de cloner le projet sur votre machine afin de pouvoir lancer l'application.
```bash
git clone https://github.com/Aladin-Saleh/Failleware.git
cd Failleware
```

### **Installer les dependances du serveur**
```bash
cd server
npm install
```

### **Installation des données de jeux**
L'application utilise les données de jeux de l'API de RIOT GAMES (League of Legend) qui sont "statique", donc l'installation de ces données ne sont à opérer qu'une fois (ou occasionellement).  

Ce lien permet de télécharger les données de jeux si vous ne souhaitez pas les installer via le script Python.
https://ddragon.leagueoflegends.com/cdn/dragontail-10.10.5.zip

Python est nécessaire pour l'installation des données de jeux.
https://www.python.org/downloads/  


```bash	
cd ressources
python3 import_champ_to_fiware.py
python3 import_items_to_fiware.py
```


### **Configuration de l'application**
Le fichier .env contient les variables d'environnement de l'application.

```bash
cd server
touch .env
```
Dans le fichier .env, ajouter les variables suivantes :
```bash
PORT=5000
RIOT_API_KEY=VOTRE_API_KEY
```

### **Lancement de l'application**
Lancement du conteneur Docker de l'application.

La première fois que vous lancez l'application, il est nécessaire de lancer la commande suivante afin de télécharger les images Docker nécessaires au bon fonctionnement de l'application.

```bash
docker-compose up
```
Les images Docker sont téléchargées et l'application est lancée.

* Context-broker orion : http://localhost:1026
* MongoDB (pour le context-broker) port 27017
* NodeJS (back-end de l'application) port 5000
