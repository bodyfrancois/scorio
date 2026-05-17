import React, { useState, useEffect, useMemo, useRef, useLayoutEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeContext';
import { useTranslation } from '../i18n';
import { makePlayersStyles } from '../theme/styles';
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

  useEffect(() => {
    loadFavorites().then(setFavorites);
  }, []);

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

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionLabel, { marginBottom: 0 }]}>{t.favoritePlayers}</Text>
          <Pressable onPress={openAdd} style={styles.addBtn}>
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
        )}sdsd
      </ScrollView>

      {/* Modal Ajout / Édition */}
      <Modal visible={isAddOrEdit} transparent animationType="slide">
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.overlay}>
            <View style={styles.sheet}>
              <Text style={[styles.subheading, { marginBottom: 20 }]}>
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
              />
              <AvatarColorPicker
                selectedKey={selectedColorKey}
                onSelect={setSelectedColorKey}
              />
              <View style={styles.buttons}>
                <Pressable
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
                <Pressable
                  style={({ pressed }) => [styles.btn, styles.btnSecondary, pressed && styles.pressed]}
                  onPress={closeModal}
                >
                  <Text style={styles.btnSecondaryText}>{t.cancel}</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Modal Suppression */}
      <Modal visible={modal?.type === 'delete'} transparent animationType="slide">
        <View style={styles.overlay}>
          <View style={styles.sheet}>
            <Text style={[styles.subheading, { marginBottom: 20 }]}>{t.confirmDeletePlayer}</Text>
            <Text style={[styles.caption, { marginBottom: 20, lineHeight: 20 }]}>
              {modal?.type === 'delete' ? `"${modal.name}"` : ''}
            </Text>
            <View style={styles.buttons}>
              <Pressable
                style={({ pressed }) => [styles.btn, styles.btnDanger, pressed && styles.pressed]}
                onPress={handleConfirm}
              >
                <Text style={styles.btnDangerText}>{t.deletePlayer}</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [styles.btn, styles.btnSecondary, pressed && styles.pressed]}
                onPress={closeModal}
              >
                <Text style={styles.btnSecondaryText}>{t.cancel}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
