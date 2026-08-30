import React, { useMemo } from 'react';
import { View, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';

import { useTheme } from '../theme/ThemeContext';
import { useTranslation } from '../i18n';
import { VISIBLE_MINI_GAMES } from '../config/miniGames';
import { RootStackParamList } from '../types/navigations';
import { radius as R, spacing as S } from '../theme/tokens';

const TILE = 56;

/**
 * Rangée horizontale des mini-jeux, sous le titre « Liste de jeux ».
 * Scroll horizontal : la rangée absorbe autant de mini-jeux qu'on en ajoute
 * sans jamais déborder, quelle que soit la largeur de l'écran.
 */
export default function MiniGamesRow() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { colors, language } = useTheme();
  const t = useTranslation(language);
  const styles = useMemo(() => makeStyles(colors), [colors]);

  if (VISIBLE_MINI_GAMES.length === 0) return null;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
      style={styles.scroll}
    >
      {VISIBLE_MINI_GAMES.map(({ id, route, labelKey, Icon, iconSize }) => (
        <Pressable
          key={id}
          onPress={() => (navigation as any).navigate(route)}
          accessibilityRole="button"
          accessibilityLabel={t[labelKey] as string}
          style={({ pressed }) => [styles.tile, pressed && styles.tilePressed]}
        >
          <Icon size={iconSize} />
        </Pressable>
      ))}
    </ScrollView>
  );
}

function makeStyles(c: ReturnType<typeof useTheme>['colors']) {
  return StyleSheet.create({
    scroll: {
      // Déborde du padding horizontal de l'accueil pour que le scroll parte
      // du bord de l'écran, tout en gardant les pastilles alignées sur la grille.
      marginHorizontal: -S.lg,
      marginBottom: S.sm,
    },
    row: {
      paddingHorizontal: S.lg,
      // Un ScrollView rogne ce qui dépasse : sans marge verticale, l'ombre
      // portée (décalée de 8 px vers le bas) coupait le bas des pastilles.
      paddingVertical: S.md,
      gap: S.md,
    },
    /** Même habillage que les cartes de jeu de l'accueil, en pastille ronde. */
    tile: {
      width: TILE,
      height: TILE,
      borderRadius: R.full,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: c.card,
      borderWidth: 1,
      borderColor: c.border,
      shadowColor: c.shadowCard,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.05,
      shadowRadius: 0,
      elevation: 2,
    },
    tilePressed: {
      transform: [{ scale: 0.94 }],
    },
  });
}
