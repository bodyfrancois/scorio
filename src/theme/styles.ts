import { StyleSheet } from 'react-native';
import { lightColors } from './colors';
import {
  fontSize as FS,
  fontWeight as FW,
  radius as R,
  spacing as S,
  letterSpacing as LS,
  lineHeight as LH,
} from './tokens';

/**
 * Source unique de vérité pour tous les styles partagés.
 *
 * Usage dans chaque écran / composant :
 *   const makeStyles = (c: typeof lightColors) => ({
 *     ...makeSharedStyles(c),
 *     ...StyleSheet.create({ /* styles locaux spécifiques *\/ }),
 *   });
 *   const styles = useMemo(() => makeStyles(colors), [colors]);
 *
 * Règle : aucun fichier ne doit recréer un style déjà présent ici.
 * Les styles locaux ne doivent exister que pour des besoins vraiment spécifiques.
 */
export const makeSharedStyles = (c: typeof lightColors) =>
  StyleSheet.create({

    // ─── Layout de base ───────────────────────────────────────────────────
    container: {
      flex: 1,
      backgroundColor: c.background,
    },
    scrollContent: {
      paddingHorizontal: S.lg,
      paddingTop: S.lg,
      paddingBottom: S['5xl'],
    },

    // ─── Section labels & headers ─────────────────────────────────────────
    /** Label de section : petite majuscule, espacée, secondaire */
    sectionLabel: {
      fontSize: FS.xs,
      fontWeight: FW.bold,
      color: c.textMuted,
      letterSpacing: LS.label,
      textTransform: 'uppercase',
      marginBottom: S.md,
    },
    /** Label uppercase primary (modales, sheets) */
    labelPrimary: {
      fontSize: FS.xs,
      fontWeight: FW.bold,
      color: c.primary,
      textTransform: 'uppercase',
      letterSpacing: LS.label,
    },
    /** En-tête de section avec action inline (ex : "Joueurs" + bouton Ajouter) */
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: S.md,
    },

    // ─── Cartes ───────────────────────────────────────────────────────────

    /** Carte liste (flex row) : 24px coins, 2px bordure subtile, ombre légère */
    card: {
      /*flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: c.card,
      borderRadius: R['2xl'],
      padding: S.card,*/
      backgroundColor: c.card,
      borderRadius: R.lg,
      padding: S.base,
      marginBottom: S['3xl'],
      shadowColor: c.shadowCard,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.05,
      shadowRadius: 0,
      elevation: 2,
      borderWidth: 1,
      borderColor: c.borderSubtle,
    },

    /**
     * Carte ligne joueur/param (flex row) : py12 px14, gap 12, 1px bordure.
     * Utilisé pour les lignes de joueurs (PlayersScreen, NewGameScreen).
     */
    cardRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: S.md,
      marginBottom: S.base,
    },

    /** Carte petite : 16px coins, padding 16, 2px bordure (historique)
    cardSm: {
      flexDirection: 'row',
      backgroundColor: c.card,
      borderRadius: R.lg,
      padding: S.base,
      marginBottom: S.base,
      shadowColor: c.shadowCard,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.05,
      shadowRadius: 0,
      elevation: 2,
      borderWidth: 1,
      borderColor: c.borderSubtle,
    },*/

    /** Carte medium : 20px coins, padding 16, 1px bordure (stats, détail joueur)
    cardMd: {
      backgroundColor: c.card,
      borderRadius: R.xl,
      padding: S.base,
      marginBottom: S.base,
      borderWidth: 1,
      borderColor: c.borderSubtle,
      shadowColor: c.shadowCard,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.05,
      shadowRadius: 0,
      elevation: 2,
    },**/

    /** Carte liste paramètres : 24px coins, 8px padding intérieur pour rows */
    cardList: {
      backgroundColor: c.card,
      borderRadius: R.lg,
      padding: S.base,
      marginBottom: S.base,
      shadowColor: c.shadowCard,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.05,
      shadowRadius: 0,
      elevation: 2,
      borderWidth: 1,
      borderColor: c.borderSubtle,
    },

    // ─── Modales & Sheets ─────────────────────────────────────────────────

    /** Overlay pour bottom sheet (contenu aligné en bas) */
    overlay: {
      flex: 1,
      backgroundColor: c.overlay,
      justifyContent: 'flex-end',
    },
    /** Overlay pour modale centrée */
    overlayCenter: {
      flex: 1,
      backgroundColor: c.overlay,
      justifyContent: 'center',
      paddingHorizontal: S.xl,
    },
    /** Contenu d'un bottom sheet */
    sheet: {
      backgroundColor: c.card,
      borderTopLeftRadius: R['2xl'],
      borderTopRightRadius: R['2xl'],
      paddingHorizontal: S.xl,
      paddingTop: S['2xl'],
      paddingBottom: S['4xl'],
    },
    /** Carte centrée pour modales de confirmation */
    modalCard: {
      backgroundColor: c.card,
      borderRadius: R.xl,
      paddingHorizontal: S.xl,
      paddingTop: S.xl,
      paddingBottom: S.lg,
    },
    /** Poignée de drag en haut d'un sheet */
    sheetHandle: {
      width: 36,
      height: 4,
      borderRadius: 2,
      backgroundColor: c.border,
      alignSelf: 'center',
      marginBottom: S.base,
    },
    /** Titre de section dans un sheet (filtre, etc.) */
    sheetSectionTitle: {
      fontSize: FS.xs,
      fontWeight: FW.bold,
      color: c.textMuted,
      textTransform: 'uppercase',
      letterSpacing: LS.widest,
      marginBottom: 10,
      marginTop: S.base,
    },
    /** Rangée date (mois + année) dans un sheet de filtre */
    sheetDateRow: {
      flexDirection: 'row',
      gap: S.md,
    },
    sheetDateCol: {
      flex: 1,
    },
    /** Boutons d'action en bas d'un sheet de filtre */
    sheetActions: {
      flexDirection: 'row',
      gap: S.md,
      marginTop: S['4xl'],
    },

    // ─── Boutons ──────────────────────────────────────────────────────────

    /** Base flex pour boutons côte à côte */
    btn: {
      flex: 1,
      paddingVertical: S.base,
      borderRadius: R.lg,
      alignItems: 'center',
    },
    /** Conteneur de deux boutons côte à côte */
    buttons: {
      flexDirection: 'row',
      gap: S.md,
    },
    btnPrimary: {
      backgroundColor: c.primary,
      shadowColor: c.shadowPrimary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 10,
      borderRadius: R.lg,
      paddingHorizontal: S.base,
      paddingVertical: S.base,
    },
    btnPrimaryBig: {
      paddingHorizontal: S.lg,
      paddingVertical: S.lg,
      shadowOffset: { width: 0, height: 8 },
    },
    btnPrimaryText: {
      fontSize: FS.base,
      fontWeight: FW.bold,
      color: c.white,
    },
    btnPrimaryTextSmall: {
      fontSize: FS.sm,
      fontWeight: FW.bold,
      color: c.white,
    },
    /*btnPrimaryTextSmallSecondary: {
      backgroundColor: c.secondary,
      shadowColor: c.shadowSecondary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 10,
      borderRadius: R.lg,
      paddingHorizontal: S.base,
      paddingVertical: S.base,
      fontSize: FS.sm,
      fontWeight: FW.bold,
      color: c.secondaryText,
    },*/
    btnSecondary: {
      backgroundColor: c.searchBackground,
      shadowColor: c.shadowCard,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 0,
    },
    btnSecondaryText: {
      fontSize: FS.base,
      fontWeight: FW.semibold,
      color: c.text,
    },
    /** Bouton destructif (rouge) */
    btnDanger: {
      backgroundColor: c.errorSubtle,
      borderRadius: R.lg,
      paddingVertical: S.base,
      alignItems: 'center',
    },
    btnDangerText: {
      color: c.danger,
      fontSize: FS.base,
      fontWeight: FW.bold,
    },
    btnDisabled: {
      opacity: 0.3,
      shadowColor: '#410872',
      shadowOffset: { width: 0, height: 4 },
    },

    // ─── États de pression ────────────────────────────────────────────────
    pressed: {
      opacity: 0.82,
      transform: [{ scale: 0.97 }],
    },
    cardPressed: {
      opacity: 0.92,
      transform: [{ scale: 0.985 }],
    },
    keyPressed: {
      opacity: 0.7,
      transform: [{ scale: 0.91 }],
    },

    // ─── Boîtes d'icônes ─────────────────────────────────────────────────

    /** Boîte icône standard : 34×34, fond neutre (paramètres, params de jeu) */
    iconBoxSm: {
      width: 34,
      height: 34,
      borderRadius: R.sm,
      backgroundColor: c.iconBackground,
      alignItems: 'center',
      justifyContent: 'center',
    },
    /** Boîte icône primary-subtle : 34×34 (stats, détail joueur) */
    iconBoxPrimary: {
      width: 34,
      height: 34,
      borderRadius: R.sm,
      backgroundColor: c.primarySubtle,
      alignItems: 'center',
      justifyContent: 'center',
    },
    /** Boîte icône marque (logo, drawer header) : fond primary */
    iconBoxBrand: {
      width: 34,
      height: 34,
      borderRadius: R.sm,
      backgroundColor: c.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    /** Grande boîte icône pour états vides : 80×80 */
    iconBoxLg: {
      width: 80,
      height: 80,
      borderRadius: R['2xl'],
      backgroundColor: c.primarySubtle,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: S.lg,
    },

    // ─── Lignes liste (paramètres) ────────────────────────────────────────

    /** Ligne cliquable dans une cardList */
    listRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    /** Icône dans une listRow (avec margin droite) */
    listRowDivider: {
      height: 1,
      marginTop: S.md,
      marginBottom: S.md,
      backgroundColor: c.border,
    },

    // ─── Lignes info/stats (stats, détail joueur) ─────────────────────────

    /** Ligne d'information : icône + label flex + valeur */
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: S.md,
      paddingVertical: 10,
    },
    infoRowDivider: {
      height: 1,
      backgroundColor: c.borderSubtle,
    },
    // ─── État vide ────────────────────────────────────────────────────────

    emptyWrap: {
      alignItems: 'center',
      paddingTop: S['5xl'],
      paddingHorizontal: S['3xl'],
    },

    // ─── Dropdown ────────────────────────────────────────────────────────

    ddInput: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: c.inputBackground,
      borderRadius: R.md,
      borderWidth: 1,
      borderColor: c.border,
      paddingHorizontal: S.card,
      paddingVertical: S.md,
    },
    ddInputOpen: {
      borderColor: c.primary,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
    },
    ddPlaceholder: {
      fontSize: FS.sm,
      color: c.textMuted,
      flex: 1,
    },
    ddValueRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: S.sm,
      flex: 1,
    },
    ddValueText: {
      fontSize: FS.sm,
      color: c.text,
      fontWeight: FW.medium,
      flex: 1,
    },
    ddLogoSmall: {
      width: 24,
      height: 24,
      borderRadius: 6,
    },
    ddList: {
      backgroundColor: c.card,
      borderWidth: 1,
      borderTopWidth: 0,
      borderColor: c.primary,
      borderBottomLeftRadius: R.md,
      borderBottomRightRadius: R.md,
      overflow: 'hidden',
      maxHeight: 220,
    },
    ddOption: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: S.card,
      paddingVertical: S.md,
      borderTopWidth: 1,
      borderTopColor: c.border,
    },
    ddOptionActive: {
      backgroundColor: c.primarySubtle,
    },
    ddOptionText: {
      fontSize: FS.sm,
      color: c.text,
    },
    ddOptionTextActive: {
      color: c.primary,
      fontWeight: FW.semibold,
    },

    // ─── Bouton d'en-tête navigateur ─────────────────────────────────────

    /** Bouton rond translucide dans le header de navigation */
    hdrBtn: {
      width: 34,
      height: 34,
      borderRadius: R.full,
      backgroundColor: 'rgba(255,255,255,0.15)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    /** Point indicateur sur un hdrBtn (filtre actif, etc.) */
    hdrPoint: {
      position: 'absolute',
      top: 5,
      right: 5,
      width: 7,
      height: 7,
      borderRadius: 4,
      backgroundColor: '#fff',
    },

    // ─── Bouton d'action inline (en-tête de section) ──────────────────────

    // ─── Avatar ───────────────────────────────────────────────────────────

    /** Avatar standard 40×40 (PlayersScreen) */
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    /** Initiales dans un avatar (texte) */
    avatarText: {
      fontSize: FS.sm,
      fontWeight: FW.bold,
      color: c.white,
    },

    // ─── Titres & textes communs ──────────────────────────────────────────

    /** Titre de page (grand heading) */
    pageTitle: {
      fontSize: FS['3xl'],
      fontWeight: FW.extrabold,
      color: c.text,
      marginBottom: S.base,
    },
    /** Champ texte dans une modale */
    modalInput: {
      backgroundColor: c.background,
      borderRadius: R.lg,
      paddingHorizontal: S.base,
      paddingVertical: S.card,
      fontSize: FS.base,
      color: c.text,
      marginBottom: S.base,
      borderWidth: 1,
      borderColor: c.border,
    },
    modalInputFocused: {
      borderColor: c.primary,
    },

    // ─── Échelle typographique (design system) ────────────────────────────────
    /** Titre fort 22px — modales, fin de partie */
    heading: { fontSize: FS.xl, fontWeight: FW.extrabold, color: c.text },
    /** Sous-titre 20px — sheets, cartes sections, états vides */
    subheading: { fontSize: FS.lg, fontWeight: FW.bold, color: c.text },
    /** Titre d'item 18px bold — noms de jeux, joueurs en vedette */
    itemTitle: { fontSize: FS.base, fontWeight: FW.bold, color: c.text },
    /** Corps de texte 18px regular */
    body: { fontSize: FS.base, color: c.text },
    /** Corps medium 18px — labels nav, formulaires */
    bodyMedium: { fontSize: FS.base, fontWeight: FW.medium, color: c.text },
    /** Corps secondaire 18px — sous-titres de modales */
    bodySecondary: { fontSize: FS.base, color: c.textSecondary },
    /** Légende 16px — dates, descriptions courtes */
    caption: { fontSize: FS.sm, color: c.textSecondary },
    /** Texte atténué 16px */
    muted: { fontSize: FS.sm, color: c.textMuted },
    /** Micro 14px — badges, unités */
    micro: { fontSize: FS.xs, color: c.textMuted },

    // ─── Affichage numérique (pavé / saisie score) ────────────────────────

    /** Grande valeur numérique affichée (40px) */
    displayValue: {
      fontSize: FS.display,
      fontWeight: FW.extrabold,
      color: c.text,
      letterSpacing: LS.tight,
    },
    /** Placeholder sur la valeur numérique (couleur atténuée) */
    displayPlaceholder: {
      color: c.textMuted,
    },
    /** Conteneur du pavé numérique en modale */
    keypadModal: {
      gap: S.sm,
      marginBottom: S.lg,
    },

    // ─── Bouton d'action inline (en-tête de section) ──────────────────────

    /** Bouton texte-icône inline (Ajouter joueur, Ajouter favori…) */
    addBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: S.xs,
    },
    addBtnText: {
      color: c.primary,
      fontSize: FS.sm,
      fontWeight: FW.semibold,
    },

    // ─── Clavier numérique ────────────────────────────────────────────────

    keypad: {
      gap: S.sm,
      marginBottom: S.base,
    },
    keyRow: {
      flexDirection: 'row',
      gap: S.sm,
    },
    /** Touche standard (fond page, coins 16px) — utilisé en écran plein */
    key: {
      flex: 1,
      height: 56,
      backgroundColor: c.background,
      borderRadius: R.lg,
      alignItems: 'center',
      justifyContent: 'center',
    },
    /** Touche modale (fond carte + bordure subtile + ombre) */
    keyCard: {
      flex: 1,
      height: 56,
      backgroundColor: c.card,
      borderRadius: R.lg,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: c.borderSubtle,
      shadowColor: c.shadowCard,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.05,
      shadowRadius: 0,
    },
    keyEmpty: {
      flex: 1,
    },
    keyText: {
      fontSize: FS.xl,
      fontWeight: FW.medium,
      color: c.text,
    },

      // ───  ────────────────────────────────────────────────

    footer: {
      marginTop: S['4xl'],
      alignItems: 'center' as const,
      gap: S.sm,
    },
    footerLogo: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      gap: 6,
      marginBottom: S.xs,
    },
    footerLogoIcon: {
      width: 26,
      height: 26,
      borderRadius: 6,
      backgroundColor: c.primaryLight,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    },
    footerLogoLetter: {
      color: c.card,
      fontWeight: FW.extrabold,
      fontSize: FS.sm,
    },
    footerLogoText: {
      fontSize: FS.base,
      fontWeight: FW.bold,
      color: c.textMuted,
    },
    footerTagline: {
      fontSize: FS.sm,
      color: c.textMuted,
      textAlign: 'center' as const,
      lineHeight: LH.tight,
    },
    footerLink: {
      fontSize: FS.sm,
      color: c.textMuted,
      textDecorationLine: 'underline' as const,
    },
  });

// ─── Per-screen / per-component style factories ──────────────────────────────

export const makeAboutStyles = (c: typeof lightColors) => ({
  ...makeSharedStyles(c),
  ...StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: c.background,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      paddingHorizontal: S['3xl'],
    },
    iconBox: {
      width: 72,
      height: 72,
      borderRadius: R.xl,
      backgroundColor: c.primary,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      marginBottom: S.base,
    },
    iconLetter: {
      color: c.white,
      fontWeight: FW.extrabold,
      fontSize: 38,
    },
    appName: {
      fontSize: 28,
      fontWeight: FW.extrabold,
      color: c.text,
    },
    divider: {
      width: 40,
      height: 2,
      backgroundColor: c.border,
      borderRadius: 2,
      marginVertical: S.xl,
    },
  }),
});

export const makeHomeStyles = (c: typeof lightColors) => ({
  ...makeSharedStyles(c),
  ...StyleSheet.create({
    searchWrapper: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      backgroundColor: c.searchBackground,
      borderRadius: R.lg,
      paddingHorizontal: S.md,
      paddingVertical: 10,
      gap: S.sm,
      marginBottom: S['2xl'],
      height: 50,
    },
    searchInput: {
      flex: 1,
      fontSize: FS.base,
      color: c.text,
      padding: 0,
    },
    cardPressed: {
      opacity: 0.85,
    },
    gameImage: {
      width: 72,
      height: 72,
      borderRadius: R.md,
      borderWidth: 1,
      borderColor: c.border,
    },
    cardContent: {
      flex: 1,
    },
    gameInfoRow: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      gap: S.xs,
    },
  }),
});

export const makeNewGameStyles = (c: typeof lightColors) => ({
  ...makeSharedStyles(c),
  ...StyleSheet.create({
    sectionLabelTop: {
      marginTop: S['2xl'],
    },
    sectionLabelNoMargin: {
      marginBottom: 0,
    },
    teamSection: {
      marginTop: S.base,
      backgroundColor: c.card,
      borderRadius: R.lg,
      borderTopWidth: 3,
      paddingHorizontal: S.card,
      paddingTop: S.card,
      paddingBottom: S.card,
      shadowColor: c.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
      gap: S.md,
    },
    teamHeader: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      gap: S.sm,
    },
    teamColorDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
    },
    teamNameInput: {
      flex: 1,
      fontSize: FS.base,
      fontWeight: FW.bold,
      color: c.text,
      padding: 0,
    },
    playerList: {
      gap: S.sm,
    },
    teamPlayerCard: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      backgroundColor: c.background,
      borderRadius: R.lg,
      paddingVertical: 10,
      paddingHorizontal: S.md,
      gap: S.md,
      borderWidth: 1,
      borderColor: 'transparent',
    },
    playerCardFocused: {
      borderColor: c.borderActive,
      shadowColor: '#94A3B8',
      shadowOpacity: 1,
    },
    playerCardDuplicate: {
      borderColor: c.danger,
    },
    avatar: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    },
    playerInput: {
      flex: 1,
      fontSize: FS.base,
      color: c.text,
      padding: 0,
    },
    /*paramCard: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      backgroundColor: c.card,
      borderRadius: R['2xl'],
      paddingVertical: S.card,
      paddingHorizontal: S.base,
      gap: S.md,
      borderWidth: 1,
      borderColor: c.borderSubtle,
      shadowColor: c.shadowCard,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.05,
      shadowRadius: 0,
      elevation: 2,
    },*/
    stepper: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      gap: S.sm,
    },
    stepBtn: {
      width: 28,
      height: 28,
      borderRadius: R.sm,
      backgroundColor: c.searchBackground,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    },
    startButtonLayout: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      marginTop: S['2xl'],
      gap: 6,
    },
    startButtonDisabled: {
      opacity: 0.4,
    },

    rulesCardHeader: {
      flexDirection: 'row' as const,
      gap: S.card,
      marginBottom: S.md,
    },
    rulesImage: {
      width: 72,
      height: 72,
      borderRadius: R.md,
    },
    rulesCardMeta: {
      flex: 1,
      justifyContent: 'center' as const,
    },
    rulesInfoRow: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      gap: S.xs,
    },
    expandButton: {
      marginTop: S.md,
      paddingTop: S.md,
      flexDirection: 'row' as const,
      justifyContent: 'space-between' as const,
      alignItems: 'center' as const,
      borderTopWidth: 1,
      borderTopColor: c.border,
    },
    favItem: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      gap: S.md,
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: c.borderSubtle,
    },
    favItemLast: {
      borderBottomWidth: 0,
    },
    favAvatar: {
      width: 38,
      height: 38,
      borderRadius: 19,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    },
  }),
});

export const makePlayersStyles = (c: typeof lightColors) => ({
  ...makeSharedStyles(c),
  ...StyleSheet.create({
    rowActions: {
      flexDirection: 'row' as const,
      gap: S.xs,
    },
    iconBtn: {
      width: 36,
      height: 36,
      borderRadius: R.md,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      backgroundColor: c.background,
    },
  }),
});

export const makeScoreboardStyles = (c: typeof lightColors, ROUND_COL: number, PLAYER_COL: number, HEADER_H: number, ROW_H: number) => ({
  ...makeSharedStyles(c),
  ...StyleSheet.create({
    tableCard: {
      overflow: 'hidden' as const,
      backgroundColor: c.card,
      shadowColor: c.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 3,
    },
    leftCol: {
      zIndex: 2,
      backgroundColor: c.card,
      shadowColor: c.shadow,
      shadowOffset: { width: 4, height: 0 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 4,
    },
    cornerCell: {
      width: ROUND_COL,
      height: HEADER_H,
      backgroundColor: c.card,
    },
    roundCell: {
      width: ROUND_COL,
      height: ROW_H,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      borderTopWidth: 1,
      borderTopColor: c.border,
    },
    playerHeaderCol: {
      width: PLAYER_COL,
      height: HEADER_H,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      gap: S.xs,
      paddingVertical: S.card,
      borderLeftWidth: 1,
      borderLeftColor: c.card,
      backgroundColor: c.card,
    },
    avatar: {
      width: 32,
      height: 32,
      borderRadius: 22,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    },
    playerName: {
      flexDirection: 'row' as const,
      fontSize: FS.sm,
      fontWeight: FW.bold,
      color: c.textSecondary,
      maxWidth: PLAYER_COL - 8,
      textAlign: 'center' as const,
    },
    totalScore: {
      fontSize: FS.lg,
      fontWeight: FW.extrabold,
      letterSpacing: LS.tight,
    },
    scoreCell: {
      width: PLAYER_COL,
      height: ROW_H,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      borderTopWidth: 1,
      borderTopColor: c.border,
      borderLeftWidth: 1,
      borderLeftColor: c.border,
    },
    scoreEmpty: {
      color: c.textMuted,
    },
    addRoundBtn: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      gap: 6,
      marginTop: S['2xl'],
      paddingVertical: S.sm,
    },
    endSection: {
      paddingVertical: S.base,
      paddingHorizontal: S.lg,
      gap: 10,
      alignItems: 'center' as const,
    },
    endGameBtn: {
      width: '100%' as const,
      paddingVertical: 16,
      borderRadius: R.lg,
      backgroundColor: c.primary,
      alignItems: 'center' as const,
      shadowColor: c.shadowPrimary,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 10,
      marginBottom: S.xl,
    },
    rulesSheet: {
      backgroundColor: c.card,
      borderTopLeftRadius: R.xl,
      borderTopRightRadius: R.xl,
      paddingHorizontal: S.lg,
      paddingTop: S.lg,
      paddingBottom: S['4xl'],
      maxHeight: '70%' as const,
    },
    rulesSheetHeader: {
      flexDirection: 'row' as const,
      justifyContent: 'space-between' as const,
      alignItems: 'center' as const,
      marginBottom: S.base,
    },
  }),
});

export const makeStatsStyles = (c: typeof lightColors) => ({
  ...makeSharedStyles(c),
  ...StyleSheet.create({
    donutWrap: {
      marginBottom: S.xl,
    },
    playerCard: {
      marginBottom: 10,
      overflow: 'hidden' as const,
      borderColor: c.borderSubtle,
      borderBottomWidth: 1,
    },
    playerCardMain: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      paddingBottom: S.xl,
      gap: 10,
    },
    rankBadge: {
      width: 34, height: 34, borderRadius: 10,
      alignItems: 'center' as const, justifyContent: 'center' as const,
    },
    rankText: { fontSize: FS.sm, fontWeight: FW.extrabold },
    playerNameBlock: { flex: 1 },
    streakBadge: {
      flexDirection: 'row' as const, alignItems: 'center' as const, gap: 3,
      paddingHorizontal: S.sm, paddingVertical: S.xs, borderRadius: R.md,
      backgroundColor: c.goldSubtle,
    },
    streakText: { fontSize: FS.sm, fontWeight: FW.bold, color: c.goldText },
    gameCard: {
      backgroundColor: c.card,
      borderRadius: R.xl,
      marginBottom: S.md,
      borderWidth: 1,
      borderColor: c.borderSubtle,
      shadowColor: c.shadowCard,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.05,
      shadowRadius: 0,
      elevation: 2,
    },
    gameCardHeader: {
      flexDirection: 'row' as const, alignItems: 'center' as const,
      gap: S.card, padding: S.card, paddingBottom: S.md,
    },
    gameImage: {
      width: 52, height: 52, borderRadius: R.md,
      borderWidth: 1, borderColor: c.border,
    },
    gameImagePlaceholder: {
      width: 52, height: 52, borderRadius: R.md,
      backgroundColor: c.primarySubtle,
      alignItems: 'center' as const, justifyContent: 'center' as const,
    },
    gameHeaderInfo: { flex: 1 },
    gameCountBadge: {
      alignSelf: 'flex-start' as const,
      paddingHorizontal: S.sm, paddingVertical: 3, borderRadius: 10,
      backgroundColor: c.primarySubtle,
    },
    gameCountText: { fontSize: FS.sm, fontWeight: FW.bold, color: c.primary },
    gameDivider: { height: 1, backgroundColor: c.borderSubtle, marginHorizontal: S.card },
    gameHighlights: {
      flexDirection: 'row' as const, padding: S.card, paddingTop: S.md, gap: S.sm,
    },
    highlightCard: {
      flex: 1, backgroundColor: c.background,
      borderRadius: R.lg, padding: 10, alignItems: 'center' as const,
    },
    highlightIcon: {
      width: 28, height: 28, borderRadius: R.sm,
      alignItems: 'center' as const, justifyContent: 'center' as const, marginBottom: 6,
    },
    highlightLabel: {
      fontSize: FS.xs, fontWeight: FW.bold, color: c.textMuted,
      textTransform: 'uppercase' as const, letterSpacing: LS.wider,
      marginBottom: S.xs, textAlign: 'center' as const,
    },
    highlightValue: {
      fontSize: FS.sm, fontWeight: FW.extrabold, color: c.text, textAlign: 'center' as const,
    },
    gameRankingSection: {
      paddingHorizontal: S.card, paddingBottom: S.card,
    },
    gameRankRow: {
      flexDirection: 'row' as const, alignItems: 'center' as const,
      paddingVertical: S.sm,
      borderTopWidth: 1, borderTopColor: c.borderSubtle,
      gap: 10,
    },
    gameRankNum: { fontSize: FS.sm, fontWeight: FW.bold, color: c.textMuted, width: 18, textAlign: 'center' as const },
    gameRankName: { flex: 1, fontSize: FS.sm, fontWeight: FW.medium, color: c.text },
    gameRankBadge: { paddingHorizontal: S.sm, paddingVertical: 3, borderRadius: 10 },
    gameRankBadgeText: { fontSize: FS.xs, fontWeight: FW.bold },
  }),
});

export const makePlayerDetailStyles = (c: typeof lightColors) => ({
  ...makeSharedStyles(c),
  ...StyleSheet.create({
    gameRow: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      paddingHorizontal: S.card,
      paddingVertical: S.md,
      borderTopWidth: 1,
      borderTopColor: c.borderSubtle,
      gap: S.md,
    },
    gameRowFirst: { borderTopWidth: 0 },
    gameLogo: { width: 36, height: 36, borderRadius: 10, borderWidth: 1, borderColor: c.border },
    gameLogoFallback: {
      width: 36, height: 36, borderRadius: 10,
      backgroundColor: c.primarySubtle,
      alignItems: 'center' as const, justifyContent: 'center' as const,
    },
    gameName: { flex: 1, fontSize: FS.sm, fontWeight: FW.semibold, color: c.text },
  }),
});

export const makeHistoryStyles = (c: typeof lightColors) => ({
  ...makeSharedStyles(c),
  ...StyleSheet.create({
    // GameCard sub-component
    logo:         { width: 48, height: 48, borderRadius: R.md, borderWidth: 1, borderColor: c.border },
    logoFallback: { width: 48, height: 48, borderRadius: R.md, backgroundColor: c.primarySubtle, alignItems: 'center' as const, justifyContent: 'center' as const },
    logoLetter:   { fontSize: FS.lg, fontWeight: FW.bold, color: c.primary },
    playerRow:    { flexDirection: 'row' as const, alignItems: 'center' as const, gap: 10, paddingVertical: S.sm, borderTopWidth: 1, borderTopColor: c.borderSubtle },
    playerName:   { flex: 1, fontSize: FS.sm, fontWeight: FW.medium, color: c.text },
    seeMore:      { marginTop: 10, alignItems: 'center' as const },
    btnDangerFull: {
      backgroundColor: c.danger,
      shadowColor: c.danger,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 0,
      elevation: 8,
    },
    // Main HistoryScreen
    list:         { paddingHorizontal: S.base, paddingBottom: S.xl, paddingTop: S.sm },
    emptyCenter:  { flex: 1, alignItems: 'center' as const, justifyContent: 'center' as const, gap: S.sm },
    emptyBodyTxt: { fontSize: FS.sm, color: c.textMuted, textAlign: 'center' as const, paddingHorizontal: S['3xl'] },
  }),
});

export const makeEditScoreModalStyles = (c: typeof lightColors) => ({
  ...makeSharedStyles(c),
  ...StyleSheet.create({
    playerHighlight: {
      fontWeight: FW.bold,
      color: c.text,
    },
    display: {
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      marginBottom: S.sm,
      paddingVertical: S.md,
      backgroundColor: c.background,
      borderRadius: R.lg,
    },
    displayError: {
      backgroundColor: c.errorSubtle,
    },
    remainingRow: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      gap: 5,
      justifyContent: 'center' as const,
      marginBottom: S.md,
    },
    remainingRowError: {},
    remainingTextError: {
      color: c.danger,
      fontWeight: FW.semibold,
    },
    quickActionsSection: {
      marginBottom: S.base,
    },
    quickActionsLabel: {
      fontSize: FS.xs,
      fontWeight: FW.bold,
      color: c.textMuted,
      letterSpacing: LS.label,
      marginBottom: S.sm,
    },
    quickActionsRow: {
      gap: S.sm,
      flexDirection: 'row' as const,
    },
    chip: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      gap: S.xs,
      paddingHorizontal: S.md,
      paddingVertical: S.sm,
      borderRadius: 20,
      backgroundColor: c.background,
      borderWidth: 1,
      borderColor: c.border,
    },
    chipActive: {
      backgroundColor: c.primarySubtle,
      borderColor: c.primary,
    },
    chipLabel: {
      fontSize: FS.sm,
      fontWeight: FW.semibold,
      color: c.textSecondary,
    },
    chipLabelActive: {
      color: c.primary,
    },
    chipValue: {
      fontSize: FS.sm,
      fontWeight: FW.bold,
      color: c.textMuted,
    },
    chipValueActive: {
      color: c.primary,
    },
  }),
});

export const makeScoreLimitModalStyles = (c: typeof lightColors) => ({
  ...makeSharedStyles(c),
  ...StyleSheet.create({
    display: {
      flexDirection: 'row' as const,
      alignItems: 'baseline' as const,
      justifyContent: 'center' as const,
      gap: 6,
      marginBottom: S.base,
      paddingVertical: S.md,
      backgroundColor: c.background,
      borderRadius: R['2xl'],
    },
    displayUnit: {
      fontSize: FS.base,
      fontWeight: FW.semibold,
      color: c.textMuted,
      paddingBottom: S.xs,
    },
  }),
});

export const makeCustomDrawerStyles = (c: typeof lightColors) => ({
  ...makeSharedStyles(c),
  ...StyleSheet.create({
    drawerContainer: {
      flex: 1,
      backgroundColor: c.card,
      paddingTop: 56,
      paddingHorizontal: S.base,
    },
    drawerHeader: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'space-between' as const,
      marginBottom: S.base,
    },
    logoRow: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      gap: 10,
    },
    iconLetter: {
      color: c.white,
      fontWeight: FW.extrabold,
      fontSize: FS.base,
    },
    drawerDivider: {
      height: 1,
      backgroundColor: c.border,
      marginBottom: S.md,
    },
    menu: {
      gap: S.xs,
    },
    item: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      gap: S.card,
      paddingVertical: S.card,
      paddingHorizontal: S.md,
      borderRadius: R.md,
    },
    itemActive: {
      backgroundColor: c.primarySubtle,
    },
    labelActive: {
      color: c.primary,
      fontWeight: FW.semibold,
    },
  }),
});

export const makeEndGameModalStyles = (c: typeof lightColors) => ({
  ...makeSharedStyles(c),
  ...StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: c.overlay,
      justifyContent: 'center' as const,
      paddingHorizontal: S.lg,
    },
    modalCardEnd: {
      backgroundColor: c.card,
      borderRadius: R['2xl'],
      paddingHorizontal: S.lg,
      paddingTop: S['2xl'],
      paddingBottom: S.xl,
    },
    endTitleRow: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      gap: S.sm,
      marginBottom: 6,
    },
    rankingList: {
      gap: S.sm,
      marginBottom: S.xl,
    },
    rankingScroll: {
      maxHeight: 320,
      marginBottom: S.xl,
    },
    rankingScrollContent: {
      gap: S.sm,
    },
    winnerCard: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      borderRadius: R.md,
      paddingHorizontal: S.base,
      paddingVertical: S.card,
      gap: S.card,
      shadowColor: c.shadow,
      shadowOffset: { width: 0, height: 25 },
      shadowOpacity: 0.25,
      shadowRadius: 50,
      elevation: 12,
    },
    winnerIconBox: {
      width: 40,
      height: 40,
      borderRadius: 32,
      backgroundColor: c.gold,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    },
    winnerInfo: {
      flex: 1,
    },
    winnerName: {
      fontSize: FS.lg,
      fontWeight: FW.extrabold,
      color: c.textOnLight,
    },
    winnerLabel: {
      fontSize: FS.xs,
      fontWeight: FW.bold,
      color: c.textOnLight,
      letterSpacing: LS.widest,
      marginTop: 2,
    },
    winnerScoreBox: {
      alignItems: 'flex-end' as const,
    },
    winnerScore: {
      fontSize: FS['2xl'],
      fontWeight: FW.extrabold,
      color: c.textOnLight,
      lineHeight: 28,
      marginBottom: -4,
    },
    winnerUnit: {
      fontSize: FS.sm,
      fontWeight: FW.bold,
      color: c.textOnLight,
      letterSpacing: LS.wider,
    },
    rankRow: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      backgroundColor: c.background,
      borderRadius: R.lg,
      paddingHorizontal: S.card,
      paddingVertical: S.md,
      gap: S.md,
    },
    badge: {
      width: 24,
      height: 24,
      borderRadius: R.md,
      backgroundColor: c.searchBackground,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    },
    badgeText: {
      fontSize: FS.sm,
      fontWeight: FW.medium,
      color: c.textSecondary,
    },
    scoreInfo: {
      alignItems: 'flex-end' as const,
    },
    endScore: {
      fontSize: FS.base,
      fontWeight: FW.semibold,
      color: c.text,
    },
    replayBtnLayout: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      gap: S.sm,
      marginBottom: S.base,
    },
    homeBtnLayout: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      gap: S.sm,
      paddingVertical: S.base,
      borderRadius: R.lg,
    },
  }),
});

export const splashStyles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: S.card,
  },
  iconBox: {
    width: 64,
    height: 64,
    borderRadius: R.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLetter: {
    fontWeight: '800',
    fontSize: 34,
  },
  appName: {
    fontSize: 42,
    fontWeight: '800',
    letterSpacing: -1,
  },
  credit: {
    position: 'absolute',
    bottom: S['5xl'],
    fontSize: 14,
    letterSpacing: LS.wide,
  },
});
