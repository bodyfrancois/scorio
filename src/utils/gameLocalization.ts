import { Language } from '../theme/ThemeContext';
import { GameConfig } from '../core/types';

/**
 * Résout les champs affichables d'un GameConfig selon la langue active.
 * `config.name` reste l'identifiant technique (clé de moteur, historique, stats) : inchangé.
 */
export function localizeGameConfig(config: GameConfig, language: Language) {
  const tr = config.translations?.[language];
  return {
    displayName: tr?.name ?? config.name,
    description: tr?.description ?? config.description,
    detailedRules: tr?.detailedRules ?? config.detailedRules,
    cardSubtitle: tr?.cardSubtitle ?? config.cardSubtitle,
  };
}
