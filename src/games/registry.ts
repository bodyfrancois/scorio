import { GameConfig } from '../core/types';
import { getAvailableGames } from '../core/gameEngine';

export type { GameConfig };

export function getGameConfig(name: string): GameConfig | undefined {
  return getAvailableGames().find((g) => g.name === name);
}
