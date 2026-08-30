import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, Vibration, useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { setAudioModeAsync, useAudioPlayer } from 'expo-audio';

import { useTheme } from '../theme/ThemeContext';
import { useTranslation } from '../i18n';
import ScoreLimitModal from '../components/ScoreLimitModal';
import { fontSize as FS, fontWeight as FW, letterSpacing as LS, radius as R, spacing as S } from '../theme/tokens';

type Mode = 'stopwatch' | 'countdown';
type EditedUnit = 'minutes' | 'seconds';

/** Cadence de rafraîchissement : assez fine pour des centièmes fluides. */
const TICK_MS = 50;
const MAX_UNIT = 59;
const PRESETS_SEC = [60, 180, 300, 600];

/** Sonnerie de fin : elle se répète jusqu'à un toucher, sans dépasser 10 s. */
const ALARM_DURATION_MS = 10_000;
const ALARM_PERIOD_MS = 1_200;
const ALARM_VIBRATION_MS = 600;
const ALARM_SOUND = require('../../assets/sounds/timer-end.wav');

/**
 * Au-delà de cette largeur on est sur tablette : l'horloge passe en très grand,
 * lisible depuis l'autre bout de la table.
 */
const TABLET_MIN_WIDTH = 768;

/**
 * Le temps écoulé est recalculé à chaque tick depuis un horodatage de départ,
 * jamais incrémenté tick par tick : `setInterval` dérive, et l'app mise en
 * arrière-plan cesse de ticker. Ainsi l'affichage reste juste au retour.
 */
export default function TimerScreen() {
  const navigation = useNavigation();
  const { colors, language } = useTheme();
  const t = useTranslation(language);
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const { width } = useWindowDimensions();
  const isTablet = width >= TABLET_MIN_WIDTH;

  const [mode, setMode] = useState<Mode>('stopwatch');
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  const [minutes, setMinutes] = useState(1);
  const [seconds, setSeconds] = useState(0);
  const [editedUnit, setEditedUnit] = useState<EditedUnit | null>(null);

  /** Temps déjà couru, conservé entre pause et reprise. */
  const accumulated = useRef(0);

  const player = useAudioPlayer(ALARM_SOUND);
  const alarm = useRef<{ beat?: ReturnType<typeof setInterval>; deadline?: ReturnType<typeof setTimeout> }>({});

  const stopAlarm = useCallback(() => {
    if (alarm.current.beat) clearInterval(alarm.current.beat);
    if (alarm.current.deadline) clearTimeout(alarm.current.deadline);
    alarm.current = {};
    Vibration.cancel();
    player.pause();
  }, [player]);

  const targetMs = (minutes * 60 + seconds) * 1000;
  const remaining = Math.max(0, targetMs - elapsed);
  const isFinished = mode === 'countdown' && targetMs > 0 && remaining === 0 && elapsed > 0;

  useEffect(() => {
    navigation.setOptions({ headerTitle: t.timerTitle });
  }, [navigation, t.timerTitle]);

  // Une alarme doit s'entendre même si le téléphone est en silencieux.
  useEffect(() => {
    setAudioModeAsync({ playsInSilentMode: true }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!isFinished) return;

    const ring = () => {
      player.seekTo(0);
      player.play();
      Vibration.vibrate(ALARM_VIBRATION_MS);
    };

    ring();
    alarm.current.beat = setInterval(ring, ALARM_PERIOD_MS);
    alarm.current.deadline = setTimeout(stopAlarm, ALARM_DURATION_MS);

    return stopAlarm;
  }, [isFinished, player, stopAlarm]);

  useEffect(() => {
    if (!running) return;

    const startedAt = Date.now() - accumulated.current;
    const id = setInterval(() => {
      const next = Date.now() - startedAt;

      if (mode === 'countdown' && next >= targetMs) {
        accumulated.current = targetMs;
        setElapsed(targetMs);
        setRunning(false);
        return;
      }

      accumulated.current = next;
      setElapsed(next);
    }, TICK_MS);

    return () => clearInterval(id);
  }, [running, mode, targetMs]);

  const reset = () => {
    stopAlarm();
    setRunning(false);
    accumulated.current = 0;
    setElapsed(0);
  };

  const switchMode = (next: Mode) => {
    if (next === mode) return;
    reset();
    setMode(next);
  };

  /** Le minuteur n'a rien à décompter tant qu'aucune durée n'est réglée. */
  const canStart = mode === 'stopwatch' || (targetMs > 0 && !isFinished);
  const isEditingDuration = mode === 'countdown' && !running && elapsed === 0;
  const canReset = elapsed > 0 || running;

  const displayMs = mode === 'stopwatch' ? elapsed : remaining;
  const primaryLabel = running ? t.timerPause : elapsed > 0 ? t.timerResume : t.timerStart;

  return (
    // Un toucher n'importe où sur l'écran coupe la sonnerie : c'est « l'action
    // sur l'écran » qui l'arrête avant les 10 s.
    <View style={styles.root} onTouchStart={stopAlarm}>
      {/*
        Défilement : sur un écran court (petit téléphone, ou tablette en
        paysage), le bloc dépasse et les boutons se retrouvaient coupés.
        `flexGrow: 1` garde le contenu centré tant qu'il tient à l'écran.
      */}
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.modeSwitch}>
          {(['stopwatch', 'countdown'] as Mode[]).map((value) => {
            const selected = mode === value;
            return (
              <Pressable
                key={value}
                onPress={() => switchMode(value)}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                style={[styles.modeOption, selected && styles.modeOptionSelected]}
              >
                <Text style={[styles.modeLabel, selected && styles.modeLabelSelected]}>
                  {value === 'stopwatch' ? t.timerStopwatch : t.timerCountdown}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.centerBlock}>
          <View style={styles.display}>
            {isEditingDuration ? (
              <View style={styles.durationRow}>
                <DurationField
                  value={minutes}
                  label={t.timerMinutesLabel}
                  styles={styles}
                  onPress={() => setEditedUnit('minutes')}
                />
                <Text style={styles.durationSeparator}>:</Text>
                <DurationField
                  value={seconds}
                  label={t.timerSecondsLabel}
                  styles={styles}
                  onPress={() => setEditedUnit('seconds')}
                />
              </View>
            ) : (
              <Text
                style={[styles.time, isTablet && styles.timeTablet]}
                numberOfLines={1}
                adjustsFontSizeToFit
                accessibilityLiveRegion="polite"
              >
                {formatClock(displayMs)}
                {mode === 'stopwatch' && (
                  <Text style={[styles.hundredths, isTablet && styles.hundredthsTablet]}>
                    ,{formatHundredths(displayMs)}
                  </Text>
                )}
              </Text>
            )}

            <Text style={styles.caption}>
              {isFinished ? t.timerDone : isEditingDuration ? t.timerSetDuration : ' '}
            </Text>
          </View>

          {isEditingDuration && (
            <View style={styles.presets}>
              {PRESETS_SEC.map((total) => (
                <Pressable
                  key={total}
                  onPress={() => {
                    setMinutes(Math.floor(total / 60));
                    setSeconds(total % 60);
                  }}
                  accessibilityRole="button"
                  style={({ pressed }) => [styles.preset, pressed && styles.presetPressed]}
                >
                  <Text style={styles.presetText}>{formatClock(total * 1000)}</Text>
                </Pressable>
              ))}
            </View>
          )}

          <Pressable
            onPress={() => setRunning((was) => !was)}
            disabled={!canStart}
            accessibilityRole="button"
            accessibilityLabel={primaryLabel}
            accessibilityState={{ disabled: !canStart }}
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
              !canStart && styles.buttonDisabled,
            ]}
          >
            <Text style={styles.buttonText}>{primaryLabel}</Text>
          </Pressable>

          <Pressable
            onPress={reset}
            disabled={!canReset}
            accessibilityRole="button"
            accessibilityLabel={t.timerReset}
            accessibilityState={{ disabled: !canReset }}
            style={({ pressed }) => [
              styles.resetButton,
              pressed && styles.buttonPressed,
              !canReset && styles.buttonDisabled,
            ]}
          >
            <Text style={styles.resetText}>{t.timerReset}</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/*
        Même feuille de saisie que les réglages de partie. Elle n'impose pas de
        plafond, donc la valeur validée est bornée ici à 59.
      */}
      <ScoreLimitModal
        visible={editedUnit !== null}
        currentValue={editedUnit === 'seconds' ? seconds : minutes}
        minValue={0}
        startEmpty
        title={editedUnit === 'seconds' ? t.timerSecondsLabel : t.timerMinutesLabel}
        subtitle={t.timerRange}
        unit={editedUnit === 'seconds' ? t.timerUnitSeconds : t.timerUnitMinutes}
        onClose={() => setEditedUnit(null)}
        onValidate={(value) => {
          const clamped = Math.min(MAX_UNIT, Math.max(0, value));
          if (editedUnit === 'seconds') setSeconds(clamped);
          else setMinutes(clamped);
        }}
      />
    </View>
  );
}

/** Valeur `MM` ou `SS`, ouvre la feuille de saisie au toucher. */
function DurationField({
  value,
  label,
  onPress,
  styles,
}: {
  value: number;
  label: string;
  onPress: () => void;
  styles: ReturnType<typeof makeStyles>;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${label} : ${value}`}
      style={({ pressed }) => [styles.durationField, pressed && styles.durationFieldPressed]}
    >
      <Text style={styles.durationValue}>{pad(value)}</Text>
    </Pressable>
  );
}

const pad = (value: number) => String(value).padStart(2, '0');

function formatClock(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  return `${pad(Math.floor(totalSeconds / 60))}:${pad(totalSeconds % 60)}`;
}

function formatHundredths(ms: number): string {
  return pad(Math.floor((ms % 1000) / 10));
}

function makeStyles(c: ReturnType<typeof useTheme>['colors']) {
  return StyleSheet.create({
    root: {
      flex: 1,
    },
    container: {
      flex: 1,
      backgroundColor: c.background,
    },
    scrollContent: {
      flexGrow: 1,
      alignItems: 'center',
      paddingHorizontal: S.lg,
      paddingTop: 32,
      paddingBottom: S['3xl'],
    },
    /** Absorbe la hauteur restante pour centrer le bloc principal. */
    centerBlock: {
      flex: 1,
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    modeSwitch: {
      flexDirection: 'row',
      backgroundColor: c.surfaceAlt,
      borderRadius: R.full,
      padding: S.xs,
    },
    modeOption: {
      paddingVertical: S.sm,
      paddingHorizontal: S.lg,
      borderRadius: R.full,
    },
    modeOptionSelected: {
      backgroundColor: c.card,
    },
    modeLabel: {
      fontSize: FS.sm,
      fontWeight: FW.semibold,
      color: c.textMuted,
    },
    modeLabelSelected: {
      color: c.text,
    },
    display: {
      alignItems: 'center',
    },
    /** Lisible à distance de table : le temps est toujours affiché en très gros. */
    time: {
      fontSize: 100,
      lineHeight: 112,
      fontWeight: FW.extrabold,
      color: c.text,
      letterSpacing: LS.tight,
      fontVariant: ['tabular-nums'],
    },
    timeTablet: {
      fontSize: 250,
      lineHeight: 280,
    },
    hundredths: {
      fontSize: 34,
      fontWeight: FW.bold,
      color: c.textMuted,
    },
    hundredthsTablet: {
      fontSize: 84,
    },
    caption: {
      marginTop: S.sm,
      minHeight: 20,
      fontSize: FS.sm,
      fontWeight: FW.semibold,
      color: c.textMuted,
    },
    durationRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    durationField: {
      minWidth: 92,
      paddingVertical: S.sm,
      paddingHorizontal: S.base,
      backgroundColor: c.card,
      borderRadius: R.lg,
      borderWidth: 1,
      borderColor: c.border,
      alignItems: 'center',
    },
    durationFieldPressed: {
      borderColor: c.primary,
    },
    durationValue: {
      fontSize: FS.display,
      fontWeight: FW.extrabold,
      color: c.text,
      fontVariant: ['tabular-nums'],
    },
    durationSeparator: {
      marginHorizontal: S.sm,
      fontSize: FS.display,
      fontWeight: FW.extrabold,
      color: c.text,
    },
    presets: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: S.sm,
      marginTop: S.lg,
    },
    preset: {
      paddingVertical: S.sm,
      paddingHorizontal: S.base,
      borderRadius: R.full,
      backgroundColor: c.primarySubtle,
    },
    presetPressed: {
      opacity: 0.7,
    },
    presetText: {
      fontSize: FS.sm,
      fontWeight: FW.bold,
      color: c.primary,
      fontVariant: ['tabular-nums'],
    },
    button: {
      marginTop: 32,
      // Plafonné : pleine largeur sur téléphone, jamais démesuré sur tablette.
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
    resetButton: {
      marginTop: S.md,
      width: '100%',
      maxWidth: 400,
      paddingVertical: S.md,
      alignItems: 'center',
      justifyContent: 'center',
    },
    resetText: {
      color: c.textMuted,
      fontSize: FS.sm,
      fontWeight: FW.semibold,
    },
  });
}
