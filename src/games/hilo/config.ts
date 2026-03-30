import { GameConfig } from '../../core/types';

export const hiloConfig: GameConfig = {
  name: 'HILO',
  minPlayers: 2,
  maxPlayers: 6,
  estimatedDuration: 20,
  age:'+5',
  category: 'Jeu de cartes',
  lowestScoreWins: true,
  scoreLimit: 100,
  description: 'Hilo est un jeu de cartes où il faut obtenir le moins de points possible en remplaçant intelligemment ses cartes.',
  image: require('./asset/logo.png'), // ✅ image locale au module
  detailedRules: `
1. Mise en place :

- Se joue de 2 à 6 joueurs avec un jeu Hilo
- Chaque joueur reçoit 9 cartes face cachée
- Les cartes sont disposées en grille de 3 x 3 devant chaque joueur
- Chaque joueur retourne 2 cartes de son choix face visible
- Le reste des cartes forme une pioche
- La première carte de la pioche est retournée pour former la défausse

---

2. But du jeu :

- Avoir le moins de points possible à la fin de la manche
- La partie se joue généralement en plusieurs manches

---

3. Déroulement d’un tour :

Le joueur actif choisit :
  - soit de piocher une carte face cachée
  - soit de prendre la carte visible de la défausse

Après avoir pris une carte, il a deux options :
  - échanger cette carte avec une carte de sa grille (face cachée ou visible)
  - la carte remplacée est alors défaussée
  - la nouvelle carte est posée face visible
  - ou refuser la carte : il la défausse puis doit retourner une carte face cachée de sa grille

---

4. Valeur des cartes :

- Les cartes ont des valeurs positives ou négatives (selon le jeu)
- Certaines cartes peuvent valoir beaucoup de points, d’autres en retirent

---

5. Règle des colonnes :

- Si un joueur réussit à aligner 3 cartes identiques dans une colonne : il peut les retirer immédiatement ces cartes ne comptent plus (0 point)

---

6. Fin de manche :

- Lorsqu’un joueur a révélé toutes ses cartes, il déclenche la fin
- Les autres joueurs jouent encore un dernier tour

---

7. Comptage des points :

- Chaque joueur additionne les points de ses cartes restantes
- Les cartes retirées (colonnes complètes) valent 0

---

8. Fin de partie :

- On joue plusieurs manches
- Le joueur avec le moins de points gagne

---

9. Conseils :

- Mémoriser les cartes retournées est essentiel
- Prendre des risques au bon moment peut réduire fortement le score
- Essayer de compléter des colonnes identiques est une stratégie clé
`,
};