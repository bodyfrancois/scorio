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
import { Ionicons } from '@expo/vector-icons';
import IconPen from '../components/icons/IconPen';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeContext';
import { useTranslation } from '../i18n';
import { lightColors } from '../theme/colors';
import { makePlayersStyles } from '../theme/styles';
import {
  loadFavorites,
  addFavorite,
  removeFavorite,
  updateFavorite,
} from '../storage/favoritePlayers';

function getAvatarColor(name: string, colors: typeof lightColors) {
  const palette = [
    colors.avatarViole, colors.avatarRose, colors.avatarPeche, colors.avatarJaune,
    colors.avatarVert, colors.avatarCiel, colors.avatarBleu, colors.avatarFuchsia,
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash += name.charCodeAt(i);
  return palette[hash % palette.length];
}

type ModalState =
  | { type: 'add' }
  | { type: 'edit'; name: string }
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

  const [favorites, setFavorites] = useState<string[]>([]);
  const [modal, setModal] = useState<ModalState>(null);
  const [inputValue, setInputValue] = useState('');
  const [inputFocused, setInputFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    loadFavorites().then(setFavorites);
  }, []);

  const openAdd = () => {
    setInputValue('');
    setModal({ type: 'add' });
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const openEdit = (name: string) => {
    setInputValue(name);
    setModal({ type: 'edit', name });
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const openDelete = (name: string) => {
    setModal({ type: 'delete', name });
  };

  const closeModal = () => setModal(null);

  const handleConfirm = async () => {
    if (!modal) return;
    if (modal.type === 'add') {
      const updated = await addFavorite(inputValue);
      setFavorites(updated);
    } else if (modal.type === 'edit') {
      const updated = await updateFavorite(modal.name, inputValue);
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
      !(modal?.type === 'add' && favorites.includes(inputValue.trim()))
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
            <Ionicons name="add-circle-outline" size={16} color={colors.primary} />
            <Text style={styles.addBtnText}>{t.addFavorite}</Text>
          </Pressable>
        </View>

        {favorites.length === 0 ? (
          <View style={styles.emptyWrap}>
            <View style={styles.iconBoxLg}>
              <Ionicons name="people-outline" size={36} color={colors.primary} />
            </View>
            <Text style={[styles.subheading, { marginBottom: 8, textAlign: 'center' }]}>{t.noFavorites}</Text>
            <Text style={[styles.muted, { textAlign: 'center', lineHeight: 20 }]}>{t.noFavoritesHint}</Text>
          </View>
        ) : (
          <>
            {favorites.map((name) => (
              <View key={name} style={[styles.card, styles.cardRow]}>
                <View style={[styles.avatar, { backgroundColor: getAvatarColor(name, colors) }]}>
                  <Text style={styles.avatarText}>
                    {name.trim().slice(0, 2).toUpperCase()}
                  </Text>
                </View>
                <Text style={[styles.bodyMedium, { flex: 1 }]}>{name}</Text>
                <View style={styles.rowActions}>
                  <Pressable
                    style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}
                    onPress={() => openEdit(name)}
                  >
                    <IconPen size={18} color={colors.textSecondary} />
                  </Pressable>
                  <Pressable
                    style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}
                    onPress={() => openDelete(name)}
                  >
                    <Ionicons name="trash-outline" size={18} color={colors.danger} />
                  </Pressable>
                </View>
              </View>
            ))}
          </>
        )}
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
