import { GameEngine } from '../../core/types';
import { sumArray, sortRankingAscending } from '../../core/utils';
import { fiveKingConfig } from './config';

const MAX_ROUNDS = 11;

export const fiveKingEngine: GameEngine = {
  config: fiveKingConfig,

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

  checkEndGame(scores, players) {
    const lastRound = scores[0]?.length - 1;
    const roundCompleted = scores.every((row) => row[lastRound] !== null);

    if (!roundCompleted) return { hasEnded: false };

    const totals = scores.map((row) => sumArray(row));
    const hasEnded = (lastRound + 1) >= MAX_ROUNDS;
    if (!hasEnded) return { hasEnded: false };

    const ranking = sortRankingAscending(players, totals);
    return { hasEnded: true, ranking };
  },
};
