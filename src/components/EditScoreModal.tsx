import { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  Pressable,
  Modal,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { useTranslation } from '../i18n';
import { lightColors } from '../theme/colors';
import { makeSharedStyles } from '../theme/styles';
import { QuickAction } from '../core/types';

type Props = {
  visible: boolean;
  playerName: string;
  roundNumber: number;
  playerIndex?: number;
  quickActions?: QuickAction[];
  roundTotal?: number;
  currentRoundBases?: (number | null)[];
  onClose: () => void;
  onValidate: (total: number, base: number) => void;
};

const PAD_ROWS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['⌫', '0', null],
];

const makeStyles = (c: typeof lightColors) => ({
  ...makeSharedStyles(c),
  ...StyleSheet.create({
    roundLabel: {
      fontSize: 13,
      fontWeight: '700',
      color: c.primary,
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: 6,
    },
    subtitle: {
      fontSize: 16,
      color: c.textSecondary,
      marginBottom: 20,
    },
    playerHighlight: {
      fontWeight: '700',
      color: c.text,
    },
    display: {
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 8,
      paddingVertical: 12,
      backgroundColor: c.background,
      borderRadius: 16,
    },
    displayError: {
      backgroundColor: c.errorSubtle,
    },
    displayValue: {
      fontSize: 40,
      fontWeight: '800',
      color: c.text,
      letterSpacing: -1,
    },
    displayPlaceholder: {
      color: c.textMuted,
    },
    displayBreakdown: {
      fontSize: 12,
      color: c.textMuted,
      marginTop: 2,
    },
    remainingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      justifyContent: 'center',
      marginBottom: 12,
    },
    remainingRowError: {},
    remainingText: {
      fontSize: 12,
      color: c.textMuted,
    },
    remainingTextError: {
      color: c.danger,
      fontWeight: '600',
    },
    quickActionsSection: {
      marginBottom: 16,
    },
    quickActionsLabel: {
      fontSize: 11,
      fontWeight: '700',
      color: c.textMuted,
      letterSpacing: 1,
      marginBottom: 8,
    },
    quickActionsRow: {
      gap: 8,
      flexDirection: 'row',
    },
    chip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: c.background,
      borderWidth: 1,
      borderColor: c.border,
    },
    keypad: {
      gap: 8,
      marginBottom: 20,
    },
    key: {
      flex: 1,
      height: 56,
      backgroundColor: c.card,
      borderRadius: 16,
      shadowColor: c.shadowCard,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.05,
      shadowRadius: 0,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: c.borderSubtle,
    },
    chipActive: {
      backgroundColor: c.primarySubtle,
      borderColor: c.primary,
    },
    chipLabel: {
      fontSize: 13,
      fontWeight: '600',
      color: c.textSecondary,
    },
    chipLabelActive: {
      color: c.primary,
    },
    chipValue: {
      fontSize: 12,
      fontWeight: '700',
      color: c.textMuted,
    },
    chipValueActive: {
      color: c.primary,
    },
  }),
});

export default function EditScoreModal({
  visible,
  playerName,
  roundNumber,
  playerIndex,
  quickActions,
  roundTotal,
  currentRoundBases,
  onClose,
  onValidate,
}: Props) {
  const { colors, language } = useTheme();
  const t = useTranslation(language);
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const [input, setInput] = useState('');
  const [activeActions, setActiveActions] = useState<Set<number>>(new Set());

  const remaining = (() => {
    if (roundTotal == null || playerIndex == null || !currentRoundBases) return null;
    const othersSum = currentRoundBases.reduce<number>((sum, v, i) => {
      if (i === playerIndex || v === null) return sum + 0;
      return sum + v;
    }, 0);
    // Capot: l'équipe adverse a marqué plus que le total — l'équipe courante marque 0
    if (othersSum > roundTotal) return 0;
    return roundTotal - othersSum;
  })();

  const isLastPlayer =
    remaining !== null &&
    currentRoundBases != null &&
    currentRoundBases.every((v, i) => i === playerIndex || v !== null);

  useEffect(() => {
    if (!visible) return;
    setActiveActions(new Set());
    if (isLastPlayer && remaining != null && remaining >= 0) {
      setInput(String(remaining));
    } else {
      setInput('');
    }
  }, [visible]);

  const actionsTotal = Array.from(activeActions).reduce((sum, i) => {
    const action = quickActions?.[i];
    if (!action) return sum;
    // Capot : la base est déjà forcée à roundTotal → le bonus effectif = value - roundTotal
    if (action.isCapot && roundTotal != null) return sum + (action.value - roundTotal);
    return sum + action.value;
  }, 0);
  const keypadValue = parseInt(input, 10) || 0;
  const total = keypadValue + actionsTotal;
  const hasValue = input.length > 0 || activeActions.size > 0;

  const isOver = remaining !== null && keypadValue > remaining;
  const isValid = hasValue && !isOver;

  const pressKey = (key: string) => {
    if (input.length >= 4) return;
    setInput((prev) => prev + key);
  };

  const backspace = () => setInput((prev) => prev.slice(0, -1));

  const toggleAction = (index: number) => {
    const action = quickActions?.[index];
    setActiveActions((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
        // Si capot désactivé, effacer la base auto-remplie
        if (action?.isCapot) setInput('');
      } else {
        next.add(index);
        // Capot : forcer la base à roundTotal (162) pour que l'équipe adverse voie remaining=0
        if (action?.isCapot && roundTotal != null) setInput(String(roundTotal));
      }
      return next;
    });
  };

  const validate = () => {
    if (!isValid) return;
    onValidate(total, keypadValue);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.sheet}>

          <Text style={styles.roundLabel}>{t.round} {roundNumber}</Text>
          <Text style={styles.subtitle}>
            {t.enterScore}{' '}
            <Text style={styles.playerHighlight}>{playerName}</Text>
          </Text>

          <View style={[styles.display, isOver && styles.displayError]}>
            <Text style={[styles.displayValue, !hasValue && styles.displayPlaceholder]}>
              {hasValue ? total : '0'}
            </Text>
            {actionsTotal > 0 && input.length > 0 && (
              <Text style={styles.displayBreakdown}>
                {keypadValue} + {actionsTotal}
              </Text>
            )}
          </View>

          {remaining !== null && (
            <View style={[styles.remainingRow, isOver && styles.remainingRowError]}>
              <Ionicons
                name={isOver ? 'warning-outline' : 'flag-outline'}
                size={13}
                color={isOver ? colors.danger : colors.textMuted}
              />
              <Text style={[styles.remainingText, isOver && styles.remainingTextError]}>
                {isOver
                  ? `Dépassement de ${keypadValue - remaining} pts (max ${remaining})`
                  : isLastPlayer
                  ? `Score imposé : ${remaining} pts`
                  : `Points restants : ${remaining - keypadValue} pts`}
              </Text>
            </View>
          )}

          <View style={styles.keypad}>
            {PAD_ROWS.map((row, ri) => (
              <View key={ri} style={styles.keyRow}>
                {row.map((key, ci) => {
                  if (key === null) {
                    return <View key={ci} style={styles.keyEmpty} />;
                  }
                  if (key === '⌫') {
                    return (
                      <Pressable key={ci} style={({ pressed }) => [styles.key, pressed && styles.keyPressed]} onPress={backspace}>
                        <Ionicons name="backspace-outline" size={22} color={colors.textSecondary} />
                      </Pressable>
                    );
                  }
                  return (
                    <Pressable key={ci} style={({ pressed: p }) => [styles.key, p && styles.keyPressed]} onPress={() => pressKey(key)}>
                      <Text style={styles.keyText}>{key}</Text>
                    </Pressable>
                  );
                })}
              </View>
            ))}
          </View>

          {quickActions && quickActions.length > 0 && (
            <View style={styles.quickActionsSection}>
              <Text style={styles.quickActionsLabel}>{t.announceLabel}</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.quickActionsRow}
              >
                {quickActions.map((action, index) => {
                  const isActive = activeActions.has(index);
                  return (
                    <Pressable
                      key={index}
                      style={({ pressed }) => [styles.chip, isActive && styles.chipActive, pressed && styles.pressed]}
                      onPress={() => toggleAction(index)}
                    >
                      <Text style={[styles.chipLabel, isActive && styles.chipLabelActive]}>
                        {action.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>
          )}

          <View style={styles.buttons}>
            <Pressable
              style={({ pressed }) => [styles.btn, styles.btnPrimary, !isValid && styles.btnDisabled, pressed && isValid && styles.pressed]}
              onPress={validate}
              disabled={!isValid}
            >
              <Text style={styles.btnPrimaryText}>{t.validate}</Text>
            </Pressable>

            <Pressable style={({ pressed }) => [styles.btn, styles.btnSecondary, pressed && styles.pressed]} onPress={onClose}>
              <Text style={styles.btnSecondaryText}>{t.cancel}</Text>
            </Pressable>
          </View>

        </View>
      </View>
    </Modal>
  );
}
