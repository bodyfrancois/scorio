import { GameEngine } from '../../core/types';
import { sumArray, sortRankingAscending, sortRankingDescending } from '../../core/utils';
import { freeLibreConfig } from './config';

export const freeLibreEngine: GameEngine = {
  config: freeLibreConfig,

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

  checkEndGame(scores, players, scoreLimit?, _roundLimit?, lowestScoreWins?) {
    const lastRound = scores[0].length - 1;
    const roundCompleted = scores.every((row) => row[lastRound] !== null);
    if (!roundCompleted) return { hasEnded: false };

    const totals = scores.map((row) => sumArray(row));
    const limit = scoreLimit ?? freeLibreConfig.scoreLimit ?? 100;
    const hasEnded = totals.some((t) => t >= limit);
    if (!hasEnded) return { hasEnded: false };

    const ranking = lowestScoreWins
      ? sortRankingAscending(players, totals)
      : sortRankingDescending(players, totals);

    return { hasEnded: true, ranking };
  },
};
