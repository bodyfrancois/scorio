import React, { useState, useCallback, useMemo, useRef, useLayoutEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Animated,
  StyleSheet,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeContext';
import { useTranslation } from '../i18n';
import { makePlayersStyles } from '../theme/styles';
import { useSheetAnimation } from '../hooks/useSheetAnimation';
import {
  loadFavorites,
  addFavorite,
  removeFavorite,
  updateFavorite,
  FavoritePlayer,
} from '../storage/favoritePlayers';
import PlayerCard from '../components/PlayerCard';
import EmptyState from '../components/EmptyState';
import AvatarColorPicker from '../components/AvatarColorPicker';
import { getAvatarColorByKey, getDefaultColorKeyByIndex } from '../utils/avatarColors';

type ModalState =
  | { type: 'add' }
  | { type: 'edit'; name: string; colorKey: string }
  | { type: 'delete'; name: string }
  | null;

export default function PlayersScreen() {
  const { colors, language } = useTheme();
  const t = useTranslation(language);
  const styles = useMemo(() => makePlayersStyles(colors), [colors]);
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ headerTitle: t.playersMenu });
  }, [navigation, t.playersMenu]);

  const [favorites, setFavorites] = useState<FavoritePlayer[]>([]);
  const [modal, setModal] = useState<ModalState>(null);
  const [inputValue, setInputValue] = useState('');
  const [selectedColorKey, setSelectedColorKey] = useState<string>('avatarColor0');
  const [inputFocused, setInputFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  useFocusEffect(useCallback(() => {
    loadFavorites().then(setFavorites);
  }, []));

  const openAdd = () => {
    setInputValue('');
    setSelectedColorKey(getDefaultColorKeyByIndex(favorites.length));
    setModal({ type: 'add' });
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const openEdit = (player: FavoritePlayer) => {
    setInputValue(player.name);
    setSelectedColorKey(player.colorKey);
    setModal({ type: 'edit', name: player.name, colorKey: player.colorKey });
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const openDelete = (name: string) => {
    setModal({ type: 'delete', name });
  };

  const closeModal = () => setModal(null);

  const handleConfirm = async () => {
    if (!modal) return;
    if (modal.type === 'add') {
      const updated = await addFavorite(inputValue, selectedColorKey);
      setFavorites(updated);
    } else if (modal.type === 'edit') {
      const updated = await updateFavorite(modal.name, inputValue, selectedColorKey);
      setFavorites(updated);
    } else if (modal.type === 'delete') {
      const updated = await removeFavorite(modal.name);
      setFavorites(updated);
    }
    closeModal();
  };

  const isAddOrEdit = modal?.type === 'add' || modal?.type === 'edit';
  const canConfirm = isAddOrEdit
    ? inputValue.trim().length > 0 &&
      !(modal?.type === 'add' && favorites.some((p) => p.name === inputValue.trim()))
    : true;

  const addEditAnim = useSheetAnimation(isAddOrEdit);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionLabel, { marginBottom: 0 }]}>{t.favoritePlayers}</Text>
          <Pressable accessibilityRole="button" onPress={openAdd} style={styles.addBtn}>
            <Text style={styles.addBtnText}>{t.addFavorite}</Text>
          </Pressable>
        </View>

        {favorites.length === 0 ? (
          <EmptyState
            iconName="people-outline"
            heading={t.noFavorites}
            description={t.noFavoritesHint}
          />
        ) : (
          favorites.map((player) => (
            <PlayerCard
              key={player.name}
              variant="manage"
              name={player.name}
              avatarColor={getAvatarColorByKey(player.colorKey, colors)}
              onEdit={() => openEdit(player)}
              onDelete={() => openDelete(player.name)}
            />
          ))
        )}
      </ScrollView>

      {/* Modal Ajout / Édition */}
      <Modal visible={addEditAnim.rendered} transparent animationType="none" onRequestClose={closeModal}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <Animated.View style={[styles.overlay, StyleSheet.absoluteFillObject, addEditAnim.overlayStyle]} />
          <View style={{ flex: 1, justifyContent: 'flex-end' }} pointerEvents="box-none">
            <Animated.View style={[styles.sheet, addEditAnim.sheetStyle]}>
              <Text style={[styles.subheading, { marginBottom: 20 }]} accessibilityRole="header">
                {modal?.type === 'add' ? t.addFavorite : t.editFavorite}
              </Text>
              <TextInput
                ref={inputRef}
                style={[styles.modalInput, inputFocused && styles.modalInputFocused]}
                value={inputValue}
                onChangeText={setInputValue}
                placeholder={t.playerName}
                placeholderTextColor={colors.textMuted}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
                returnKeyType="done"
                onSubmitEditing={canConfirm ? handleConfirm : undefined}
                accessibilityLabel={t.playerName}
              />
              <AvatarColorPicker
                selectedKey={selectedColorKey}
                onSelect={setSelectedColorKey}
              />
              <View style={styles.buttons}>
                <Pressable accessibilityRole="button"
                  style={({ pressed }) => [
                    styles.btn, styles.btnPrimary,
                    !canConfirm && styles.btnDisabled,
                    pressed && canConfirm && styles.pressed,
                  ]}
                  onPress={handleConfirm}
                  disabled={!canConfirm}
                >
                  <Text style={styles.btnPrimaryText}>{t.save}</Text>
                </Pressable>
                <Pressable accessibilityRole="button"
                  style={({ pressed }) => [styles.btn, styles.btnSecondary, pressed && styles.pressed]}
                  onPress={closeModal}
                >
                  <Text style={styles.btnSecondaryText}>{t.cancel}</Text>
                </Pressable>
              </View>
            </Animated.View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Modal Suppression — même popin centrée que la suppression de l'historique */}
      <Modal visible={modal?.type === 'delete'} transparent animationType="fade" onRequestClose={closeModal}>
        <Pressable accessible={false} style={styles.overlayCenter} onPress={closeModal}>
          <Pressable accessible={false} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalCard}>
              <Text style={[styles.subheading, { marginBottom: 8 }]} accessibilityRole="header">{t.confirmDeletePlayer}</Text>
              <Text style={[styles.caption, { marginBottom: 24, lineHeight: 20 }]}>
                {modal?.type === 'delete' ? `"${modal.name}"` : ''}
              </Text>
              <View style={styles.buttons}>
                <Pressable accessibilityRole="button"
                  style={({ pressed }) => [styles.btn, styles.btnSecondary, pressed && styles.pressed]}
                  onPress={closeModal}
                >
                  <Text style={styles.btnSecondaryText}>{t.cancel}</Text>
                </Pressable>
                <Pressable accessibilityRole="button"
                  style={({ pressed }) => [styles.btn, styles.btnDangerFull, pressed && styles.pressed]}
                  onPress={handleConfirm}
                >
                  <Text style={styles.btnPrimaryText}>{t.deletePlayer}</Text>
                </Pressable>
              </View>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
