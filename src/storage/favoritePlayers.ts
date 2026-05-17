import AsyncStorage from '@react-native-async-storage/async-storage';
import { AVATAR_PALETTE_KEYS } from '../utils/avatarColors';

export type FavoritePlayer = {
  name: string;
  colorKey: string;
};

const KEY = 'SCORIO_FAVORITES';

export const loadFavorites = async (): Promise<FavoritePlayer[]> => {
  try {
    const data = await AsyncStorage.getItem(KEY);
    if (!data) return [];
    const raw = JSON.parse(data);
    // backward compat: migrate from string[] to FavoritePlayer[]
    if (Array.isArray(raw) && raw.length > 0 && typeof raw[0] === 'string') {
      const migrated = (raw as string[]).map((name, i) => ({
        name,
        colorKey: AVATAR_PALETTE_KEYS[i % AVATAR_PALETTE_KEYS.length] as string,
      }));
      await AsyncStorage.setItem(KEY, JSON.stringify(migrated));
      return migrated;
    }
    return raw as FavoritePlayer[];
  } catch {
    return [];
  }
};

export const saveFavorites = async (players: FavoritePlayer[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(players));
  } catch (e) {
    console.error('Erreur sauvegarde favoris', e);
  }
};

export const addFavorite = async (name: string, colorKey: string): Promise<FavoritePlayer[]> => {
  const current = await loadFavorites();
  const trimmed = name.trim();
  if (!trimmed || current.some((p) => p.name === trimmed)) return current;
  const updated = [...current, { name: trimmed, colorKey }];
  await saveFavorites(updated);
  return updated;
};

export const removeFavorite = async (name: string): Promise<FavoritePlayer[]> => {
  const current = await loadFavorites();
  const updated = current.filter((p) => p.name !== name);
  await saveFavorites(updated);
  return updated;
};

export const updateFavorite = async (
  oldName: string,
  newName: string,
  colorKey: string,
): Promise<FavoritePlayer[]> => {
  const current = await loadFavorites();
  const trimmed = newName.trim();
  if (!trimmed) return current;
  const updated = current.map((p) =>
    p.name === oldName ? { name: trimmed, colorKey } : p,
  );
  await saveFavorites(updated);
  return updated;
};
