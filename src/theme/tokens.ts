/**
 * Design tokens — source de vérité pour toutes les constantes visuelles.
 *
 * Import avec alias courts pour éviter la collision avec les propriétés RN :
 *   import { fontSize as FS, fontWeight as FW, radius as R, spacing as S, letterSpacing as LS, lineHeight as LH } from './tokens';
 */

// ─── Tailles de police ────────────────────────────────────────────────────────
export const fontSize = {
  xs: 12,      // labels uppercase décoratifs (section labels)
  sm: 14,      // petit corps : métadonnées, captions, infos secondaires
  base: 16,    // corps par défaut : noms, labels, inputs
  lg: 20,      // sous-titres : sheet titles, section headings
  xl: 24,      // titres : end game, pavé numérique
  '2xl': 28,   // grands chiffres : scores en vedette
  '3xl': 32,   // titres de page : player detail header
  display: 40, // affichage score / pavé numérique
} as const;

// ─── Graisse de police ────────────────────────────────────────────────────────
export const fontWeight = {
  regular:   '400' as const,
  medium:    '500' as const,
  semibold:  '600' as const,
  bold:      '700' as const,
  extrabold: '800' as const,
};

// ─── Rayons de bordure ────────────────────────────────────────────────────────
export const radius = {
  xs:    4,
  sm:    8,
  md:    12,
  lg:    16,
  xl:    20,
  '2xl': 24,
  full:  100,
} as const;

// ─── Espacements (padding, margin, gap) ──────────────────────────────────────
export const spacing = {
  xs:    4,
  sm:    8,
  md:    12,
  card:  14,  // padding interne standard des cartes/lignes
  base:  16,
  lg:    20,
  xl:    24,
  '2xl': 28,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
} as const;

// ─── Espacement des lettres ───────────────────────────────────────────────────
export const letterSpacing = {
  tight:   -1,
  none:     0,
  wide:     0.3,
  wider:    0.5,
  widest:   0.8,
  label:    1,
} as const;

// ─── Hauteur de ligne ─────────────────────────────────────────────────────────
export const lineHeight = {
  tight:   18,
  normal:  20,
  relaxed: 22,
} as const;
