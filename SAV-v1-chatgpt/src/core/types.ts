export type PlayerScoreMatrix = number[][];

export type RankingItem = {
  name: string;
  score: number;
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
  image?: any; // require('...') local asset
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
    players: string[]
  ): {
    hasEnded: boolean;
    ranking?: RankingItem[];
  };
}