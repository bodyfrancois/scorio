import type { ComponentType } from 'react';

import IconCoin from '../components/icons/IconCoin';
import IconTimer from '../components/icons/IconTimer';
import IconWheel from '../components/icons/IconWheel';
import IconBuzzer from '../components/icons/IconBuzzer';
import type { TranslationKeys } from '../i18n';
import type { RootStackParamList } from '../types/navigations';

/**
 * Mini-jeux : outils rapides sans joueurs, sans score et sans règles.
 * Ils n'ont donc rien à faire dans le registre des jeux (`GameConfig`), qui
 * suppose partie, manches et feuille de score. Ils vivent ici et s'affichent
 * dans une rangée horizontale sous le titre « Liste de jeux » de l'accueil.
 *
 * Ajouter un mini-jeu = créer son écran, l'enregistrer dans le Stack de
 * `App.tsx`, puis ajouter une ligne à `MINI_GAMES`. La rangée scrolle,
 * il n'y a pas de limite de nombre.
 */
export interface MiniGame {
  id: string;
  /** Écran du Stack vers lequel la pastille navigue. */
  route: keyof RootStackParamList;
  /** Clé i18n du nom, utilisée comme label lecteur d'écran. */
  labelKey: TranslationKeys;
  Icon: ComponentType<{ size?: number }>;
  /** Hauteur de l'icône dans la pastille. Chaque tracé a son propre équilibre. */
  iconSize: number;
  /**
   * Mis à `false` pour un mini-jeu déclaré mais pas encore prêt à être montré.
   * L'écran reste enregistré dans le Stack : il suffit de repasser à `true`
   * pour le faire réapparaître sur l'accueil, sans autre modification.
   */
  enabled?: boolean;
}

export const MINI_GAMES: MiniGame[] = [
  {
    id: 'coinToss',
    route: 'CoinToss',
    labelKey: 'coinToss',
    Icon: IconCoin,
    iconSize: 40,
  },
  {
    id: 'timer',
    route: 'Timer',
    labelKey: 'timerTitle',
    Icon: IconTimer,
    iconSize: 32,
  },
  {
    id: 'wheel',
    route: 'Wheel',
    labelKey: 'wheelTitle',
    Icon: IconWheel,
    iconSize: 36,
    enabled: false, // pas encore terminé
  },
  {
    id: 'buzzer',
    route: 'Buzzer',
    labelKey: 'buzzerTitle',
    Icon: IconBuzzer,
    iconSize: 36,
    enabled: false, // pas encore terminé
  },
];

/** Mini-jeux réellement affichés sur l'accueil. */
export const VISIBLE_MINI_GAMES = MINI_GAMES.filter((game) => game.enabled !== false);
