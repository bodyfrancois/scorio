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
  translations: {
    fr: {
      name: 'Pili Pili',
      description: "Dans Pili Pili, devinez combien de plis vous allez gagner… et essayez devous y tenir",
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
    },
    en: {
      name: 'Pili Pili',
      description: "In Pili Pili, guess how many tricks you're going to win… and try to stick to it",
      detailedRules: `
1. Goal of the game

Before you start: a trick refers to the cards played during a turn, collected by the player who played the highest card!
In Pili Pili, guess how many tricks you're going to win… and try to stick to it!

Each turn, everyone plays a numbered card: the highest one wins the trick. Once all the cards in hand have been played, if you haven't won exactly the number of tricks you called, you collect Pilis as a penalty!

---


The game includes 40 numbered cards from 1 to 10, in four different colors (red, green, yellow, blue). Each player receives a number of cards equal to the round number (1 card in the first round, 2 cards in the second round, etc.).

---

4. Playing a round

Set up the round

Shuffle the numbered cards with the Joker and form a draw pile.
Form 2 other piles, one with the Mission cards and one with the Pilis


Reveal the mission and deal

- Draw the first Mission card and read its effect (see pages 8 to 10: Mission card effects).
The number in the bottom left indicates how many numbered cards to deal to each player.

- Deal the numbered cards according to this number, then set the rest aside face down.


Bet on the number of tricks

After looking at their numbered cards, starting with the dealer, each player bets on the number of tricks they think they will win.
To make sure there is always a loser, the total of all the players' bets must be different from the number of cards dealt to each player.

If needed, the last player to bet must adjust their bet to avoid this tie.
Example: If 5 cards are dealt to each player and the first 4 players bet a total of 4 tricks, the last player cannot bet 1 trick (since 4 + 1 = 5, the number of cards dealt). They can bet 0, 2, 3, 4, or 5 instead.


Win tricks

Starting with the dealer, each player plays a card from their hand.
Whoever played the highest card wins the trick, and leads the next one. Continue until all the dealt cards have been played.
- Card colors do not matter, only the number does.
- When a player plays the Joker, they choose the value it represents,
between 0 and 56.


Hand out penalty Pilis

Once all the cards have been played, each player receives 1 penalty Pili for every trick by which their bet differs from the number of tricks actually won. If their bet was exact, they receive none.
Example: bet of 1 trick, 3 actually won → 2 penalty Pilis handed out.


Start a new round and win

Shuffle all the numbered cards together with the Joker, draw a new Mission, and you're off for a new round.
As soon as a player reaches 7 Pilis, the game ends. The player with the fewest Pilis is declared the winner.


`,
    },
  },
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