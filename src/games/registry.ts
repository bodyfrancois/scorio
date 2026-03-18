import { unoConfig } from './uno/config';
import { beloteConfig } from './belote/config';
import { flip7Config } from './flip7/config';
import { scrabbleConfig } from './scrabble/config';
import { GameConfig } from '../core/types';

export const ALL_GAMES: GameConfig[] = [
  unoConfig,
  beloteConfig,
  flip7Config,
  scrabbleConfig,
];

export function getGameConfig(name: string): GameConfig | undefined {
  return ALL_GAMES.find((g) => g.name === name);
}
