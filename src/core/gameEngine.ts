import { GameEngine } from './types';
import { unoEngine } from '../games/uno/logic';
import { beloteEngine } from '../games/belote/logic';
import { scrabbleEngine } from '../games/scrabble/logic';
import { flip7Engine } from '../games/flip7/logic';

const engines: Record<string, GameEngine> = {
  UNO: unoEngine,
  BELOTE: beloteEngine,
  SCRABBLE: scrabbleEngine,
  'FLIP 7': flip7Engine
};

export const getGameEngine = (gameName: string) => {
  const engine = engines[gameName.toUpperCase()];

  if (!engine) {
    throw new Error(
      `No engine found for ${gameName}`
    );
  }

  return engine;
};

export const getAvailableGames = () => {
  return Object.values(engines).map(
    (engine) => engine.config
  );
};