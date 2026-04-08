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
};

export type TeamConfig = {
  count: number;
  minPlayersPerTeam: number;
  maxPlayersPerTeam: number;
};

export interface GameConfig {
  name: string;
  minPlayers: number;
  maxPlayers: number;
  estimatedDuration?: number;
  age?: string;
  category?: string;
  description?: string;
  detailedRules?: string;
  scoreLimit?: number;
  roundLimit?: number;
  roundTotal?: number;
  image?: any; // require('...') local asset
  lowestScoreWins: boolean;
  quickActionsName?: string;
  quickActions?: QuickAction[];
  teams?: TeamConfig;
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
    roundLimit?: number
  ): {
    hasEnded: boolean;
    ranking?: RankingItem[];
  };
}