import { useMemo } from 'react';
import { View, Text, Pressable, Modal, ScrollView, Animated, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { useTranslation } from '../i18n';
import { makeNewGameStyles } from '../theme/styles';
import { FavoritePlayer } from '../storage/favoritePlayers';
import PlayerAvatar from './PlayerAvatar';
import { getAvatarColorByKey } from '../utils/avatarColors';
import { useSheetAnimation } from '../hooks/useSheetAnimation';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Props = {
  visible: boolean;
  favorites: FavoritePlayer[];
  onClose: () => void;
  onSelect: (fav: FavoritePlayer) => void;
};

export default function FavoritesSheet({ visible, favorites, onClose, onSelect }: Props) {
  const { colors, language } = useTheme();
  const t = useTranslation(language);
  const styles = useMemo(() => makeNewGameStyles(colors), [colors]);
  const { rendered, overlayStyle, sheetStyle } = useSheetAnimation(visible);

  return (
    <Modal visible={rendered} transparent animationType="none" onRequestClose={onClose}>
      <AnimatedPressable accessible={false} style={[styles.overlay, StyleSheet.absoluteFillObject, overlayStyle]} onPress={onClose} />
      <View style={{ flex: 1, justifyContent: 'flex-end' }} pointerEvents="box-none">
        <Animated.View style={[styles.sheet, sheetStyle]}>
          <Text style={[styles.labelPrimary, { marginBottom: 4 }]} accessibilityRole="header">{t.fromFavorites}</Text>
          <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 580 }}>
            {favorites.map((fav, i) => (
              <Pressable accessibilityRole="button"
                key={fav.name}
                style={({ pressed }) => [
                  styles.favItem,
                  i === favorites.length - 1 && styles.favItemLast,
                  pressed && styles.cardPressed,
                ]}
                onPress={() => onSelect(fav)}
              >
                <PlayerAvatar name={fav.name} color={getAvatarColorByKey(fav.colorKey, colors)} />
                <Text style={[styles.bodyMedium, { flex: 1 }]}>{fav.name}</Text>
                <Ionicons name="chevron-forward" size={16} color={colors.iconMuted} />
              </Pressable>
            ))}
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}
