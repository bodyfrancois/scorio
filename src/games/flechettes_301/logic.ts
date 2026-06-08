import { GameEngine, PlayerScoreMatrix } from '../../core/types';
import { sortRankingAscending } from '../../core/utils';
import { flechettes301Config } from './config';

const START_SCORE = 301;

const computeRemaining = (scores: PlayerScoreMatrix): number[] => {
  return scores.map(row => {
    let remaining = START_SCORE;
    for (const val of row) {
      if (val === null) continue;
      if (val > remaining) continue; // BUST : manche ignorée, score inchangé
      remaining -= val;
    }
    return remaining;
  });
};

export const flechettes301Engine: GameEngine = {
  config: flechettes301Config,

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
    return computeRemaining(scores);
  },

  checkEndGame(scores, players) {
    const lastRound = scores[0]?.length - 1;
    const roundCompleted = scores.every(row => row[lastRound] !== null);

    if (!roundCompleted) return { hasEnded: false };

    const remaining = computeRemaining(scores);
    const hasEnded = remaining.some(r => r === 0);

    if (!hasEnded) return { hasEnded: false };

    return { hasEnded: true, ranking: sortRankingAscending(players, remaining) };
  },
};
