import { GameEngine, PlayerScoreMatrix } from '../../core/types';
import { sortRankingDescending } from '../../core/utils';
import { cornholeConfig } from './config';

// Cancellation scoring : seule la différence entre les deux partis est conservée.
// Fonctionne pour 2 joueurs ou 2 équipes (toujours 2 lignes dans la matrice).
const computeNetTotals = (scores: PlayerScoreMatrix): number[] => {
  const totals = scores.map(() => 0);
  const numRounds = scores[0]?.length ?? 0;

  for (let r = 0; r < numRounds; r++) {
    const raw = scores.map(row => row[r] ?? 0);
    if (scores.length === 2) {
      totals[0] += Math.max(raw[0] - raw[1], 0);
      totals[1] += Math.max(raw[1] - raw[0], 0);
    } else {
      raw.forEach((s, i) => { totals[i] += s; });
    }
  }

  return totals;
};

export const cornholeEngine: GameEngine = {
  config: cornholeConfig,

  initializeScores(players) {
    return players.map(() => [null]);
  },

  addRound(scores) {
    return scores.map(row => [...row, null]);
  },

  updateScore(scores, playerIndex, roundIndex, value) {
    const updated = scores.map(row => [...row]);
    updated[playerIndex][roundIndex] = value;
    return updated;
  },

  getTotals(scores) {
    return computeNetTotals(scores);
  },

  checkEndGame(scores, players, scoreLimit?) {
    const lastRound = scores[0]?.length - 1;
    const roundCompleted = scores.every(row => row[lastRound] !== null);

    if (!roundCompleted) return { hasEnded: false };

    const totals = computeNetTotals(scores);
    const limit = scoreLimit ?? cornholeConfig.scoreLimit ?? 21;

    const maxScore = Math.max(...totals);
    if (maxScore < limit) return { hasEnded: false };

    // Écart minimum de 2 points requis
    const sorted = [...totals].sort((a, b) => b - a);
    if (sorted[0] - sorted[1] < 2) return { hasEnded: false };

    return { hasEnded: true, ranking: sortRankingDescending(players, totals) };
  },
};
