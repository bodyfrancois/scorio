import { GameConfig } from '../../core/types';

export const diceConfig: GameConfig = {
  name: 'DÉS',
  minPlayers: 0,
  maxPlayers: 0,
  isDiceGame: true,
  cardSubtitle: 'Lanceur de dés',
  lowestScoreWins: false,
  image: require('./asset/logo.png'), // ✅ image locale au module
  description: 'Lance des dés de toutes sortes — D4, D6, D8, D10, D12, D20. Clique pour lancer, recommence autant que tu veux.',
};
