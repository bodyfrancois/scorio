import { freeLibreConfig } from './freelibre/config';
import { unoConfig } from './uno/config';
import { beloteConfig } from './belote/config';
import { flip7Config } from './flip7/config';
import { scrabbleConfig } from './scrabble/config';
import { tarotConfig } from './tarot/config';
import { speedbacConfig } from './speedbac/config';
import { hiloConfig } from './hilo/config';
import { skyjoConfig } from './skyjo/config';
import { ligrettoConfig } from './ligretto/config';
import { sixquiprendConfig } from './6quiprend/config';
import { piliPiliConfig } from './pili_pili/config';
import { fiveKingConfig } from './5_rois/config';
import { diceConfig } from './dice/config';
import { GameConfig } from '../core/types';

export const ALL_GAMES: GameConfig[] = [
  freeLibreConfig,
  unoConfig,
  beloteConfig,
  flip7Config,
  skyjoConfig,
  scrabbleConfig,
  tarotConfig,
  hiloConfig,
  ligrettoConfig,
  sixquiprendConfig,
  speedbacConfig,
  piliPiliConfig,
  fiveKingConfig,
  diceConfig,
];

export function getGameConfig(name: string): GameConfig | undefined {
  return ALL_GAMES.find((g) => g.name === name);
}
