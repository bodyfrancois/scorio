import { GameConfig } from '../../core/types';

export const beloteConfig: GameConfig = {
  name: 'BELOTE',
  minPlayers: 4,
  maxPlayers: 4,
  estimatedDuration: 20,
  age:'+8',
  category: 'Cartes',
  lowestScoreWins: false,
  scoreLimit: 1001,
  roundTotal: 162,
  quickActionsName: 'Annonces',
  quickActions: [
    { label: 'Belote', value: 20 },
    { label: 'Tierce', value: 20, maxCount: 4 },
    { label: 'Cinquante', value: 50, maxCount: 3 },
    { label: 'Cent', value: 100, maxCount: 3 },
    { label: 'Carré', value: 100, maxCount: 3 },
    { label: 'Carré Valet', value: 200, maxCount: 1 },
    { label: 'Capot', value: 252, isCapot: true },
  ],
  teams: {
    count: 2,
    minPlayersPerTeam: 2,
    maxPlayersPerTeam: 2,
  },
  description: 'Jeu de cartes en équipes où les joueurs doivent remporter des plis grâce à un atout pour marquer le plus de points.',
  image: require('./asset/logo.png'), // ✅ image locale au module
  translations: {
    fr: {
      name: 'Belote',
      description: 'Jeu de cartes en équipes où les joueurs doivent remporter des plis grâce à un atout pour marquer le plus de points.',
      detailedRules: `
1. Objectif du jeu

La belote se joue à 4 joueurs en équipes de 2. Le but est de marquer plus de points que l'équipe adverse en remportant des plis.

---

2. Les joueurs et les équipes

- 4 joueurs
- 2 équipes de 2 joueurs
- Les coéquipiers sont assis face à face

---

3. Les cartes

On utilise un jeu de 32 cartes :
7, 8, 9, 10, Valet, Dame, Roi, As
Dans chaque couleur : cœur, carreau, trèfle, pique

---

4. Distribution

- Chaque joueur reçoit 5 cartes
- Une carte est retournée face visible : elle propose la couleur d'atout
- Chaque joueur peut accepter ou refuser l'atout
- Si personne n'accepte, on propose une autre couleur
- Ensuite, chaque joueur reçoit 3 cartes supplémentaires
- Chaque joueur a donc 8 cartes

---

5. L'atout

La couleur d'atout est la couleur la plus forte pour la manche.

Ordre des cartes à l'atout (du plus fort au plus faible) :
Valet, 9, As, 10, Roi, Dame, 8, 7

Ordre des cartes hors atout :
As, 10, Roi, Dame, Valet, 9, 8, 7

---

6. Déroulement du jeu

- Le joueur pose une carte
- Les autres joueurs doivent suivre la même couleur si possible
- Si un joueur ne peut pas suivre, il doit couper avec un atout si possible
- Le joueur qui a mis la carte la plus forte remporte le pli
- Il commence le pli suivant

Il y a 8 plis au total.

---

7. Les points des cartes

À l'atout :

* Valet : 20 points
* 9 : 14 points
* As : 11 points
* 10 : 10 points
* Roi : 4 points
* Dame : 3 points
* 8 et 7 : 0 point

Hors atout :

* As : 11 points
* 10 : 10 points
* Roi : 4 points
* Dame : 3 points
* Valet : 2 points
* 9, 8, 7 : 0 point

Le dernier pli donne 10 points bonus.

Total : 162 points par manche.

---

8. Belote et Rebelote

Si un joueur possède le Roi et la Dame d'atout :
- Il dit "Belote" en jouant la première
- Il dit "Rebelote" en jouant la seconde
- Cela donne 20 points bonus

---

9. Fin de manche

On compte les points des plis.
Si l'équipe qui a pris l'atout a plus de points que l'autre, elle marque ses points.
Sinon, elle est "dedans" et l'autre équipe marque 162 points.

---

10. Gagner la partie

La partie se joue généralement jusqu'à 1000 points.
L'équipe qui atteint ou dépasse ce score gagne.
`,
    },
    en: {
      name: 'Belote',
      description: 'A team card game where players win tricks using a trump suit to score the most points.',
      detailedRules: `
1. Goal of the game

Belote is played by 4 players in teams of 2. The goal is to score more points than the opposing team by winning tricks.

---

2. Players and teams

- 4 players
- 2 teams of 2 players
- Teammates sit across from each other

---

3. The cards

A 32-card deck is used:
7, 8, 9, 10, Jack, Queen, King, Ace
In each suit: hearts, diamonds, clubs, spades

---

4. Dealing

- Each player receives 5 cards
- One card is turned face up: it proposes the trump suit
- Each player can accept or refuse the trump
- If no one accepts, another suit is proposed
- Each player then receives 3 more cards
- Each player therefore has 8 cards

---

5. Trump

The trump suit is the strongest suit for the round.

Card order in trump (strongest to weakest):
Jack, 9, Ace, 10, King, Queen, 8, 7

Card order outside trump:
Ace, 10, King, Queen, Jack, 9, 8, 7

---

6. Gameplay

- A player leads a card
- Other players must follow suit if possible
- If a player cannot follow suit, they must trump if possible
- The player who played the strongest card wins the trick
- They lead the next trick

There are 8 tricks in total.

---

7. Card points

In trump:

* Jack: 20 points
* 9: 14 points
* Ace: 11 points
* 10: 10 points
* King: 4 points
* Queen: 3 points
* 8 and 7: 0 point

Outside trump:

* Ace: 11 points
* 10: 10 points
* King: 4 points
* Queen: 3 points
* Jack: 2 points
* 9, 8, 7: 0 point

The last trick gives a 10-point bonus.

Total: 162 points per round.

---

8. Belote and Rebelote

If a player holds the King and Queen of trump:
- They say "Belote" when playing the first one
- They say "Rebelote" when playing the second one
- This gives a 20-point bonus

---

9. End of round

The trick points are counted.
If the team that took the trump has more points than the other, they score their points.
Otherwise, they are "in" and the other team scores 162 points.

---

10. Winning the game

The game is usually played to 1000 points.
The team that reaches or exceeds this score wins.
`,
    },
  },
  detailedRules: `
1. Objectif du jeu

La belote se joue à 4 joueurs en équipes de 2. Le but est de marquer plus de points que l’équipe adverse en remportant des plis.

---

2. Les joueurs et les équipes

- 4 joueurs
- 2 équipes de 2 joueurs
- Les coéquipiers sont assis face à face

---

3. Les cartes

On utilise un jeu de 32 cartes :
7, 8, 9, 10, Valet, Dame, Roi, As
Dans chaque couleur : cœur, carreau, trèfle, pique

---

4. Distribution

- Chaque joueur reçoit 5 cartes
- Une carte est retournée face visible : elle propose la couleur d’atout
- Chaque joueur peut accepter ou refuser l’atout
- Si personne n’accepte, on propose une autre couleur
- Ensuite, chaque joueur reçoit 3 cartes supplémentaires
- Chaque joueur a donc 8 cartes

---

5. L’atout

La couleur d’atout est la couleur la plus forte pour la manche.

Ordre des cartes à l’atout (du plus fort au plus faible) :
Valet, 9, As, 10, Roi, Dame, 8, 7

Ordre des cartes hors atout :
As, 10, Roi, Dame, Valet, 9, 8, 7

---

6. Déroulement du jeu

- Le joueur pose une carte
- Les autres joueurs doivent suivre la même couleur si possible
- Si un joueur ne peut pas suivre, il doit couper avec un atout si possible
- Le joueur qui a mis la carte la plus forte remporte le pli
- Il commence le pli suivant

Il y a 8 plis au total.

---

7. Les points des cartes

À l’atout :

* Valet : 20 points
* 9 : 14 points
* As : 11 points
* 10 : 10 points
* Roi : 4 points
* Dame : 3 points
* 8 et 7 : 0 point

Hors atout :

* As : 11 points
* 10 : 10 points
* Roi : 4 points
* Dame : 3 points
* Valet : 2 points
* 9, 8, 7 : 0 point

Le dernier pli donne 10 points bonus.

Total : 162 points par manche.

---

8. Belote et Rebelote

Si un joueur possède le Roi et la Dame d’atout :
- Il dit "Belote" en jouant la première
- Il dit "Rebelote" en jouant la seconde
- Cela donne 20 points bonus

---

9. Fin de manche

On compte les points des plis.
Si l’équipe qui a pris l’atout a plus de points que l’autre, elle marque ses points.
Sinon, elle est "dedans" et l’autre équipe marque 162 points.

---

10. Gagner la partie

La partie se joue généralement jusqu’à 1000 points.
L’équipe qui atteint ou dépasse ce score gagne.
`,
};