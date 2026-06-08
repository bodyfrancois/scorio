import { GameEngine } from '../../core/types';
import { sumArray, sortRankingDescending } from '../../core/utils';
import { paletConfig } from './config';

export const paletEngine: GameEngine = {
  config: paletConfig,

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
    const lastRound = scores[0]?.length - 1;
    const roundCompleted = scores.every((row) => row[lastRound] !== null);

    if (!roundCompleted) return { hasEnded: false };

    const totals = scores.map((row) => sumArray(row));
    const limit = scoreLimit ?? paletConfig.scoreLimit ?? 11;
    const hasEnded = totals.some((t) => t >= limit);

    if (!hasEnded) return { hasEnded: false };

    return { hasEnded: true, ranking: sortRankingDescending(players, totals) };
  },
};
