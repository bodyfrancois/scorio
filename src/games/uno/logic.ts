import { GameEngine } from '../../core/types';
import { sumArray, sortRankingAscending } from '../../core/utils';
import { unoConfig } from './config';

export const unoEngine: GameEngine = {
  config: unoConfig,

  initializeScores(players) {
    return players.map(() => [0]);
  },

  addRound(scores) {
    return scores.map((row) => [...row, 0]);
  },

  updateScore(scores, playerIndex, roundIndex, value) {
    const updated = scores.map((row) => [...row]);
    updated[playerIndex][roundIndex] = value;
    return updated;
  },

  getTotals(scores) {
    return scores.map((row) => sumArray(row));
  },

  checkEndGame(scores, players) {
    const lastRound = scores[0].length - 1;

    const roundCompleted = scores.every(
      (row) => row[lastRound] !== 0
    );

    if (!roundCompleted) return { hasEnded: false };

    const totals = scores.map((row) => sumArray(row));

    const hasEnded = totals.some((t) => t >= 500);
    if (!hasEnded) return { hasEnded: false };

    const ranking = sortRankingAscending(
      players,
      totals
    );

    return { hasEnded: true, ranking };
  },
};