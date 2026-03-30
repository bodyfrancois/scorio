import { GameEngine } from './types';
import { unoEngine } from '../games/uno/logic';
import { beloteEngine } from '../games/belote/logic';
import { scrabbleEngine } from '../games/scrabble/logic';
import { flip7Engine } from '../games/flip7/logic';
import { tarotEngine } from '../games/tarot/logic';
import { speedbacEngine } from '../games/speedbac/logic';
import { hiloEngine } from '../games/hilo/logic';
import { skyjoEngine } from '../games/skyjo/logic';
import { ligrettoEngine } from '../games/ligretto/logic';
import { sixquiprendeEngine } from '../games/6quiprend/logic';

const engines: Record<string, GameEngine> = {
  'UNO': unoEngine,
  'BELOTE': beloteEngine,
  'SKYJO': skyjoEngine,
  'FLIP 7': flip7Engine,
  'HILO': hiloEngine,
  'SPEED BAC': speedbacEngine,
  '6 QUI PREND': sixquiprendeEngine,
  'LIGRETTO': ligrettoEngine,
  'TAROT': tarotEngine,
  'SCRABBLE': scrabbleEngine,
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