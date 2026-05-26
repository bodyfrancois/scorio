#!/bin/bash
# ================================================
#  Agent Scorio — Installation de MILLE SABORDS
#  Lance depuis la RACINE de ton projet Scorio :
#  bash create_mille_sabords.sh
# ================================================
set -e
echo "🧩 Création du jeu MILLE SABORDS..."

mkdir -p "src/games/mille_sabords/asset"
echo "  ✓ Dossiers créés"

cat > "src/games/mille_sabords/config.ts" << 'HEREDOC'
import { GameConfig } from '../../core/types';

export const milleSabordsConfig: GameConfig = {
  name: 'MILLE SABORDS',
  folder: 'mille_sabords',
  minPlayers: 2,
  maxPlayers: 5,
  lowestScoreWins: false,
  estimatedDuration: 30,
  age: '+8',
  category: 'Dés',
  scoreLimit: 6000,
  description: "Mille Sabords est un jeu de dés sur le thème des pirates où les joueurs cherchent à accumuler le plus de points possible en réalisant des combinaisons de dés. À l'aide de cartes Pirate, ils défient la chance et leurs adversaires dans des parties rapides et pleines de rebondissements.",
  detailedRules: "À son tour, le joueur révèle une carte Pirate qui va influer sur son tirage, puis lance les 8 dés corsaires. Après chaque lancer, il choisit de s'arrêter pour engranger ses points ou de relancer certains dés pour tenter de meilleures combinaisons (mécanique 'stop ou encore'). Attention : si 3 têtes de mort apparaissent, le joueur rentre les mains vides sans marquer de points pour ce tour. Le premier joueur à atteindre 6 000 points déclenche le dernier tour, et celui qui totalise le plus haut score au-dessus de ce seuil remporte la partie. Bonus : si le joueur marque des points avec les 8 dés, il remporte 500 points supplémentaires (coffre au trésor plein).",
  scorePresets: [3000, 6000, 8000],
  summary: "Jeu de dés familial édité par Gigamic, créé par Haim Shafir, pour 2 à 5 joueurs dès 8 ans, parties d'environ 30 minutes, sur le thème des pirates avec mécanique stop-ou-encore.",
  image: require('./asset/logo.png'),
};
HEREDOC
echo "  ✓ config.ts"

cat > "src/games/mille_sabords/logic.ts" << 'HEREDOC'
import { GameEngine } from '../../core/types';
import { sumArray, sortRankingAscending } from '../../core/utils';
import { milleSabordsConfig } from './config';

export const milleSabordsEngine: GameEngine = {
  initializeScores: (playerNames: string[]) => {
    return playerNames.map((name) => ({
      playerName: name,
      scores: [],
      total: 0,
    }));
  },

  addRound: (scores) => {
    return scores.map((playerScore) => ({
      ...playerScore,
      scores: [...playerScore.scores, null],
    }));
  },

  updateScore: (scores, playerIndex, roundIndex, value) => {
    return scores.map((playerScore, index) => {
      if (index !== playerIndex) return playerScore;
      const updatedScores = [...playerScore.scores];
      updatedScores[roundIndex] = value;
      return {
        ...playerScore,
        scores: updatedScores,
      };
    });
  },

  getTotals: (scores) => {
    return scores.map((playerScore) => {
      const validScores = playerScore.scores.filter(
        (s): s is number => s !== null
      );
      return sumArray(validScores);
    });
  },

  checkEndGame: (scores) => {
    const totals = scores.map((playerScore) => {
      const validScores = playerScore.scores.filter(
        (s): s is number => s !== null
      );
      return sumArray(validScores);
    });

    const scoreLimit = milleSabordsConfig.scoreLimit ?? 6000;
    const hasReachedLimit = totals.some((total) => total >= scoreLimit);

    if (!hasReachedLimit) {
      return { isFinished: false };
    }

    const ranking = sortRankingAscending(
      scores.map((playerScore, index) => ({
        playerName: playerScore.playerName,
        total: totals[index],
      }))
    ).reverse();

    return {
      isFinished: true,
      ranking,
    };
  },
};
HEREDOC
echo "  ✓ logic.ts"

cat > "src/games/mille_sabords/scoreInput.ts" << 'HEREDOC'
export const milleSabordsScorePresets = [3000,6000,8000];
HEREDOC
echo "  ✓ scoreInput.ts"

echo "  · Mise à jour de src/core/gameEngine.ts..."
ENGINE="src/core/gameEngine.ts"
if [ ! -f "$ENGINE" ]; then
  echo "  ⚠ gameEngine.ts introuvable — ajoute l'entrée manuellement"
else
  if grep -q "milleSabordsEngine" "$ENGINE"; then
    echo "  · MILLE SABORDS déjà présent dans gameEngine.ts"
  else
    IMPORT="import { milleSabordsEngine } from '../games/mille_sabords/logic';"
    ENTRY="  'MILLE SABORDS': milleSabordsEngine,"
    LAST=$(grep -n "^import" "$ENGINE" | tail -1 | cut -d: -f1)
    if [[ "$OSTYPE" == "darwin"* ]]; then
      sed -i '' "${LAST}a\
$IMPORT
" "$ENGINE"
      sed -i '' "/const engines/,/^};/{/^};/i\
$ENTRY
}" "$ENGINE"
    else
      sed -i "${LAST}a $IMPORT" "$ENGINE"
      sed -i "/const engines/,/^};/{/^};/i $ENTRY}" "$ENGINE"
    fi
    echo "  ✓ gameEngine.ts mis à jour"
  fi
fi

echo ""
echo "✅ MILLE SABORDS créé avec succès !"
echo "👉 Ajoute encore : src/games/mille_sabords/asset/logo.png"
echo "👉 Vérifie que le jeu apparaît dans la liste de l'app"