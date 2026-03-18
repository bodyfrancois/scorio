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