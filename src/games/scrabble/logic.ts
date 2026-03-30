import { GameEngine } from '../../core/types';
import { sumArray, sortRankingDescending } from '../../core/utils';
import { scrabbleConfig } from './config';

export const scrabbleEngine: GameEngine = {
  config: scrabbleConfig,

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

  checkEndGame(scores, players, scoreLimit?, roundLimit?) {
    const lastRound = scores[0].length - 1;

    const roundCompleted = scores.every(
      (row) => row[lastRound] !== null
    );

    if (!roundCompleted) return { hasEnded: false };

    const totals = scores.map((row) => sumArray(row));

    const effectiveRoundLimit = roundLimit ?? scrabbleConfig.roundLimit;
    if (effectiveRoundLimit != null) {
      if (scores[0].length < effectiveRoundLimit) return { hasEnded: false };
      return { hasEnded: true, ranking: sortRankingDescending(players, totals) };
    }

    const limit = scoreLimit ?? scrabbleConfig.scoreLimit ?? 500;
    const hasEnded = totals.some((t) => t >= limit);
    if (!hasEnded) return { hasEnded: false };

    return { hasEnded: true, ranking: sortRankingDescending(players, totals) };
  },
};