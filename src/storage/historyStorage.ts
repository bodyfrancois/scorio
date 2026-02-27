import AsyncStorage from '@react-native-async-storage/async-storage';

export type GameHistoryItem = {
  id: string;
  gameName: string;
  date: string;
  players: string[];
  ranking: {
    name: string;
    score: number;
  }[];
};

const HISTORY_KEY = 'SCORIO_HISTORY';

/* Sauvegarder une partie */
export const saveGameToHistory = async (
  game: GameHistoryItem
) => {
  try {
    const existing = await AsyncStorage.getItem(HISTORY_KEY);
    const history: GameHistoryItem[] = existing
      ? JSON.parse(existing)
      : [];

    history.unshift(game); // plus récent en haut

    await AsyncStorage.setItem(
      HISTORY_KEY,
      JSON.stringify(history)
    );
  } catch (error) {
    console.error('Erreur sauvegarde historique', error);
  }
};

/* Récupérer l’historique */
export const getHistory = async (): Promise<
  GameHistoryItem[]
> => {
  try {
    const existing = await AsyncStorage.getItem(HISTORY_KEY);
    return existing ? JSON.parse(existing) : [];
  } catch (error) {
    console.error('Erreur lecture historique', error);
    return [];
  }
};

/* (Optionnel) vider l’historique */
export const clearHistory = async () => {
  await AsyncStorage.removeItem(HISTORY_KEY);
};
