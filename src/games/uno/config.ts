import { GameConfig } from '../../core/types';

export const unoConfig: GameConfig = {
  name: 'UNO',
  minPlayers: 2,
  maxPlayers: 10,
  estimatedDuration: 20,
  age:'+5',
  category: 'Cartes',
  lowestScoreWins: true,
  scoreLimit: 500,
  description: 'Jeu de cartes où le but est d’être le premier à se débarrasser de toutes ses cartes en jouant des couleurs ou chiffres correspondants.',
  image: require('./asset/logo.png'), // ✅ image locale au module
  translations: {
    fr: {
      name: 'Uno',
      description: 'Jeu de cartes où le but est d’être le premier à se débarrasser de toutes ses cartes en jouant des couleurs ou chiffres correspondants.',
      detailedRules: `
1. Objectif du jeu

Le but est d’être le premier joueur à se débarrasser de toutes ses cartes. Les autres joueurs marquent des points selon les cartes qu’il leur reste en main.

---

2. Mise en place

- 2 à 10 joueurs.
- Chaque joueur reçoit 7 cartes.
- Le reste des cartes forme la pioche, face cachée.
- La première carte de la pioche est retournée pour former la défausse.

---

3. Déroulement d’un tour

À votre tour, vous devez jouer une carte qui correspond à la carte visible sur la défausse par : la couleur, ou le numéro, ou le symbole. Exemple : sur un 5 rouge, vous pouvez jouer un 5 de n’importe quelle couleur ou une carte rouge.

Si vous ne pouvez pas jouer :
- vous devez piocher une carte
- si elle est jouable, vous pouvez la jouer immédiatement
- sinon, votre tour passe

---

4. Les cartes spéciales

+2 (Pioche deux) : Le joueur suivant pioche 2 cartes et passe son tour.
Inversion : Le sens du jeu change.
Passe ton tour : Le joueur suivant passe son tour.
Joker (changement de couleur) : Permet de choisir la couleur suivante.
Joker +4 :
- Permet de choisir la couleur
- Le joueur suivant pioche 4 cartes et passe son tour
- Vous ne pouvez la jouer que si vous n’avez pas la couleur demandée

---

5. Dire "UNO"

Quand il vous reste une seule carte, vous devez dire "UNO".
Si vous oubliez et qu’un joueur vous surprend avant votre prochain tour : Vous piochez 2 cartes

---

6. Fin de manche

La manche se termine quand un joueur n’a plus de cartes.
Les autres joueurs donnent des points selon leurs cartes restantes :

- Cartes numérotées : valeur du chiffre
- +2, Inversion, Passe : 20 points
- Joker, Joker +4 : 50 points

---

7. Gagner la partie

- Version rapide : Le premier qui n’a plus de cartes gagne
- Version officielle avec points : Le premier à atteindre 500 points gagne

---

8. Règles importantes souvent oubliées

- Vous ne pouvez jouer qu’une seule carte par tour
- Vous devez jouer quand c’est votre tour
- Si la pioche est vide, on mélange la défausse pour recréer une pioche
- On ne peut pas empiler les +2 ou +4 (sauf variante)

---

9. Variantes populaires (optionnelles)

- Empiler les +2 (pas les +4)
- Jouer plusieurs cartes identiques en même temps (rapidité)

`,
    },
    en: {
      name: 'Uno',
      description: 'A card game where the goal is to be the first to get rid of all your cards by playing matching colors or numbers.',
      detailedRules: `
1. Goal of the game

The goal is to be the first player to get rid of all your cards. The other players score points based on the cards remaining in their hand.

---

2. Setup

- 2 to 10 players.
- Each player receives 7 cards.
- The rest of the cards form the draw pile, face down.
- The top card of the draw pile is turned over to start the discard pile.

---

3. Playing a turn

On your turn, you must play a card that matches the visible card on the discard pile by: color, number, or symbol. Example: on a red 5, you can play a 5 of any color or any red card.

If you cannot play:
- you must draw a card
- if it is playable, you may play it immediately
- otherwise, your turn is skipped

---

4. Special cards

+2 (Draw Two): The next player draws 2 cards and skips their turn.
Reverse: The direction of play changes.
Skip: The next player's turn is skipped.
Wild (color change): Lets you choose the next color.
Wild Draw Four:
- Lets you choose the color
- The next player draws 4 cards and skips their turn
- You may only play it if you have no cards of the color currently in play

---

5. Saying "UNO"

When you have only one card left, you must say "UNO".
If you forget and another player catches you before your next turn: You draw 2 cards

---

6. End of round

The round ends when a player has no cards left.
The other players give points based on their remaining cards:

- Numbered cards: value of the number
- +2, Reverse, Skip: 20 points
- Wild, Wild Draw Four: 50 points

---

7. Winning the game

- Quick version: The first player with no cards left wins
- Official version with points: The first player to reach 500 points wins

---

8. Important rules often forgotten

- You may only play one card per turn
- You must play when it's your turn
- If the draw pile is empty, shuffle the discard pile to make a new draw pile
- You cannot stack +2s or +4s (except as a variant)

---

9. Popular variants (optional)

- Stacking +2s (not +4s)
- Playing several identical cards at once (speed)

`,
    },
  },
  detailedRules: `
1. Objectif du jeu

Le but est d’être le premier joueur à se débarrasser de toutes ses cartes. Les autres joueurs marquent des points selon les cartes qu’il leur reste en main.

---

2. Mise en place

- 2 à 10 joueurs.
- Chaque joueur reçoit 7 cartes.
- Le reste des cartes forme la pioche, face cachée.
- La première carte de la pioche est retournée pour former la défausse.

---

3. Déroulement d’un tour

À votre tour, vous devez jouer une carte qui correspond à la carte visible sur la défausse par : la couleur, ou le numéro, ou le symbole. Exemple : sur un 5 rouge, vous pouvez jouer un 5 de n’importe quelle couleur ou une carte rouge.

Si vous ne pouvez pas jouer :
- vous devez piocher une carte
- si elle est jouable, vous pouvez la jouer immédiatement
- sinon, votre tour passe

---

4. Les cartes spéciales

+2 (Pioche deux) : Le joueur suivant pioche 2 cartes et passe son tour.
Inversion : Le sens du jeu change.
Passe ton tour : Le joueur suivant passe son tour.
Joker (changement de couleur) : Permet de choisir la couleur suivante.
Joker +4 :
- Permet de choisir la couleur
- Le joueur suivant pioche 4 cartes et passe son tour
- Vous ne pouvez la jouer que si vous n’avez pas la couleur demandée

---

5. Dire "UNO"

Quand il vous reste une seule carte, vous devez dire "UNO".
Si vous oubliez et qu’un joueur vous surprend avant votre prochain tour : Vous piochez 2 cartes

---

6. Fin de manche

La manche se termine quand un joueur n’a plus de cartes.
Les autres joueurs donnent des points selon leurs cartes restantes :

- Cartes numérotées : valeur du chiffre
- +2, Inversion, Passe : 20 points
- Joker, Joker +4 : 50 points

---

7. Gagner la partie

- Version rapide : Le premier qui n’a plus de cartes gagne
- Version officielle avec points : Le premier à atteindre 500 points gagne

---

8. Règles importantes souvent oubliées

- Vous ne pouvez jouer qu’une seule carte par tour
- Vous devez jouer quand c’est votre tour
- Si la pioche est vide, on mélange la défausse pour recréer une pioche
- On ne peut pas empiler les +2 ou +4 (sauf variante)

---

9. Variantes populaires (optionnelles)

- Empiler les +2 (pas les +4)
- Jouer plusieurs cartes identiques en même temps (rapidité)

`,
};