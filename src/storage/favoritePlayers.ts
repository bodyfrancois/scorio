import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'SCORIO_FAVORITES';

export const loadFavorites = async (): Promise<string[]> => {
  try {
    const data = await AsyncStorage.getItem(KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveFavorites = async (names: string[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(names));
  } catch (e) {
    console.error('Erreur sauvegarde favoris', e);
  }
};

export const addFavorite = async (name: string): Promise<string[]> => {
  const current = await loadFavorites();
  const trimmed = name.trim();
  if (!trimmed || current.includes(trimmed)) return current;
  const updated = [...current, trimmed];
  await saveFavorites(updated);
  return updated;
};

export const removeFavorite = async (name: string): Promise<string[]> => {
  const current = await loadFavorites();
  const updated = current.filter((n) => n !== name);
  await saveFavorites(updated);
  return updated;
};

export const updateFavorite = async (oldName: string, newName: string): Promise<string[]> => {
  const current = await loadFavorites();
  const trimmed = newName.trim();
  if (!trimmed) return current;
  const updated = current.map((n) => (n === oldName ? trimmed : n));
  await saveFavorites(updated);
  return updated;
};
