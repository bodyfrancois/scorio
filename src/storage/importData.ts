import { GameHistoryItem, getHistory, setHistory } from './historyStorage';
import { FavoritePlayer, loadFavorites, saveFavorites } from './favoritePlayers';

export type ImportMode = 'merge' | 'replace';

export type ImportResult = {
  addedFavorites: number;
  addedGames: number;
};

const isFavoritePlayer = (x: any): x is FavoritePlayer =>
  !!x && typeof x.name === 'string' && typeof x.colorKey === 'string';

const isGameHistoryItem = (x: any): x is GameHistoryItem =>
  !!x &&
  typeof x.id === 'string' &&
  typeof x.gameName === 'string' &&
  typeof x.date === 'string' &&
  !isNaN(new Date(x.date).getTime()) &&
  Array.isArray(x.players) &&
  x.players.every((p: any) => typeof p === 'string') &&
  Array.isArray(x.ranking) &&
  x.ranking.every((r: any) => r && typeof r.name === 'string' && typeof r.score === 'number');

type ImportPayload = {
  favorites: FavoritePlayer[];
  history: GameHistoryItem[];
};

/** Lève une erreur si le texte collé n'a pas la forme attendue d'un export ScorUp. */
export const parseExportPayload = (raw: string): ImportPayload => {
  let data: any;
  try {
    data = JSON.parse(raw);
  } catch {
    throw new Error('invalid_json');
  }

  const favorites = Array.isArray(data?.favorites) ? data.favorites : [];
  const history = Array.isArray(data?.history) ? data.history : [];

  if (!favorites.every(isFavoritePlayer) || !history.every(isGameHistoryItem)) {
    throw new Error('invalid_shape');
  }

  return { favorites, history };
};

export const importAllData = async (raw: string, mode: ImportMode): Promise<ImportResult> => {
  const payload = parseExportPayload(raw);

  if (mode === 'replace') {
    await saveFavorites(payload.favorites);
    await setHistory(payload.history);
    return { addedFavorites: payload.favorites.length, addedGames: payload.history.length };
  }

  const existingFavorites = await loadFavorites();
  const favoritesByName = new Map(existingFavorites.map((p) => [p.name, p] as const));
  let addedFavorites = 0;
  for (const p of payload.favorites) {
    if (!favoritesByName.has(p.name)) {
      favoritesByName.set(p.name, p);
      addedFavorites++;
    }
  }

  const existingHistory = await getHistory();
  const existingIds = new Set(existingHistory.map((g) => g.id));
  const newGames = payload.history.filter((g) => !existingIds.has(g.id));
  const mergedHistory = [...newGames, ...existingHistory].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  await saveFavorites(Array.from(favoritesByName.values()));
  await setHistory(mergedHistory);

  return { addedFavorites, addedGames: newGames.length };
};
