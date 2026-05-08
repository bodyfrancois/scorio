import { StyleSheet } from 'react-native';
import { lightColors } from './colors';

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
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 48,
    },

    // ─── Section labels & headers ─────────────────────────────────────────
    /** Label de section : petite majuscule, espacée, secondaire */
    sectionLabel: {
      fontSize: 11,
      fontWeight: '700',
      color: c.textMuted,
      letterSpacing: 1,
      marginBottom: 12,
    },
    /** En-tête de section avec action inline (ex : "Joueurs" + bouton Ajouter) */
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },

    // ─── Cartes ───────────────────────────────────────────────────────────

    /** Carte liste (flex row) : 24px coins, 2px bordure subtile, ombre légère */
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: c.card,
      borderRadius: 24,
      padding: 14,
      marginBottom: 16,
      shadowColor: c.shadowCard,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.05,
      shadowRadius: 0,
      elevation: 3,
      borderWidth: 2,
      borderColor: c.borderSubtle,
    },

    /**
     * Carte ligne joueur/param (flex row) : py12 px14, gap 12, 1px bordure.
     * Utilisé pour les lignes de joueurs (PlayersScreen, NewGameScreen).
     */
    cardRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: c.card,
      borderRadius: 24,
      paddingVertical: 12,
      paddingHorizontal: 14,
      gap: 12,
      marginBottom: 16,
      shadowColor: c.shadowCard,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.05,
      shadowRadius: 0,
      elevation: 2,
      borderWidth: 1,
      borderColor: c.borderSubtle,
    },

    /** Carte petite : 16px coins, padding 16, 2px bordure (historique) */
    cardSm: {
      backgroundColor: c.card,
      borderRadius: 16,
      padding: 16,
      marginBottom: 16,
      shadowColor: c.shadowCard,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.05,
      shadowRadius: 0,
      elevation: 3,
      borderWidth: 2,
      borderColor: c.borderSubtle,
    },

    /** Carte medium : 20px coins, padding 16, 1px bordure (stats, détail joueur) */
    cardMd: {
      backgroundColor: c.card,
      borderRadius: 20,
      padding: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: c.borderSubtle,
      shadowColor: c.shadowCard,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.05,
      shadowRadius: 0,
      elevation: 2,
    },

    /** Carte liste paramètres : 24px coins, 8px padding intérieur pour rows */
    cardList: {
      backgroundColor: c.card,
      borderRadius: 24,
      padding: 8,
      marginBottom: 32,
      shadowColor: c.shadowCard,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.05,
      shadowRadius: 0,
      elevation: 3,
      borderWidth: 2,
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
      paddingHorizontal: 24,
    },
    /** Contenu d'un bottom sheet */
    sheet: {
      backgroundColor: c.card,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      paddingHorizontal: 24,
      paddingTop: 28,
      paddingBottom: 40,
    },
    /** Carte centrée pour modales de confirmation */
    modalCard: {
      backgroundColor: c.card,
      borderRadius: 20,
      paddingHorizontal: 24,
      paddingTop: 24,
      paddingBottom: 20,
    },
    /** Poignée de drag en haut d'un sheet */
    sheetHandle: {
      width: 36,
      height: 4,
      borderRadius: 2,
      backgroundColor: c.border,
      alignSelf: 'center',
      marginBottom: 16,
    },
    /** Titre principal d'un sheet */
    sheetTitle: {
      fontSize: 17,
      fontWeight: '700',
      color: c.text,
      marginBottom: 20,
    },
    /** Titre de section dans un sheet (filtre, etc.) */
    sheetSectionTitle: {
      fontSize: 12,
      fontWeight: '700',
      color: c.textMuted,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
      marginBottom: 10,
      marginTop: 16,
    },
    /** Rangée date (mois + année) dans un sheet de filtre */
    sheetDateRow: {
      flexDirection: 'row',
      gap: 12,
    },
    sheetDateCol: {
      flex: 1,
    },
    /** Boutons d'action en bas d'un sheet de filtre */
    sheetActions: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 40,
    },

    // ─── Boutons ──────────────────────────────────────────────────────────

    /** Base flex pour boutons côte à côte */
    btn: {
      flex: 1,
      paddingVertical: 16,
      borderRadius: 16,
      alignItems: 'center',
    },
    /** Conteneur de deux boutons côte à côte */
    buttons: {
      flexDirection: 'row',
      gap: 12,
    },
    btnPrimary: {
      backgroundColor: c.primary,
      shadowColor: c.shadowPrimary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 10,
      borderRadius: 16,
      paddingHorizontal: 16,
      paddingVertical: 16,
    },
    btnPrimaryBig: {
      paddingHorizontal: 20,
      paddingVertical: 20,
      shadowOffset: { width: 0, height: 8 },
    },
    btnPrimaryText: {
      fontSize: 16,
      fontWeight: '700',
      color: c.white,
    },
    btnPrimaryTextSmall: {
      fontSize: 13,
      fontWeight: '700',
      color: c.white,
    },
    btnPrimaryTextBig: {
      fontSize: 18,
      fontWeight: '700',
      color: c.white,
    },
    btnSecondary: {
      backgroundColor: c.searchBackground,
      shadowColor: c.shadowCard,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 0,
    },
    btnSecondaryText: {
      fontSize: 16,
      fontWeight: '600',
      color: c.text,
    },
    /** Bouton destructif (rouge) */
    btnDanger: {
      backgroundColor: c.errorSubtle,
      borderRadius: 16,
      paddingVertical: 16,
      alignItems: 'center',
    },
    btnDangerText: {
      color: c.danger,
      fontSize: 16,
      fontWeight: '700',
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
      borderRadius: 8,
      backgroundColor: c.iconBackground,
      alignItems: 'center',
      justifyContent: 'center',
    },
    /** Boîte icône primary-subtle : 34×34 (stats, détail joueur) */
    iconBoxPrimary: {
      width: 34,
      height: 34,
      borderRadius: 10,
      backgroundColor: c.primarySubtle,
      alignItems: 'center',
      justifyContent: 'center',
    },
    /** Boîte icône marque (logo, drawer header) : fond primary */
    iconBoxBrand: {
      width: 34,
      height: 34,
      borderRadius: 9,
      backgroundColor: c.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    /** Grande boîte icône pour états vides : 80×80 */
    iconBoxLg: {
      width: 80,
      height: 80,
      borderRadius: 24,
      backgroundColor: c.primarySubtle,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 20,
    },

    // ─── Lignes liste (paramètres) ────────────────────────────────────────

    /** Ligne cliquable dans une cardList */
    listRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 14,
      paddingHorizontal: 16,
    },
    /** Icône dans une listRow (avec margin droite) */
    listRowIcon: {
      width: 34,
      height: 34,
      borderRadius: 8,
      backgroundColor: c.iconBackground,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    listRowLabel: {
      flex: 1,
      fontSize: 15,
      color: c.text,
    },
    listRowDivider: {
      height: 1,
      backgroundColor: c.border,
      marginHorizontal: 16,
    },

    // ─── Lignes info/stats (stats, détail joueur) ─────────────────────────

    /** Ligne d'information : icône + label flex + valeur */
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingVertical: 10,
    },
    infoRowDivider: {
      height: 1,
      backgroundColor: c.borderSubtle,
    },
    infoLabel: {
      flex: 1,
      fontSize: 14,
      color: c.textSecondary,
    },
    infoValue: {
      fontSize: 15,
      fontWeight: '700',
      color: c.text,
    },

    // ─── État vide ────────────────────────────────────────────────────────

    emptyWrap: {
      alignItems: 'center',
      paddingTop: 48,
      paddingHorizontal: 32,
    },
    emptyIconBox: {
      width: 80,
      height: 80,
      borderRadius: 24,
      backgroundColor: c.primarySubtle,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 20,
    },
    emptyTitle: {
      fontSize: 17,
      fontWeight: '700',
      color: c.text,
      marginBottom: 8,
      textAlign: 'center',
    },
    emptySubtitle: {
      fontSize: 14,
      color: c.textMuted,
      textAlign: 'center',
      lineHeight: 20,
    },

    // ─── Dropdown ────────────────────────────────────────────────────────

    ddInput: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: c.inputBackground,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: c.border,
      paddingHorizontal: 14,
      paddingVertical: 12,
    },
    ddInputOpen: {
      borderColor: c.primary,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
    },
    ddPlaceholder: {
      fontSize: 14,
      color: c.textMuted,
      flex: 1,
    },
    ddValueRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      flex: 1,
    },
    ddValueText: {
      fontSize: 14,
      color: c.text,
      fontWeight: '500',
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
      borderBottomLeftRadius: 12,
      borderBottomRightRadius: 12,
      overflow: 'hidden',
      maxHeight: 220,
    },
    ddOption: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 14,
      paddingVertical: 12,
      borderTopWidth: 1,
      borderTopColor: c.border,
    },
    ddOptionActive: {
      backgroundColor: c.primarySubtle,
    },
    ddOptionText: {
      fontSize: 14,
      color: c.text,
    },
    ddOptionTextActive: {
      color: c.primary,
      fontWeight: '600',
    },

    // ─── Bouton d'en-tête navigateur ─────────────────────────────────────

    /** Bouton rond translucide dans le header de navigation */
    hdrBtn: {
      width: 34,
      height: 34,
      borderRadius: 100,
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

    /** Bouton texte-icône inline (Ajouter joueur, Ajouter favori…) */
    addBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    addBtnText: {
      color: c.primary,
      fontSize: 13,
      fontWeight: '600',
    },

    // ─── Clavier numérique ────────────────────────────────────────────────

    keypad: {
      gap: 8,
      marginBottom: 16,
    },
    keyRow: {
      flexDirection: 'row',
      gap: 8,
    },
    /** Touche standard (fond page, coins 14px) — utilisé en écran plein */
    key: {
      flex: 1,
      height: 56,
      backgroundColor: c.background,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
    },
    /** Touche modale (fond carte + bordure subtile + ombre) */
    keyCard: {
      flex: 1,
      height: 56,
      backgroundColor: c.card,
      borderRadius: 16,
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
      fontSize: 22,
      fontWeight: '500',
      color: c.text,
    },
  });
