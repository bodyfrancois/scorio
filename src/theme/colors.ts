export const lightColors = {
  // ── Marque ───────────────────────────────────────────────
  primary:             '#7C48CA',
  primaryLight:        '#C4B5E8',
  primarySubtle:       '#F2EDFA',
  winnerGradientStart: '#AD7BF8',   // dégradé carte vainqueur (début)

  // ── Fonds ────────────────────────────────────────────────
  background:          '#F6F6F8',
  card:                '#FFFFFF',
  inputBackground:     '#F9FAFB',
  searchBackground:    '#EBEBF0',
  surfaceAlt:          '#F3F4F6',
  iconBackground:      '#F1F5F9',
  splashBg:            '#B094DA',   // fond écran splash

  // ── Bordures ─────────────────────────────────────────────
  border:              '#E5E7EB',
  borderActive:        '#94A3B8',
  rowAlt:              '#FBFDFD',

  // ── Texte ────────────────────────────────────────────────
  text:                '#1E293B',
  textSecondary:       '#64748B',
  textMuted:           '#64748B',
  white:               '#FFFFFF',   // texte/icône sur fond coloré
  textOnDark:          'rgba(255,255,255,0.7)', // secondaire sur fond sombre
  textOnLight:         '#FFFFFF',

  // ── Icônes & états ───────────────────────────────────────
  iconMuted:           '#D1D5DB',
  iconNavigation:      '#4A2E8A',
  danger:              '#EF4444',
  errorSubtle:         '#FEF2F2',   // fond erreur légère
  overlay:             'rgba(0,0,0,0.4)',
  shadow:              '#000000',

  // ── Or / Récompenses ─────────────────────────────────────
  gold:                '#F59E0B',   // étoiles, couronne, badges
  goldSubtle:          '#FEF3C7',   // fond badge 1ère place
  goldText:            '#D97706',   // texte badge 1ère place

  // ── Avatars (pastels) ────────────────────────────────────
  avatarRose:          '#ffeded',
  avatarPeche:         '#fff1db',
  avatarJaune:         '#FEF3C7',
  avatarVert:          '#D1FAE5',
  avatarCiel:          '#d5f6fd',
  avatarBleu:          '#dde1fe',
  avatarViole:         '#F2EDFA',
  avatarFuchsia:       '#ffd9f3',
};

export const colors = lightColors;

export const darkColors: typeof lightColors = {
  // ── Marque ───────────────────────────────────────────────
  primary:             '#9D6FE8',
  primaryLight:        '#4A2E8A',
  primarySubtle:       '#2D1F4A',
  winnerGradientStart: '#B88AF8',

  // ── Fonds ────────────────────────────────────────────────
  background:          '#0F172A',
  card:                '#1E293B',
  inputBackground:     '#1E293B',
  searchBackground:    '#334155',
  surfaceAlt:          '#1E293B',
  iconBackground:      '#334155',
  splashBg:            '#B094DA',

  // ── Bordures ─────────────────────────────────────────────
  border:              '#334155',
  borderActive:        '#64748B',
  rowAlt:              '#243044',

  // ── Texte ────────────────────────────────────────────────
  text:                '#F1F5F9',
  textSecondary:       '#94A3B8',
  textMuted:           '#64748B',
  white:               '#FFFFFF',
  textOnDark:          'rgba(21, 20, 20, 0.7)',
  textOnLight:         '#0F172A',

  // ── Icônes & états ───────────────────────────────────────
  iconMuted:           '#475569',
  iconNavigation:      '#9D6FE8',
  danger:              '#EF4444',
  errorSubtle:         '#3B1515',
  overlay:             'rgba(0,0,0,0.7)',
  shadow:              '#000000',

  // ── Or / Récompenses ─────────────────────────────────────
  gold:                '#F59E0B',
  goldSubtle:          '#3B2A00',
  goldText:            '#F59E0B',

  // ── Avatars (pastels sombres) ─────────────────────────────
  avatarRose:          '#3D2020',
  avatarPeche:         '#3D2D1A',
  avatarJaune:         '#3D3310',
  avatarVert:          '#1A3D2A',
  avatarCiel:          '#1A3340',
  avatarBleu:          '#1E2550',
  avatarViole:         '#2A1F3D',
  avatarFuchsia:       '#3D1F35',
};

// ── Couleurs d'équipe ────────────────────────────────────
export const TEAM_COLORS = [
  '#7C48CA',  // primary
  '#EF4444',  // danger
  '#3B82F6',  // blue
  '#10B981',  // green
  '#F59E0B',  // gold
  '#EC4899',  // pink
  '#06B6D4',  // cyan
  '#84CC16',  // lime
];
