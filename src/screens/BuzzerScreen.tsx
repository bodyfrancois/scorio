import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, Pressable, Animated, StyleSheet, Vibration, useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { setAudioModeAsync, useAudioPlayer } from 'expo-audio';

import { useTheme } from '../theme/ThemeContext';
import { useTranslation } from '../i18n';
import { fontSize as FS, fontWeight as FW, letterSpacing as LS, radius as R, spacing as S } from '../theme/tokens';

const BUZZ_SOUND = require('../../assets/sounds/buzzer.wav');
const BUZZ_VIBRATION_MS = 400;
/** Durée pendant laquelle le compteur reste mis en avant après un appui. */
const FLASH_MS = 450;

const TABLET_MIN_WIDTH = 768;
const BUZZER_PHONE = 240;
const BUZZER_TABLET = 380;

/**
 * Un seul gros bouton : on le pose au milieu de la table et le premier qui
 * l'atteint marque le coup. Le compteur d'appuis évite les contestations.
 */
export default function BuzzerScreen() {
  const navigation = useNavigation();
  const { colors, language } = useTheme();
  const t = useTranslation(language);
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const { width } = useWindowDimensions();
  const size = width >= TABLET_MIN_WIDTH ? BUZZER_TABLET : BUZZER_PHONE;

  const [count, setCount] = useState(0);
  const [flashing, setFlashing] = useState(false);
  const flashTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const press = useRef(new Animated.Value(0)).current;

  const player = useAudioPlayer(BUZZ_SOUND);

  useEffect(() => {
    navigation.setOptions({ headerTitle: t.buzzerTitle });
  }, [navigation, t.buzzerTitle]);

  // Un buzzer doit s'entendre même téléphone en silencieux.
  useEffect(() => {
    setAudioModeAsync({ playsInSilentMode: true }).catch(() => {});
  }, []);

  useEffect(() => () => clearTimeout(flashTimer.current), []);

  const buzz = useCallback(() => {
    player.seekTo(0);
    player.play();
    Vibration.vibrate(BUZZ_VIBRATION_MS);

    setCount((previous) => previous + 1);
    setFlashing(true);
    clearTimeout(flashTimer.current);
    flashTimer.current = setTimeout(() => setFlashing(false), FLASH_MS);

    // Enfoncement franc puis retour élastique.
    Animated.sequence([
      Animated.timing(press, { toValue: 1, duration: 70, useNativeDriver: true }),
      Animated.spring(press, { toValue: 0, friction: 4, tension: 90, useNativeDriver: true }),
    ]).start();
  }, [player, press]);

  const scale = press.interpolate({ inputRange: [0, 1], outputRange: [1, 0.92] });

  return (
    <View style={styles.container}>
      <Animated.View style={{ transform: [{ scale }] }}>
        <Pressable
          onPressIn={buzz}
          accessibilityRole="button"
          accessibilityLabel={t.buzzerAction}
          style={[styles.buzzer, { width: size, height: size, borderRadius: size / 2 }]}
        >
          <View style={[styles.buzzerInner, { width: size - 34, height: size - 34, borderRadius: (size - 34) / 2 }]}>
            <Text style={styles.buzzerLabel} numberOfLines={1} adjustsFontSizeToFit>
              {t.buzzerAction}
            </Text>
          </View>
        </Pressable>
      </Animated.View>

      <Text style={[styles.counter, flashing && styles.counterFlash]} accessibilityLiveRegion="polite">
        {count > 0 ? t.buzzerCount.replace('{count}', String(count)) : t.buzzerHint}
      </Text>

      <Pressable
        onPress={() => setCount(0)}
        disabled={count === 0}
        accessibilityRole="button"
        accessibilityLabel={t.buzzerReset}
        accessibilityState={{ disabled: count === 0 }}
        style={({ pressed }) => [
          styles.resetButton,
          pressed && styles.resetPressed,
          count === 0 && styles.resetDisabled,
        ]}
      >
        <Text style={styles.resetText}>{t.buzzerReset}</Text>
      </Pressable>
    </View>
  );
}

function makeStyles(c: ReturnType<typeof useTheme>['colors']) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: c.background,
      paddingHorizontal: S.lg,
      alignItems: 'center',
      justifyContent: 'center',
    },
    /** Socle du buzzer : anneau sombre qui donne l'assise du bouton physique. */
    buzzer: {
      backgroundColor: '#7F1D1D',
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: c.shadow,
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.25,
      shadowRadius: 12,
      elevation: 8,
    },
    buzzerInner: {
      backgroundColor: '#DC2626',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: S.lg,
      borderWidth: 4,
      borderColor: '#EF4444',
    },
    buzzerLabel: {
      color: '#FFFFFF',
      fontSize: FS['2xl'],
      fontWeight: FW.extrabold,
      letterSpacing: LS.widest,
      textTransform: 'uppercase',
      textAlign: 'center',
    },
    counter: {
      marginTop: 32,
      minHeight: 30,
      fontSize: FS.lg,
      fontWeight: FW.bold,
      color: c.textMuted,
    },
    counterFlash: {
      color: c.primary,
    },
    resetButton: {
      marginTop: 32,
      width: '100%',
      maxWidth: 400,
      paddingVertical: S.md,
      alignItems: 'center',
      justifyContent: 'center',
    },
    resetPressed: {
      opacity: 0.7,
    },
    resetDisabled: {
      opacity: 0.4,
    },
    resetText: {
      color: c.textMuted,
      fontSize: FS.sm,
      fontWeight: FW.semibold,
    },
  });
}
