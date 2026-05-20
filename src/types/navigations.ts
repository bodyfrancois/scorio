import { DiceType } from '../components/DiceShape';

export type RootStackParamList = {
  Main: undefined;
  NewGame: { gameName: string };
  Scoreboard: {
    gameName: string;
    players: string[];
  };
  DiceSetup: undefined;
  DiceRoller: { diceCount: number; diceType: DiceType };
};