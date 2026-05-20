import { GameEngine } from '../../core/types';
import { diceConfig } from './config';

export const diceEngine: GameEngine = {
  config: diceConfig,
  initializeScores: () => [],
  addRound: (scores) => scores,
  updateScore: (scores) => scores,
  getTotals: () => [],
  checkEndGame: () => ({ hasEnded: false }),
};
