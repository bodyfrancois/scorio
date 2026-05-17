import { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  Pressable,
  Modal,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { useTranslation } from '../i18n';
import { makeEditScoreModalStyles } from '../theme/styles';
import { QuickAction } from '../core/types';
import NumericKeypad from './NumericKeypad';

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
  const styles = useMemo(() => makeEditScoreModalStyles(colors), [colors]);

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

          <Text style={[styles.labelPrimary, { marginBottom: 6 }]}>{t.round} {roundNumber}</Text>
          <Text style={[styles.bodySecondary, { marginBottom: 20 }]}>
            {t.enterScore}{' '}
            <Text style={styles.playerHighlight}>{playerName}</Text>
          </Text>

          <View style={[styles.display, isOver && styles.displayError]}>
            <Text style={[styles.displayValue, !hasValue && styles.displayPlaceholder]}>
              {hasValue ? total : '0'}
            </Text>
            {actionsTotal > 0 && input.length > 0 && (
              <Text style={[styles.muted, { marginTop: 2 }]}>
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
              <Text style={[styles.muted, isOver && styles.remainingTextError]}>
                {isOver
                  ? `Dépassement de ${keypadValue - remaining} pts (max ${remaining})`
                  : isLastPlayer
                  ? `Score imposé : ${remaining} pts`
                  : `Points restants : ${remaining - keypadValue} pts`}
              </Text>
            </View>
          )}

          <NumericKeypad onKeyPress={pressKey} onBackspace={backspace} />

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
