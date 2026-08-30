import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View, Text, Pressable, TextInput, ScrollView, Animated, Easing, StyleSheet, useWindowDimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../theme/ThemeContext';
import { useTranslation } from '../i18n';
import SpinWheel, { WHEEL_COLORS } from '../components/SpinWheel';
import { fontSize as FS, fontWeight as FW, letterSpacing as LS, radius as R, spacing as S } from '../theme/tokens';

const SPIN_MS = 3200;
/** Tours complets avant l'arrêt — assez pour rendre le résultat illisible à l'œil. */
const FULL_TURNS = 6;
const MIN_ENTRIES = 2;
const MAX_ENTRIES = 12;

const TABLET_MIN_WIDTH = 768;
const WHEEL_PHONE = 280;
const WHEEL_TABLET = 440;

export default function WheelScreen() {
  const navigation = useNavigation();
  const { colors, language } = useTheme();
  const t = useTranslation(language);
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const { width } = useWindowDimensions();
  const wheelSize = width >= TABLET_MIN_WIDTH ? WHEEL_TABLET : WHEEL_PHONE;

  const [entries, setEntries] = useState<string[]>(['', '', '', '']);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<number | null>(null);

  /** Rotation cumulée en degrés : on ne repart jamais de zéro entre deux lancers. */
  const rotation = useRef(new Animated.Value(0)).current;
  const totalDegrees = useRef(0);

  useEffect(() => {
    navigation.setOptions({ headerTitle: t.wheelTitle });
  }, [navigation, t.wheelTitle]);

  /** Une entrée vide reste jouable : elle prend son numéro d'ordre par défaut. */
  const labels = entries.map((entry, index) => entry.trim() || `${index + 1}`);

  const spin = () => {
    if (spinning) return;

    const winner = Math.floor(Math.random() * labels.length);
    const step = 360 / labels.length;

    // Le curseur est en haut : pour amener le milieu du quartier gagnant sous
    // lui, il faut tourner de l'opposé de son angle, modulo un tour.
    const target = (360 - (winner * step + step / 2)) % 360;
    const current = totalDegrees.current % 360;
    totalDegrees.current += FULL_TURNS * 360 + ((target - current + 360) % 360);

    setResult(null);
    setSpinning(true);

    Animated.timing(rotation, {
      toValue: totalDegrees.current,
      duration: SPIN_MS,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (!finished) return;
      totalDegrees.current %= 360;
      rotation.setValue(totalDegrees.current);
      setResult(winner);
      setSpinning(false);
    });
  };

  const turn = rotation.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
    extrapolate: 'extend',
  });

  const updateEntry = (index: number, value: string) =>
    setEntries((previous) => previous.map((entry, i) => (i === index ? value : entry)));

  const addEntry = () => setEntries((previous) => [...previous, '']);

  const removeEntry = (index: number) =>
    setEntries((previous) => previous.filter((_, i) => i !== index));

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.stage}>
        <View style={styles.cursor} />
        <Animated.View style={{ transform: [{ rotate: turn }] }}>
          <SpinWheel entries={labels} size={wheelSize} />
        </Animated.View>
      </View>

      <Text style={styles.result} numberOfLines={1} adjustsFontSizeToFit>
        {result !== null ? labels[result] : spinning ? t.wheelSpinning : ' '}
      </Text>

      <Pressable
        onPress={spin}
        disabled={spinning}
        accessibilityRole="button"
        accessibilityLabel={t.wheelSpin}
        accessibilityState={{ disabled: spinning }}
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
          spinning && styles.buttonDisabled,
        ]}
      >
        <Text style={styles.buttonText}>{t.wheelSpin}</Text>
      </Pressable>

      <View style={styles.entriesHeader}>
        <Text style={styles.sectionLabel}>{t.wheelEntries}</Text>
        {entries.length < MAX_ENTRIES && (
          <Pressable onPress={addEntry} accessibilityRole="button" style={styles.addButton}>
            <Ionicons name="add-circle-outline" size={18} color={colors.primary} />
            <Text style={styles.addText}>{t.wheelAddEntry}</Text>
          </Pressable>
        )}
      </View>

      {entries.map((entry, index) => (
        <View key={index} style={styles.entryRow}>
          <View
            style={[styles.swatch, { backgroundColor: WHEEL_COLORS[index % WHEEL_COLORS.length] }]}
          />
          <TextInput
            value={entry}
            onChangeText={(value) => updateEntry(index, value)}
            placeholder={`${index + 1}`}
            placeholderTextColor={colors.textMuted}
            maxLength={20}
            accessibilityLabel={`${t.wheelEntries} ${index + 1}`}
            selectionColor={colors.primary}
            style={styles.entryInput}
          />
          <Pressable
            onPress={() => removeEntry(index)}
            disabled={entries.length <= MIN_ENTRIES}
            accessibilityRole="button"
            accessibilityLabel={t.wheelRemoveEntry}
            accessibilityState={{ disabled: entries.length <= MIN_ENTRIES }}
            style={entries.length <= MIN_ENTRIES && styles.removeDisabled}
          >
            <Ionicons name="remove-circle-outline" size={22} color={colors.textMuted} />
          </Pressable>
        </View>
      ))}
    </ScrollView>
  );
}

function makeStyles(c: ReturnType<typeof useTheme>['colors']) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: c.background,
    },
    scrollContent: {
      alignItems: 'center',
      paddingHorizontal: S.lg,
      paddingTop: 32,
      paddingBottom: S['3xl'],
    },
    stage: {
      alignItems: 'center',
    },
    /** Curseur fixe en haut : c'est lui qui désigne le quartier gagnant. */
    cursor: {
      width: 0,
      height: 0,
      marginBottom: -10,
      zIndex: 1,
      borderLeftWidth: 11,
      borderRightWidth: 11,
      borderTopWidth: 20,
      borderLeftColor: 'transparent',
      borderRightColor: 'transparent',
      borderTopColor: c.text,
    },
    result: {
      marginTop: 32,
      minHeight: 44,
      fontSize: FS['3xl'],
      fontWeight: FW.extrabold,
      color: c.text,
      letterSpacing: LS.wider,
      textAlign: 'center',
    },
    button: {
      marginTop: 32,
      width: '100%',
      maxWidth: 400,
      backgroundColor: c.primary,
      borderRadius: R.lg,
      paddingVertical: S.base,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonPressed: {
      opacity: 0.85,
      transform: [{ scale: 0.98 }],
    },
    buttonDisabled: {
      opacity: 0.4,
    },
    buttonText: {
      color: c.white,
      fontSize: FS.base,
      fontWeight: FW.bold,
      letterSpacing: LS.wide,
    },
    entriesHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      alignSelf: 'stretch',
      width: '100%',
      maxWidth: 400,
      marginTop: S['3xl'],
      marginBottom: S.md,
    },
    sectionLabel: {
      fontSize: FS.xs,
      fontWeight: FW.bold,
      color: c.textMuted,
      letterSpacing: LS.label,
      textTransform: 'uppercase',
    },
    addButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: S.xs,
    },
    addText: {
      fontSize: FS.sm,
      fontWeight: FW.semibold,
      color: c.primary,
    },
    entryRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: S.md,
      alignSelf: 'stretch',
      width: '100%',
      maxWidth: 400,
      backgroundColor: c.card,
      borderRadius: R.lg,
      borderWidth: 1,
      borderColor: c.border,
      paddingHorizontal: S.base,
      paddingVertical: S.sm,
      marginBottom: S.sm,
    },
    swatch: {
      width: 14,
      height: 14,
      borderRadius: 7,
    },
    entryInput: {
      flex: 1,
      fontSize: FS.base,
      color: c.text,
      paddingVertical: S.xs,
    },
    removeDisabled: {
      opacity: 0.3,
    },
  });
}
