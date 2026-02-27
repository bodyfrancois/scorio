export type RootStackParamList = {
  Main: undefined;
  NewGame: { gameName: string };
  Scoreboard: {
    gameName: string;
    players: string[];
  };
};