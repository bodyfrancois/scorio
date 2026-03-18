import { useState, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  Modal,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { colors } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';
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

export default function UnoScoreModal({
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
  const [input, setInput] = useState('');
  const [activeActions, setActiveActions] = useState<Set<number>>(new Set());

  /* ---- calcul des points restants ---- */
  const remaining = (() => {
    if (roundTotal == null || playerIndex == null || !currentRoundBases) return null;
    const othersSum = currentRoundBases.reduce<number>((sum, v, i) => {
      if (i === playerIndex || v === null) return sum + 0;
      return sum + v;
    }, 0);
    return roundTotal - othersSum;
  })();

  const isLastPlayer =
    remaining !== null &&
    currentRoundBases != null &&
    currentRoundBases.every((v, i) => i === playerIndex || v !== null);

  /* ---- reset + auto-fill à l'ouverture ---- */
  useEffect(() => {
    if (!visible) return;
    setActiveActions(new Set());
    if (isLastPlayer && remaining != null && remaining >= 0) {
      setInput(String(remaining));
    } else {
      setInput('');
    }
  }, [visible]);

  /* ---- dérivés ---- */
  const actionsTotal = Array.from(activeActions).reduce(
    (sum, i) => sum + (quickActions?.[i]?.value ?? 0),
    0
  );
  const keypadValue = parseInt(input, 10) || 0;
  const total = keypadValue + actionsTotal;
  const hasValue = input.length > 0 || activeActions.size > 0;

  const isOver = remaining !== null && keypadValue > remaining;
  const isValid = hasValue && !isOver;

  /* ---- keypad ---- */
  const pressKey = (key: string) => {
    if (input.length >= 4) return;
    setInput((prev) => prev + key);
  };

  const backspace = () => setInput((prev) => prev.slice(0, -1));

  const toggleAction = (index: number) => {
    setActiveActions((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const validate = () => {
    if (!isValid) return;
    onValidate(total, keypadValue);
    onClose();
  };

  const cancel = () => {
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.sheet}>

          {/* En-tête */}
          <Text style={styles.roundLabel}>Manche {roundNumber}</Text>
          <Text style={styles.subtitle}>
            Saisissez le score de{' '}
            <Text style={styles.playerHighlight}>{playerName}</Text>
          </Text>

          {/* Affichage total */}
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

          {/* Indicateur points restants */}
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

          {/* Pavé numérique */}
          <View style={styles.keypad}>
            {PAD_ROWS.map((row, ri) => (
              <View key={ri} style={styles.keyRow}>
                {row.map((key, ci) => {
                  if (key === null) {
                    return <View key={ci} style={styles.keyEmpty} />;
                  }
                  if (key === '⌫') {
                    return (
                      <Pressable key={ci} style={styles.key} onPress={backspace}>
                        <Ionicons name="backspace-outline" size={22} color={colors.textSecondary} />
                      </Pressable>
                    );
                  }
                  return (
                    <Pressable key={ci} style={styles.key} onPress={() => pressKey(key)}>
                      <Text style={styles.keyText}>{key}</Text>
                    </Pressable>
                  );
                })}
              </View>
            ))}
          </View>

        
          {/* Actions rapides */}
          {quickActions && quickActions.length > 0 && (
            <View style={styles.quickActionsSection}>
              <Text style={styles.quickActionsLabel}>Annonces</Text>
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
                      style={[styles.chip, isActive && styles.chipActive]}
                      onPress={() => toggleAction(index)}
                    >
                      <Text style={[styles.chipLabel, isActive && styles.chipLabelActive]}>
                        {action.label}
                      </Text>
                      <Text style={[styles.chipValue, isActive && styles.chipValueActive]}>
                        +{action.value}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>
          )}

          {/* Boutons Valider / Annuler */}
          <View style={styles.buttons}>
            <Pressable
              style={[styles.btn, styles.btnPrimary, !isValid && styles.btnDisabled]}
              onPress={validate}
              disabled={!isValid}
            >
              <Text style={styles.btnPrimaryText}>Valider</Text>
            </Pressable>

            <Pressable style={[styles.btn, styles.btnSecondary]} onPress={cancel}>
              <Text style={styles.btnSecondaryText}>Annuler</Text>
            </Pressable>
          </View>

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 40,
  },

  /* En-tête */
  roundLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 20,
  },
  playerHighlight: {
    fontWeight: '700',
    color: colors.text,
  },

  /* Affichage */
  display: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    paddingVertical: 12,
    backgroundColor: colors.background,
    borderRadius: 16,
  },
  displayError: {
    backgroundColor: '#FEF2F2',
  },
  displayValue: {
    fontSize: 40,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -1,
  },
  displayPlaceholder: {
    color: colors.textMuted,
  },
  displayBreakdown: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },

  /* Indicateur points restants */
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
    color: colors.textMuted,
  },
  remainingTextError: {
    color: colors.danger,
    fontWeight: '600',
  },

  /* Pavé numérique */
  keypad: {
    gap: 8,
    marginBottom: 16,
  },
  keyRow: {
    flexDirection: 'row',
    gap: 8,
  },
  key: {
    flex: 1,
    height: 56,
    backgroundColor: colors.background,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyEmpty: {
    flex: 1,
  },
  keyText: {
    fontSize: 22,
    fontWeight: '500',
    color: colors.text,
  },

  /* Actions rapides */
  quickActionsSection: {
    marginBottom: 16,
  },
  quickActionsLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
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
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: colors.primarySubtle,
    borderColor: colors.primary,
  },
  chipLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  chipLabelActive: {
    color: colors.primary,
  },
  chipValue: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textMuted,
  },
  chipValueActive: {
    color: colors.primary,
  },

  /* Boutons */
  buttons: {
    flexDirection: 'row',
    gap: 12,
  },
  btn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  btnPrimary: {
    backgroundColor: colors.primary,
  },
  btnDisabled: {
    backgroundColor: colors.searchBackground,
  },
  btnPrimaryText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  btnSecondary: {
    backgroundColor: colors.searchBackground,
  },
  btnSecondaryText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
  },
});
