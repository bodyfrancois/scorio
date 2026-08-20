import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import Constants from 'expo-constants';
import { getHistory } from './historyStorage';
import { loadFavorites } from './favoritePlayers';

export const buildExportPayload = async () => {
  const [history, favorites] = await Promise.all([getHistory(), loadFavorites()]);
  return {
    app: 'ScorUp',
    exportedAt: new Date().toISOString(),
    appVersion: Constants.expoConfig?.version ?? '1.0.0',
    favorites,
    history,
  };
};

/**
 * Les statistiques ne sont pas stockées séparément : elles sont recalculées
 * à la volée depuis l'historique (voir StatsScreen). L'export de l'historique
 * suffit donc à tout reconstruire.
 */
export const exportAllData = async (dialogTitle: string) => {
  const payload = await buildExportPayload();
  const json = JSON.stringify(payload, null, 2);

  const dateStamp = new Date().toISOString().slice(0, 10);
  const file = new File(Paths.cache, `scorup-export-${dateStamp}.json`);
  if (file.exists) file.delete();
  file.create();
  file.write(json);

  const canShare = await Sharing.isAvailableAsync();
  if (!canShare) throw new Error('sharing_unavailable');

  await Sharing.shareAsync(file.uri, {
    mimeType: 'application/json',
    UTI: 'public.json',
    dialogTitle,
  });
};
