import { GameConfig } from '../../core/types';

export const skyjoConfig: GameConfig = {
  name: 'SKYJO',
  minPlayers: 2,
  maxPlayers: 8,
  estimatedDuration: 30,
  age:'+8',
  category: 'Jeu de cartes',
  lowestScoreWins: false,
  scoreLimit: 100,
  description: 'Le skyjo est un jeu de cartes où les joueurs tentent de remporter le plus de points possible en retournant les cartes de leur tableau.',
  image: require('./asset/logo.png'), // ✅ image locale au module
  translations: {
    fr: {
      name: 'Skyjo',
      description: 'Le skyjo est un jeu de cartes où les joueurs tentent de remporter le plus de points possible en retournant les cartes de leur tableau.',
      detailedRules: `
1. Objectif du jeu

Le but du jeu est simple : marquer le moins de points possible. Chaque joueur reçoit 12 cartes, et l’objectif est de former des séries de cartes de même valeur tout en éliminant les cartes indésirables. Le joueur avec le moins de points à la fin de la partie remporte la victoire.

---

2. Phase de Début – La Chasse aux Cartes

Lors de la phase de début, les joueurs tentent de collecter des cartes à faible valeur pour minimiser leur score. Il s’agit d’une phase cruciale où chaque carte compte.

---

3. Phase Intermédiaire – Échange et Stratégie

Pendant la phase intermédiaire, les joueurs ont la possibilité d’échanger des cartes avec celles au centre de la table. C’est là que la stratégie entre en jeu, car il faut décider quand échanger et quelles cartes garder.

---

4. Phase de Fin – La Révélation

À la fin du jeu, chaque joueur retourne ses cartes restantes. Les cartes non groupées comptent négativement, tandis que les séries de cartes de même valeur sont avantageuses. Le joueur avec le score le plus bas remporte la partie.

---

5. Règles Spécifiques

Distribution de 12 Cartes faces cachées pour chaque joueur. Placer une carte de la pioche en face visible sur la table, celle-ci constituera le début de la pile pour la défausse. Toutes les cartes de la défausse seront faces visibles. Le reste des cartes sont placées faces cachées et forment la pioche. Chaque joueur place ses 12 cartes en quatre colonnes de trois cartes faces cachées devant lui. Puis, chaque joueur dévoile deux cartes de son choix faces visibles. Pour définir le premier joueur, le joueur qui possède la somme des 2 cartes la plus élevée comment la partie.

Début de la manche: Deux choix s’offrent à vous pour piocher une carte: 1- Choisir la première carte retournée de la pile défausse 2- ou bien choisir la première carte face cachée de la pile pioche. Choix 1: Si le joueur choisi de piocher la première carte face visible de la défausse; il l’échange avec l’une des 12 cartes de son tableau. Il peut choisir la carte de son choix, qu’elle soit visible ou cachée. ( Attention à ne pas retourner les cartes faces cachées). La carte choisi, part dans la pile défausse en face visible. ( Si la carte choisie était cachée, c’est le moment de la retourner). Choix 2: Choisir une une carte dans la pile pioche: Si le joueur choisi de piocher la première carte, qui se trouve face cachée de la pioche. Il regarde la carte et choisie s’il souhaite la conserver ou s’en défausser. – Si le joueur veut la conserver, il doit alors procéder à un échange et le fait selon le même principe que sur le choix 1: il échange la carte choisie avec l’une du tableau qu’il défausse face visible). – S’il ne veut pas garder la carte, il la dépose sur la pile défausse et doit retourner une de ses cartes face visible. ce la marque la fin du tour du joueur. Au joueur suivant!

– Fin d’une manche Quand un joueur a révélé toutes ses cartes, il a joué son dernier tour, les autres joueurs doivent finir le tour en cours et la partie s’arrête. On passe au Décompte des points.

– Décompte des points Les joueurs ayant encore des cartes faces cachées les retournent face visible. Chaque joueur comptabilise son total de points. Si le total de points est positif, il l’additionne au total de points des manches précédentes. Si le total est négatif, il le soustrait au total de points des manches précédentes. Si le joueur qui a terminé la manche le premier n’a pas obtenu strictement, le plus petit nombre de points de cette manche, alors, la somme de ses points pour cette manche est doublée. L’objectif étant d’avoir le moins de points possible, il faudra donc avoir peu de points si vous voulez terminer en premier ! Attention : cette règle ne s’applique qu’aux points positifs.

– Fin de la partie À la fin de chaque manche, les points de chaque joueur sont ajoutés au score total obtenu lors des manches précédentes. Le jeu se termine dès qu’un joueur atteint 100 points ou plus. Le joueur avec le plus petit score gagne la partie.

`,
    },
    en: {
      name: 'Skyjo',
      description: 'Skyjo is a card game where players try to score as few points as possible by flipping over the cards in their grid.',
      detailedRules: `
1. Goal of the game

The goal is simple: score as few points as possible. Each player receives 12 cards, and the objective is to form sets of cards with the same value while getting rid of unwanted cards. The player with the fewest points at the end of the game wins.

---

2. Opening Phase – The Hunt for Cards

During the opening phase, players try to collect low-value cards to minimize their score. This is a crucial phase where every card counts.

---

3. Middle Phase – Exchange and Strategy

During the middle phase, players can exchange cards with those in the center of the table. This is where strategy comes into play, since you must decide when to exchange and which cards to keep.

---

4. End Phase – The Reveal

At the end of the game, each player turns over their remaining cards. Ungrouped cards count against you, while sets of cards with the same value are advantageous. The player with the lowest score wins the game.

---

5. Specific Rules

Deal 12 face-down cards to each player. Place one card from the draw pile face up on the table; this starts the discard pile. All cards in the discard pile are face up. The rest of the cards are placed face down and form the draw pile. Each player arranges their 12 cards in four columns of three face-down cards in front of them. Then, each player reveals two cards of their choice face up. To determine the first player, the player with the highest sum of their 2 revealed cards starts the game.

Start of a round: You have two options for drawing a card: 1- take the top card of the discard pile (already face up), or 2- take the top face-down card from the draw pile. Option 1: If the player chooses to draw the top face-up card from the discard pile, they exchange it with one of the 12 cards in their grid. They may choose any card, whether face up or face down (be careful not to reveal face-down cards while choosing). The chosen card goes face up onto the discard pile (if the chosen card was face down, this is when it gets revealed). Option 2: Draw a card from the draw pile: if the player chooses to draw the top card, which is face down, they look at it and decide whether to keep it or discard it. – If they want to keep it, they must exchange it following the same principle as option 1: they swap the drawn card with one from their grid, which then goes face up onto the discard pile. – If they don't want to keep it, they place it on the discard pile and must reveal one of their own face-down cards. This marks the end of the player's turn. On to the next player!

– End of a round When a player has revealed all of their cards, they have played their last turn; the other players must finish the current turn and the round ends. Scoring then takes place.

– Scoring Players who still have face-down cards turn them face up. Each player totals their points. If the total is positive, it is added to the total score from previous rounds. If the total is negative, it is subtracted from the total score from previous rounds. If the player who finished the round first did not strictly get the lowest number of points that round, then the sum of their points for that round is doubled. Since the goal is to have as few points as possible, you should aim for a low score if you want to finish first! Note: this rule only applies to positive point totals.

– End of the game At the end of each round, each player's points are added to the total score from previous rounds. The game ends as soon as a player reaches 100 points or more. The player with the lowest score wins the game.

`,
    },
  },
  detailedRules: `
1. Objectif du jeu

Le but du jeu est simple : marquer le moins de points possible. Chaque joueur reçoit 12 cartes, et l’objectif est de former des séries de cartes de même valeur tout en éliminant les cartes indésirables. Le joueur avec le moins de points à la fin de la partie remporte la victoire.

---

2. Phase de Début – La Chasse aux Cartes

Lors de la phase de début, les joueurs tentent de collecter des cartes à faible valeur pour minimiser leur score. Il s’agit d’une phase cruciale où chaque carte compte.

---

3. Phase Intermédiaire – Échange et Stratégie

Pendant la phase intermédiaire, les joueurs ont la possibilité d’échanger des cartes avec celles au centre de la table. C’est là que la stratégie entre en jeu, car il faut décider quand échanger et quelles cartes garder.

---

4. Phase de Fin – La Révélation

À la fin du jeu, chaque joueur retourne ses cartes restantes. Les cartes non groupées comptent négativement, tandis que les séries de cartes de même valeur sont avantageuses. Le joueur avec le score le plus bas remporte la partie.

---

5. Règles Spécifiques

Distribution de 12 Cartes faces cachées pour chaque joueur. Placer une carte de la pioche en face visible sur la table, celle-ci constituera le début de la pile pour la défausse. Toutes les cartes de la défausse seront faces visibles. Le reste des cartes sont placées faces cachées et forment la pioche. Chaque joueur place ses 12 cartes en quatre colonnes de trois cartes faces cachées devant lui. Puis, chaque joueur dévoile deux cartes de son choix faces visibles. Pour définir le premier joueur, le joueur qui possède la somme des 2 cartes la plus élevée comment la partie.

Début de la manche: Deux choix s’offrent à vous pour piocher une carte: 1- Choisir la première carte retournée de la pile défausse 2- ou bien choisir la première carte face cachée de la pile pioche. Choix 1: Si le joueur choisi de piocher la première carte face visible de la défausse; il l’échange avec l’une des 12 cartes de son tableau. Il peut choisir la carte de son choix, qu’elle soit visible ou cachée. ( Attention à ne pas retourner les cartes faces cachées). La carte choisi, part dans la pile défausse en face visible. ( Si la carte choisie était cachée, c’est le moment de la retourner). Choix 2: Choisir une une carte dans la pile pioche: Si le joueur choisi de piocher la première carte, qui se trouve face cachée de la pioche. Il regarde la carte et choisie s’il souhaite la conserver ou s’en défausser. – Si le joueur veut la conserver, il doit alors procéder à un échange et le fait selon le même principe que sur le choix 1: il échange la carte choisie avec l’une du tableau qu’il défausse face visible). – S’il ne veut pas garder la carte, il la dépose sur la pile défausse et doit retourner une de ses cartes face visible. ce la marque la fin du tour du joueur. Au joueur suivant!

– Fin d’une manche Quand un joueur a révélé toutes ses cartes, il a joué son dernier tour, les autres joueurs doivent finir le tour en cours et la partie s’arrête. On passe au Décompte des points.

– Décompte des points Les joueurs ayant encore des cartes faces cachées les retournent face visible. Chaque joueur comptabilise son total de points. Si le total de points est positif, il l’additionne au total de points des manches précédentes. Si le total est négatif, il le soustrait au total de points des manches précédentes. Si le joueur qui a terminé la manche le premier n’a pas obtenu strictement, le plus petit nombre de points de cette manche, alors, la somme de ses points pour cette manche est doublée. L’objectif étant d’avoir le moins de points possible, il faudra donc avoir peu de points si vous voulez terminer en premier ! Attention : cette règle ne s’applique qu’aux points positifs.

– Fin de la partie À la fin de chaque manche, les points de chaque joueur sont ajoutés au score total obtenu lors des manches précédentes. Le jeu se termine dès qu’un joueur atteint 100 points ou plus. Le joueur avec le plus petit score gagne la partie.

`,
};