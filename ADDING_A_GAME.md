# Ajouter un nouveau jeu dans Scorio

Ce guide décrit toutes les étapes pour intégrer un nouveau jeu dans l'application.

---

## 1. Créer le dossier du jeu

```
src/games/<nom_du_jeu>/
├── asset/
│   └── logo.png        ← image carrée recommandée (ex: 200×200 px)
├── config.ts
├── logic.ts
└── scoreInput.ts
```

Utiliser un nom en minuscules sans espaces (ex: `flip7`, `belote`, `scrabble`).

---

## 2. Créer `config.ts`

Déclare la configuration statique du jeu (métadonnées + règles).

```ts
import { GameConfig } from '../../core/types';

export const monJeuConfig: GameConfig = {
  name: 'MON JEU',           // Nom affiché dans l'app (majuscules recommandées)
  minPlayers: 2,
  maxPlayers: 6,
  lowestScoreWins: false,    // true = le moins de points gagne, false = le plus de points gagne
  estimatedDuration: 30,     // En minutes (optionnel)
  age: '+10',                // Âge minimum (optionnel)
  category: 'Cartes',        // Catégorie (optionnel)
  scoreLimit: 100,           // Limite de score pour fin de partie (optionnel)
  description: 'Description courte du jeu.',
  image: require('./asset/logo.png'),
  detailedRules: `
1. Objectif
...
`,
  // Optionnel — uniquement si le jeu a des actions rapides (ex: annonces Belote)
  quickActionsName: 'Annonces',
  quickActions: [
    { label: 'Bonus', value: 10 },
  ],
  // Optionnel — uniquement si le jeu se joue en équipes
  teams: {
    count: 2,
    minPlayersPerTeam: 2,
    maxPlayersPerTeam: 2,
  },
};
```

**Champs requis :** `name`, `minPlayers`, `maxPlayers`, `lowestScoreWins`

**Champs optionnels :** `estimatedDuration`, `age`, `category`, `scoreLimit`, `description`, `image`, `detailedRules`, `quickActionsName`, `quickActions`, `teams`, `roundTotal`

> `roundTotal` : total fixe par manche (utilisé par la Belote pour valider que la somme des scores = 162).

---

## 3. Créer `logic.ts`

Implémente l'engine du jeu (logique de scores).

```ts
import { GameEngine } from '../../core/types';
import { sumArray, sortRankingAscending } from '../../core/utils';
import { monJeuConfig } from './config';

export const monJeuEngine: GameEngine = {
  config: monJeuConfig,

  initializeScores(players) {
    return players.map(() => [null]);
  },

  addRound(scores) {
    return scores.map((row) => [...row, null]);
  },

  updateScore(scores, playerIndex, roundIndex, value) {
    const updated = scores.map((row) => [...row]);
    updated[playerIndex][roundIndex] = value;
    return updated;
  },

  getTotals(scores) {
    return scores.map((row) => sumArray(row));
  },

  checkEndGame(scores, players, scoreLimit?) {
    const lastRound = scores[0].length - 1;
    const roundCompleted = scores.every((row) => row[lastRound] !== null);
    if (!roundCompleted) return { hasEnded: false };

    const totals = scores.map((row) => sumArray(row));
    const limit = scoreLimit ?? monJeuConfig.scoreLimit ?? 500;
    const hasEnded = totals.some((t) => t >= limit);
    if (!hasEnded) return { hasEnded: false };

    // sortRankingAscending = le moins de points gagne (UNO, Flip7, Scrabble)
    // sortRankingDescending = le plus de points gagne → à implémenter si besoin
    const ranking = sortRankingAscending(players, totals);
    return { hasEnded: true, ranking };
  },
};
```

---

## 4. Créer `scoreInput.ts`

Déclare les presets de saisie rapide (peut rester vide).

```ts
// Laisser vide si pas de presets de score
export const monJeuScorePresets = [];

// Ou avec des valeurs prédéfinies :
// export const monJeuScorePresets = [0, 10, 20, 50];
```

> ⚠️ Le nom de la constante **doit** correspondre au jeu (ne pas copier-coller `unoScorePresets`).

---

## 5. Enregistrer l'engine dans `gameEngine.ts`

Fichier : `src/core/gameEngine.ts`

```ts
import { monJeuEngine } from '../games/mon_jeu/logic';  // ← ajouter l'import

const engines: Record<string, GameEngine> = {
  UNO: unoEngine,
  BELOTE: beloteEngine,
  SCRABBLE: scrabbleEngine,
  'FLIP 7': flip7Engine,
  'MON JEU': monJeuEngine,  // ← ajouter l'entrée
};
```

> ⚠️ La clé doit être **exactement** `config.name.toUpperCase()` (espaces inclus). Ex: si `name` est `'FLIP 7'`, la clé est `'FLIP 7'` et non `'FLIP7'`. La fonction `getGameEngine` fait `gameName.toUpperCase()` sans transformer les espaces.

---

## 6. Vérification finale

- [ ] `logo.png` présent dans `asset/`
- [ ] `config.ts` — tous les champs requis renseignés
- [ ] `logic.ts` — les 5 méthodes de l'interface `GameEngine` implémentées
- [ ] `scoreInput.ts` — nom de la constante correct (pas `unoScorePresets`)
- [ ] `gameEngine.ts` — engine importé et enregistré dans `engines`
- [ ] Le jeu apparaît dans la liste sur l'écran d'accueil

---

## Structure des types utiles

```
src/core/types.ts      → GameConfig, GameEngine, PlayerScoreMatrix, RankingItem, QuickAction
src/core/utils.ts      → sumArray, sortRankingAscending
src/core/gameEngine.ts → getGameEngine, getAvailableGames
```
