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
  CoinToss: undefined;
  Timer: undefined;
  Wheel: undefined;
  Buzzer: undefined;
  Support: undefined;
};