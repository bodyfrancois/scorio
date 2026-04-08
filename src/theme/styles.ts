import { StyleSheet } from 'react-native';
import { lightColors } from './colors';

/**
 * Styles partagés entre les écrans et composants.
 *
 * Usage dans makeStyles :
 *   const makeStyles = (c: typeof lightColors) => ({
 *     ...makeSharedStyles(c),
 *     ...StyleSheet.create({ /* styles locaux *\/ }),
 *   });
 *
 * Les styles locaux écrasent les styles partagés si même clé.
 */
export const makeSharedStyles = (c: typeof lightColors) =>
  StyleSheet.create({

    // ─── Layout ──────────────────────────────────────────────────────────
    /** Carte standard : fond blanc, coins arrondis, ombre légère et bordure subtile */
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
    container: {
      flex: 1,
      backgroundColor: c.background,
    },
    scrollContent: {
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 48,
    },
    sectionLabel: {
      fontSize: 11,
      fontWeight: '700',
      color: c.textSecondary,
      letterSpacing: 1,
      marginBottom: 12,
    },

    // ─── Modales & Sheets ─────────────────────────────────────────────────
    /** Fond semi-transparent avec contenu en bas (bottom sheet) */
    overlay: {
      flex: 1,
      backgroundColor: c.overlay,
      justifyContent: 'flex-end',
    },
    /** Contenu d'un bottom sheet (carte arrondie en bas) */
    sheet: {
      backgroundColor: c.card,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      paddingHorizontal: 24,
      paddingTop: 28,
      paddingBottom: 40,
    },

    // ─── Boutons ──────────────────────────────────────────────────────────
    /** Base commune à tous les boutons flex */
    btn: {
      flex: 1,
      paddingVertical: 16,
      borderRadius: 16,
      alignItems: 'center',
    },
    /** Conteneur d'une paire de boutons côte à côte */
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
    btnDisabled: {
      opacity: 0.3,
      shadowColor: '#410872',
      shadowOffset: { width: 0, height: 4 },
    },
    /** Effet Material Design : léger enfoncement au press */
    pressed: {
      opacity: 0.82,
      transform: [{ scale: 0.97 }],
    },
    /** Effet enfoncement doux pour les cartes (surfaces plus larges) */
    cardPressed: {
      opacity: 0.92,
      transform: [{ scale: 0.985 }],
    },
    /** Effet enfoncement sur les touches de clavier (éléments carrés) */
    keyPressed: {
      opacity: 0.7,
      transform: [{ scale: 0.91 }],
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
    /** Touche par défaut (fond clair, coins arrondis 14) */
    key: {
      flex: 1,
      height: 56,
      backgroundColor: c.background,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
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
