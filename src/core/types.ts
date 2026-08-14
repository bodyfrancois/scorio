export type PlayerScoreMatrix = (number | null)[][];

export type RankingItem = {
  name: string;
  score: number;
};

export type QuickAction = {
  label: string;
  value: number;
  /** Capot : remporter tous les plis. Active auto-remplit la base avec roundTotal. */
  isCapot?: boolean;
  /** Nombre maximum de fois que cette annonce peut être sélectionnée (défaut : 1). */
  maxCount?: number;
};

export type QuickActionGroup = {
  label: string;
  actions: QuickAction[];
};

export type TeamConfig = {
  count: number;
  minPlayersPerTeam: number;
  maxPlayersPerTeam: number;
};

export type GameTranslation = {
  name: string;
  description?: string;
  detailedRules?: string;
  cardSubtitle?: string;
};

export interface GameConfig {
  name: string;
  minPlayers: number;
  maxPlayers: number;
  estimatedDuration?: number;
  age?: string;
  category?: string;
  cardSubtitle?: string;
  description?: string;
  detailedRules?: string;
  /** Traductions du nom/description/règles affichés. `name` reste l'identifiant technique inchangé. */
  translations?: {
    fr: GameTranslation;
    en: GameTranslation;
  };
  scoreLimit?: number;
  roundLimit?: number;
  roundTotal?: number;
  scoreMin?: number;
  scoreMax?: number;
  scoreStep?: number;
  scoreInputMode?: 'keypad' | 'stepper';
  image?: any; // require('...') local asset
  lowestScoreWins: boolean;
  isDiceGame?: boolean;
  cardHighlight?: boolean;
  scoreLimitToggle?: boolean;
  roundLimitToggle?: boolean;
  teamsToggle?: boolean;
  lowestScoreWinsToggle?: boolean;
  timeLimitToggle?: boolean;
  quickActionsName?: string;
  quickActions?: QuickAction[];
  quickActionGroups?: QuickActionGroup[];
  teams?: TeamConfig;
  exclusiveRoundScoring?: boolean;
}

export interface GameEngine {
  config: GameConfig;

  initializeScores(players: string[]): PlayerScoreMatrix;

  addRound(scores: PlayerScoreMatrix): PlayerScoreMatrix;

  updateScore(
    scores: PlayerScoreMatrix,
    playerIndex: number,
    roundIndex: number,
    value: number
  ): PlayerScoreMatrix;

  getTotals(scores: PlayerScoreMatrix): number[];

  checkEndGame(
    scores: PlayerScoreMatrix,
    players: string[],
    scoreLimit?: number,
    roundLimit?: number,
    lowestScoreWins?: boolean,
  ): {
    hasEnded: boolean;
    ranking?: RankingItem[];
  };
}