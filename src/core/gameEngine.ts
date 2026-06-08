import { GameEngine } from './types';
import { diceEngine } from '../games/dice/logic';
import { freeLibreEngine } from '../games/freelibre/logic';
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
import { fiveKingEngine } from '../games/5_rois/logic';
import { piliPiliEngine } from '../games/pili_pili/logic';
import { milleSabordsEngine } from '../games/mille_sabords/logic';
import { paletEngine } from '../games/palet/logic';
import { flechettes301Engine } from '../games/flechettes_301/logic';
import { cornholeEngine } from '../games/cornhole/logic';
import { petanqueEngine } from '../games/petanque/logic';


const engines: Record<string, GameEngine> = {
  'MODE LIBRE': freeLibreEngine,
  'PALET': paletEngine,
  '5 ROIS': fiveKingEngine,
  'UNO': unoEngine,
  'SPEED BAC': speedbacEngine,
  'BELOTE': beloteEngine,
  'MILLE SABORDS': milleSabordsEngine,
  'DÉS': diceEngine,
  'FLÉCHETTES 301': flechettes301Engine,
  'PILI PILI': piliPiliEngine,
  'FLIP 7': flip7Engine,
  'HILO': hiloEngine,
  'CORNHOLE': cornholeEngine,
  'PÉTANQUE': petanqueEngine,
  '6 QUI PREND': sixquiprendeEngine,
  'TAROT': tarotEngine,
  'LIGRETTO': ligrettoEngine,
  'SKYJO': skyjoEngine,
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