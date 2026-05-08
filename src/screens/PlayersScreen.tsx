import React, { useState, useEffect, useMemo, useRef, useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
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
import { makeSharedStyles } from '../theme/styles';
import {
  loadFavorites,
  addFavorite,
  removeFavorite,
  updateFavorite,
} from '../storage/favoritePlayers';

const makeStyles = (c: typeof lightColors) => ({
  ...makeSharedStyles(c),
  ...StyleSheet.create({
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
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
    playerRow: {
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
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarText: {
      fontSize: 15,
      fontWeight: '700',
      color: c.textSecondary,
    },
    playerName: {
      flex: 1,
      fontSize: 15,
      fontWeight: '500',
      color: c.text,
    },
    rowActions: {
      flexDirection: 'row',
      gap: 4,
    },
    iconBtn: {
      width: 36,
      height: 36,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: c.background,
    },
    // Empty state
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
    // Modal
    modalInput: {
      backgroundColor: c.background,
      borderRadius: 16,
      paddingHorizontal: 16,
      paddingVertical: 14,
      fontSize: 16,
      color: c.text,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: c.border,
    },
    modalInputFocused: {
      borderColor: c.primary,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: '800',
      color: c.text,
      marginBottom: 20,
    },
    dangerBtn: {
      backgroundColor: c.errorSubtle,
      borderRadius: 16,
      paddingVertical: 16,
      alignItems: 'center',
    },
    dangerBtnText: {
      color: c.danger,
      fontSize: 16,
      fontWeight: '700',
    },
    confirmMsg: {
      fontSize: 14,
      color: c.textSecondary,
      marginBottom: 20,
      lineHeight: 20,
    },
  }),
});

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
  const styles = useMemo(() => makeStyles(colors), [colors]);
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
            <View style={styles.emptyIconBox}>
              <Ionicons name="people-outline" size={36} color={colors.primary} />
            </View>
            <Text style={styles.emptyTitle}>{t.noFavorites}</Text>
            <Text style={styles.emptySubtitle}>{t.noFavoritesHint}</Text>
          </View>
        ) : (
          <>
            {favorites.map((name) => (
              <View key={name} style={styles.playerRow}>
                <View style={[styles.avatar, { backgroundColor: getAvatarColor(name, colors) }]}>
                  <Text style={styles.avatarText}>
                    {name.trim().slice(0, 2).toUpperCase()}
                  </Text>
                </View>
                <Text style={styles.playerName}>{name}</Text>
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

      {/* Add / Edit modal */}
      <Modal visible={isAddOrEdit} transparent animationType="slide">
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.overlay}>
            <View style={styles.sheet}>
              <Text style={styles.modalTitle}>
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

      {/* Delete confirmation modal */}
      <Modal visible={modal?.type === 'delete'} transparent animationType="slide">
        <View style={styles.overlay}>
          <View style={styles.sheet}>
            <Text style={styles.modalTitle}>{t.confirmDeletePlayer}</Text>
            <Text style={styles.confirmMsg}>
              {modal?.type === 'delete' ? `"${modal.name}"` : ''}
            </Text>
            <View style={styles.buttons}>
              <Pressable
                style={({ pressed }) => [styles.btn, styles.dangerBtn, pressed && styles.pressed]}
                onPress={handleConfirm}
              >
                <Text style={styles.dangerBtnText}>{t.deletePlayer}</Text>
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
