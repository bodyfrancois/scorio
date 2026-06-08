#!/bin/bash
# ==============================================
#  Agent Scorio — Installation de CORNHOLE
#  Lance depuis la RACINE de ton projet Scorio
#  bash create_cornhole.sh
# ==============================================
set -e
echo "🧩 Création du jeu CORNHOLE..."

mkdir -p "src/games/cornhole/asset"
echo "  ✓ Dossiers créés"

cat > "src/games/cornhole/config.ts" << 'SCORIO_EOF'
```typescript
import { GameConfig } from '../../core/types';

export enum ImageType {
  Logo = 'logo.png',
}

export const cornholeConfig: GameConfig = {
  name: 'CORNHOLE',
  image: require('./assets/logo.png'),
  folder: 'cornhole',
  minPlayers: 2,
  maxPlayers: 4,
  lowestScoreWins: false,
  estimatedDuration: 15,
  age: '+7',
  category: 'Objets',
  quickActionsName: '',
  quickActions: [],
  description: '',
  detailedRules: '',
  teams: null,
  scorePresets: [],
  summary: 'Jeux de balles et de paillettes.',
};
```
SCORIO_EOF
echo "  ✓ config.ts"

cat > "src/games/cornhole/logic.ts" << 'SCORIO_EOF'
```typescript
import { GameEngine } from '../../core/types';
import { sumArray, sortRankingAscending } from '../../core/utils';
import { cornholeConfig } from './config';

export const cornholeEngine: GameEngine = {
  config: cornholeConfig,
  initializeScores,
  addRound,
  updateScore,
  getTotals,
  checkEndGame,
};

function initializeScores(rounds: number): { [key: number]: number[] } {
  return Array(rounds).fill(null).map((_, index) => (index + 1).toString());
}

function addRound(roundNumber: number): void {
  // Récupère les scores actuels
  const scores = getTotals();
  // Ajoute un nouveau round aux scores
  scores[roundNumber] = Array(Object.keys(scores).length).fill(0);
  // Met à jour les scores
  updateScores(scores);
}

function updateScore(roundNumber: number, playerNumber: number, points: number): void {
  // Get les scores actuels
  const scores = getTotals();
  // Met à jour les scores pour le joueur spécifique
  scores[roundNumber][playerNumber - 1] = points;
  // Met à jour les scores
  updateScores(scores);
}

function getTotals(allRounds: boolean = true): { [key: number]: number[] } {
  return Object.keys(cornholeEngine.config.scores).reduce((acc, key) => {
    acc[key] = (allRounds ? cornholeEngine.config.scores[key][0] : sumArray(cornholeEngine.config.scores[key])) as number[];
    return acc;
  }, {}) as { [key: number]: number[] };
}

function checkEndGame(allRounds: boolean = true): boolean {
  // Récupère les scores pour tous les rounds
  const scores = getTotals(allRounds);
  // Trie les scores en ordre croissant
  const sortedScores = Object.keys(scores).sort((a, b) => sumObjectValues(scores[b]) - sumObjectValues(scores[a]));

  return sortedScores.length === 1;
}

function updateScores(scores: { [key: number]: number[] }): void {
  // Met à jour les scores
  cornholeEngine.config.scores = scores;
}
```
et le fichier config.ts

```typescript
export const cornholeConfig = {
  minPlayers: 2,
  maxPlayers: 4,
  lowestScoreWins: false,
  estimatedDuration: 15,
  age: '+7',
  category: 'Objets',
  scoreLimit: null,
  description: '',
  detailedRules: '',
  quickActionsName: '',
  quickActions: [],
  teams: null,
  scorePresets: [],
  scores: {
    // Récupère les scores du jeu Cornhole
    // Ensuite ajoute chaque round aux scores comme une nouvelle clé
  },
  summary: 'Jeux de balles et de paillettes.',
};
```
SCORIO_EOF
echo "  ✓ logic.ts"

cat > "src/games/cornhole/scoreInput.ts" << 'SCORIO_EOF'
```typescript
export const cornholeScorePresets = [
  { label: '10 rounds', value: 10 },
  { label: '20 rounds', value: 20 },
  { label: '30 rounds', value: 30 },
  { label: '40 rounds', value: 40 },
];
```
SCORIO_EOF
echo "  ✓ scoreInput.ts"

# Mise à jour de gameEngine.ts via Node.js
cat > "_scorio_update.js" << 'SCORIO_EOF'
var fs = require("fs");
var filePath = "src/core/gameEngine.ts";
if (!fs.existsSync(filePath)) {
  console.log("  ⚠ gameEngine.ts introuvable");
  process.exit(0);
}
var content = fs.readFileSync(filePath, "utf8");
var importLine = "import { cornholeEngine } from '../games/cornhole/logic';";
var engineEntry = "  'CORNHOLE': cornholeEngine,";
if (content.indexOf("cornholeEngine") !== -1) {
  console.log("  · CORNHOLE déjà présent dans gameEngine.ts");
  process.exit(0);
}
var lines = content.split("\n");
var lastImport = 0;
for (var i = 0; i < lines.length; i++) {
  if (lines[i].indexOf("import ") === 0) lastImport = i;
}
lines.splice(lastImport + 1, 0, importLine);
content = lines.join("\n");
content = content.replace(/const engines[\s\S]*?\{/, function(m) { return m + "\n" + engineEntry; });
fs.writeFileSync(filePath, content, "utf8");
console.log("  ✓ gameEngine.ts mis à jour");
SCORIO_EOF
node _scorio_update.js
rm _scorio_update.js

echo ""
echo "✅ CORNHOLE créé avec succès !"
echo "👉 Ajoute encore : src/games/cornhole/asset/logo.png"
echo "👉 Vérifie que le jeu apparaît dans la liste de l'app"
