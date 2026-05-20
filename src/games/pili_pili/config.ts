import { GameConfig } from '../../core/types';

export const piliPiliConfig: GameConfig = {
  name: 'PILI PILI',
  minPlayers: 2,
  maxPlayers: 8,
  lowestScoreWins: true,
  estimatedDuration: 20,
  age: '+8',
  category: 'Cartes',
  scoreLimit: 7,
  scoreMin: 0,
  scoreMax: 5,
  scoreInputMode: 'stepper' as const,
  description: "Dans Pili Pili, devinez combien de plis vous allez gagner… et essayez devous y tenir",
  image: require('./asset/logo.png'),
  detailedRules: `
1. Objectif du jeu

Avant de commencer : un pli désigne les cartes jouées pendant un tour et ramassées par le joueur qui a joué la carte de plus grande valeur !
Dans Pili Pili, devinez combien de plis vous allez gagner… et essayez de vous y tenir !

À chaque tour, chacun joue une carte numérotée : la plus forte remporte le pli. Une fois toutes les cartes en main jouées, si vous n’avez pas gagné exactement le nombre de plis annoncé, vous récoltez des Pilis en pénalité !

---


Le jeu comprend 40 cartes numérotées de 1 à 10, en quatre couleurs différentes (rouge, vert, jaune, bleu). Chaque joueur reçoit un nombre de cartes égal au numéro du tour (1 carte au premier tour, 2 cartes au deuxième tour, etc.).

---

4. Déroulement d'une manche

Préparez la manche

Mélangez les cartes numérotées avec le Joker et formez une pioche.
Formez 2 autres pioches, une avec les cartes Mission et une avec les Pilis


Découvrez la mission et distribuez 

- Piochez la première carte Mission et prenez connaissance de son effet (voir page 8 à 10 : effets des cartes Mission).
Le chiffre situé en bas à gauche indique le nombre de cartes numérotées à distribuer à chaque joueur.

- Distribuez les cartes numérotées selon ce nombre, puis mettez de côté, face cachée, celles qui restent.


Pariez sur le nombre de plis

Après avoir regardé ses cartes numérotées et en commençant par le donneur, chaque joueur parie sur le nombre de plis qu’il pense remporter. 
Pour qu’il y ait toujours un perdant, la somme des paris des joueurs doit être différente du nombre de cartes distribuées à chaque joueur.

Si nécessaire, le dernier à parier devra ajuster son pari pour éviter cette égalité.
Exemple : Si on distribue 5 cartes à chacun et que les 4 premiers joueurs parient un total de 4 plis, le dernier ne pourra pas parier 1 pli (car 4 + 1 = 5, soit le nombre de cartes distribuées). Il pourra alors parier 0, 2, 3, 4 ou 5.


Remportez des plis

En commençant par le donneur, chaque joueur pose une carte de sa main.
Celui qui a posé la carte de plus grande valeur remporte le pli, et commence le suivant. Continuez jusqu’à ce que toutes les cartes distribuées soient jouées.
- Les couleurs des cartes n’ont pas d’importance, seul le nombre importe.
- Quand un joueur pose le Joker, il choisit la valeur qu’il lui donne,
entre 0 et 56.


Distribuez les pilis en pénalité

Une fois toutes les cartes jouées, chaque joueur reçoit 1 Pili en pénalité par écart entre son pari et les plis réellement remportés. S’il a réussi son pari, il n’en reçoit aucun.
Exemple : pari de 1 pli, 3 remportés réellement → 2 Pilis distribués en pénalité.


Recommencez une nouvelle manche et gagnez

Mélangez l’ensemble des cartes numérotées avec le Joker, piochez une nouvelle Mission, et c’est reparti pour une nouvelle manche. 
Dès qu’un joueur atteint 7 Pilis, la partie s’arrête. Le joueur avec le moins de pilis est déclaré vainqueur.


`,
};