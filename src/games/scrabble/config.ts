import { GameConfig } from '../../core/types';

export const scrabbleConfig: GameConfig = {
  name: 'SCRABBLE',
  minPlayers: 2,
  maxPlayers: 4,
  estimatedDuration: 20,
  age:'+8',
  category: 'Jeu de lettre',
  lowestScoreWins: false,
  description: 'Le scrabble est un jeu de lettres où les joueurs forment des mots sur un plateau avec des lettres tirées au hasard afin de marquer le plus de points possible.',
  image: require('./asset/logo.png'), // ✅ image locale au module
  translations: {
    fr: {
      name: 'Scrabble',
      description: 'Le scrabble est un jeu de lettres où les joueurs forment des mots sur un plateau avec des lettres tirées au hasard afin de marquer le plus de points possible.',
      detailedRules: `
1. Objectif du jeu

Le but est de marquer le plus de points en formant des mots avec des lettres sur le plateau.

---

2. Les joueurs

- 2 à 4 joueurs
- Chaque joueur joue individuellement

---

3. Le matériel

- 1 plateau de scrabble
- 102 lettres (dont 2 jokers)
- 1 sac pour piocher
- 1 support pour poser ses lettres

Chaque joueur pioche 7 lettres au début.

---

4. Début de la partie

- Le premier joueur pose un mot au centre du plateau
- Le mot doit passer par la case centrale
- Les mots peuvent être posés horizontalement ou verticalement

---

5. Déroulement d’un tour

À votre tour, vous pouvez :

- former un mot avec vos lettres et le poser sur le plateau
- utiliser au moins une lettre déjà présente, sauf au premier tour
- ou échanger des lettres
- ou passer votre tour

Après avoir joué, vous piochez pour avoir à nouveau 7 lettres.

---

6. Règles pour poser un mot

- Le mot doit exister dans le dictionnaire
- Il doit être relié aux mots déjà posés
- Tous les nouveaux mots formés doivent être valides

---

7. Les cases spéciales

Certaines cases augmentent les points :

- Lettre double : lettre ×2
- Lettre triple : lettre ×3
- Mot double : mot ×2
- Mot triple : mot ×3

La case centrale compte comme mot double.

---

8. Valeur des lettres

Chaque lettre a une valeur en points :

Exemples :

- E, A, I, N, O, R, S, T, U : 1 point
- D, G, M : 2 points
- B, C, P : 3 points
- F, H, V : 4 points
- J, Q : 8 points
- K, W, X, Y, Z : 10 points
- Joker : 0 point

---

9. Bonus scrabble

Si un joueur utilise ses 7 lettres en un seul tour, il gagne 50 points bonus.

---

10. Fin de la partie

La partie se termine quand : il n’y a plus de lettres dans le sac et un joueur n’a plus de lettres ou quand tous les joueurs passent plusieurs fois.

---

11. Calcul final

- Chaque joueur ajoute ses points
- On retire les points des lettres restantes
- Le joueur avec le plus de points gagne
`,
    },
    en: {
      name: 'Scrabble',
      description: 'Scrabble is a letter game where players form words on a board using randomly drawn letters to score as many points as possible.',
      detailedRules: `
1. Goal of the game

The goal is to score the most points by forming words with letters on the board.

---

2. Players

- 2 to 4 players
- Each player plays individually

---

3. Equipment

- 1 Scrabble board
- 102 tiles (including 2 blanks)
- 1 bag for drawing tiles
- 1 rack to hold your tiles

Each player draws 7 tiles at the start.

---

4. Start of the game

- The first player places a word in the center of the board
- The word must pass through the center square
- Words can be placed horizontally or vertically

---

5. Playing a turn

On your turn, you can:

- form a word with your tiles and place it on the board
- use at least one tile already on the board, except on the first turn
- or exchange tiles
- or pass your turn

After playing, you draw tiles to have 7 again.

---

6. Rules for placing a word

- The word must exist in the dictionary
- It must connect to words already placed
- All new words formed must be valid

---

7. Special squares

Some squares increase points:

- Double letter: letter ×2
- Triple letter: letter ×3
- Double word: word ×2
- Triple word: word ×3

The center square counts as a double word.

---

8. Letter values

Each letter has a point value:

Examples:

- E, A, I, N, O, R, S, T, U: 1 point
- D, G, M: 2 points
- B, C, P: 3 points
- F, H, V: 4 points
- J, Q: 8 points
- K, W, X, Y, Z: 10 points
- Blank: 0 points

---

9. Scrabble bonus

If a player uses all 7 of their tiles in a single turn, they earn a 50-point bonus.

---

10. End of the game

The game ends when there are no more tiles left in the bag and a player has no tiles left, or when all players pass several times in a row.

---

11. Final scoring

- Each player adds up their points
- Points for remaining tiles are subtracted
- The player with the most points wins
`,
    },
  },
  detailedRules: `
1. Objectif du jeu

Le but est de marquer le plus de points en formant des mots avec des lettres sur le plateau.

---

2. Les joueurs

- 2 à 4 joueurs
- Chaque joueur joue individuellement

---

3. Le matériel

- 1 plateau de scrabble
- 102 lettres (dont 2 jokers)
- 1 sac pour piocher
- 1 support pour poser ses lettres

Chaque joueur pioche 7 lettres au début.

---

4. Début de la partie

- Le premier joueur pose un mot au centre du plateau
- Le mot doit passer par la case centrale
- Les mots peuvent être posés horizontalement ou verticalement

---

5. Déroulement d’un tour

À votre tour, vous pouvez :

- former un mot avec vos lettres et le poser sur le plateau
- utiliser au moins une lettre déjà présente, sauf au premier tour
- ou échanger des lettres
- ou passer votre tour

Après avoir joué, vous piochez pour avoir à nouveau 7 lettres.

---

6. Règles pour poser un mot

- Le mot doit exister dans le dictionnaire
- Il doit être relié aux mots déjà posés
- Tous les nouveaux mots formés doivent être valides

---

7. Les cases spéciales

Certaines cases augmentent les points :

- Lettre double : lettre ×2
- Lettre triple : lettre ×3
- Mot double : mot ×2
- Mot triple : mot ×3

La case centrale compte comme mot double.

---

8. Valeur des lettres

Chaque lettre a une valeur en points :

Exemples :

- E, A, I, N, O, R, S, T, U : 1 point
- D, G, M : 2 points
- B, C, P : 3 points
- F, H, V : 4 points
- J, Q : 8 points
- K, W, X, Y, Z : 10 points
- Joker : 0 point

---

9. Bonus scrabble

Si un joueur utilise ses 7 lettres en un seul tour, il gagne 50 points bonus.

---

10. Fin de la partie

La partie se termine quand : il n’y a plus de lettres dans le sac et un joueur n’a plus de lettres ou quand tous les joueurs passent plusieurs fois.

---

11. Calcul final

- Chaque joueur ajoute ses points
- On retire les points des lettres restantes
- Le joueur avec le plus de points gagne
`,
};