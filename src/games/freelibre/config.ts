import { GameConfig } from '../../core/types';

export const freeLibreConfig: GameConfig = {
  name: 'MODE LIBRE',
  minPlayers: 2,
  maxPlayers: 99,
  lowestScoreWins: false,
  lowestScoreWinsToggle: true,
  scoreLimitToggle: true,
  timeLimitToggle: true,
  roundLimitToggle: true,
  teamsToggle: true,
  scoreLimit: 100,
  cardSubtitle: 'Partie sur mesure, règles libres',
  cardHighlight: true,
  description: "Créez votre partie sur mesure avec vos propres règles. Compatible avec n'importe quel jeu de société !",
  translations: {
    fr: {
      name: 'Mode Libre',
      cardSubtitle: 'Partie sur mesure, règles libres',
      description: "Créez votre partie sur mesure avec vos propres règles. Compatible avec n'importe quel jeu de société !",
    },
    en: {
      name: 'Free Mode',
      cardSubtitle: 'Custom game, free-form rules',
      description: 'Create your own custom game with your own rules. Compatible with any board game!',
    },
  },
};
