import { GameConfig } from '../../core/types';

export const tarotConfig: GameConfig = {
  name: 'Tarot',
  minPlayers: 2,
  maxPlayers: 10,
  estimatedDuration: 20,
  age:'+8',
  category: 'Jeu de cartes',
  lowestScoreWins: false,
  roundLimit: 10,
  description: 'Le tarot est un jeu de cartes où les joueurs enchérissent et tentent de remporter des plis pour marquer le plus de points possible.',
  image: require('./asset/logo.png'), // ✅ image locale au module
  detailedRules: `
1. Objectif

Gagner des points en remportant des plis.


2. Déroulement d’une partie

### 1. Distribution

- Chaque joueur reçoit **18 cartes**
- 6 cartes restent au centre : le **chien**

---

### 2. Les enchères

Chaque joueur annonce s’il veut jouer et à quel niveau :

- Prise
- Garde
- Garde sans le chien
- Garde contre le chien

👉 Le joueur qui parle le plus fort devient le **preneur**

---

### 3. Le chien

- Le preneur récupère le chien (sauf certaines gardes)
- Il écarte ensuite 6 cartes

---

### 4. Le jeu (les plis)

- On joue chacun une carte à tour de rôle

Il faut :
 - suivre la couleur demandée
 - sinon jouer un atout
 - sinon se défausser

👉 L’atout le plus fort gagne le pli

---

3. Les points

### Valeur des cartes importantes :

- Roi : 4,5 points
- Dame : 3,5 points
- Cavalier : 2,5 points
- Valet : 1,5 point
- Autres cartes : 0,5 point

---

### Objectif du preneur

Il doit atteindre un score selon ses bouts :

- 3 bouts → 36 points
- 2 bouts → 41 points
- 1 bout → 51 points
- 0 bout → 56 points

---

4. L’Excuse

- Peut être jouée à tout moment
- Ne fait pas gagner le pli
- Permet souvent d’éviter de perdre une carte importante

---

5. Astuce débutant

- Garde tes atouts forts pour les moments clés
- Essaie de repérer qui possède les bouts
- Joue en équipe (contre le preneur)


`,
};