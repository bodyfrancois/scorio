import { GameEngine } from '../../core/types';
import { sumArray, sortRankingAscending } from '../../core/utils';
import { piliPiliConfig } from './config';

export const piliPiliEngine: GameEngine = {
  config: piliPiliConfig,

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
    const limit = scoreLimit ?? piliPiliConfig.scoreLimit ?? 7;
    const hasEnded = totals.some((t) => t >= limit);

    if (!hasEnded) return { hasEnded: false };

    const ranking = sortRankingAscending(players, totals);
    return { hasEnded: true, ranking };
  },
};
