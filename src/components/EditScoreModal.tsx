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
  scoreMin?: number;
  scoreMax?: number;
  scoreStep?: number;
  scoreInputMode?: 'keypad' | 'stepper';
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
  scoreMin,
  scoreMax,
  scoreInputMode = 'keypad',
  scoreStep = 1,
  currentRoundBases,
  onClose,
  onValidate,
}: Props) {
  const { colors, language } = useTheme();
  const t = useTranslation(language);
  const styles = useMemo(() => makeEditScoreModalStyles(colors), [colors]);

  const [input, setInput] = useState('');
  const [stepperValue, setStepperValue] = useState(scoreMin ?? 0);
  const [actionCounts, setActionCounts] = useState<Map<number, number>>(new Map());

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
    setActionCounts(new Map());
    if (scoreInputMode === 'stepper') {
      setStepperValue(scoreMin ?? 0);
    } else if (isLastPlayer && remaining != null && remaining >= 0) {
      setInput(String(remaining));
    } else {
      setInput('');
    }
  }, [visible]);

  const actionsTotal = Array.from(actionCounts.entries()).reduce((sum, [i, count]) => {
    if (count === 0) return sum;
    const action = quickActions?.[i];
    if (!action) return sum;
    // Capot : la base est déjà forcée à roundTotal → le bonus effectif = value - roundTotal
    if (action.isCapot && roundTotal != null) return sum + (action.value - roundTotal);
    return sum + action.value * count;
  }, 0);
  const keypadValue = scoreInputMode === 'stepper' ? stepperValue : (parseInt(input, 10) || 0);
  const total = keypadValue + actionsTotal;
  const hasValue = scoreInputMode === 'stepper' ? true : (input.length > 0 || Array.from(actionCounts.values()).some(c => c > 0));

  const isOver = remaining !== null && keypadValue > remaining;
  const isBelowMin = scoreMin !== undefined && total < scoreMin;
  const isAboveMax = scoreMax !== undefined && total > scoreMax;
  const isValid = hasValue && !isOver && !isBelowMin && !isAboveMax;

  const pressKey = (key: string) => {
    if (input.length >= 4) return;
    setInput((prev) => prev + key);
  };

  const backspace = () => setInput((prev) => prev.slice(0, -1));

  const incrementAction = (index: number) => {
    const action = quickActions?.[index];
    const maxCount = action?.maxCount ?? 1;
    setActionCounts((prev) => {
      const next = new Map(prev);
      const current = next.get(index) ?? 0;
      if (current >= maxCount) {
        next.delete(index);
        if (action?.isCapot) setInput('');
      } else {
        next.set(index, current + 1);
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

          <View style={[styles.display, (isOver || isAboveMax || isBelowMin) && styles.displayError]}>
            <Text style={[styles.displayValue, !hasValue && styles.displayPlaceholder]}>
              {hasValue ? total : '0'}
            </Text>
            {actionsTotal > 0 && input.length > 0 && (
              <Text style={[styles.muted, { marginTop: 2 }]}>
                {keypadValue} + {actionsTotal}
              </Text>
            )}
          </View>

          {(remaining !== null || isAboveMax || isBelowMin) && (
            <View style={[styles.remainingRow, (isOver || isAboveMax || isBelowMin) && styles.remainingRowError]}>
              <Ionicons
                name={(isOver || isAboveMax || isBelowMin) ? 'warning-outline' : 'flag-outline'}
                size={13}
                color={(isOver || isAboveMax || isBelowMin) ? colors.danger : colors.textMuted}
              />
              <Text style={[styles.muted, (isOver || isAboveMax || isBelowMin) && styles.remainingTextError]}>
                {isAboveMax
                  ? `Valeur max : ${scoreMax}`
                  : isBelowMin
                  ? `Valeur min : ${scoreMin}`
                  : isOver
                  ? `Dépassement de ${keypadValue - remaining!} pts (max ${remaining})`
                  : isLastPlayer
                  ? `Score imposé : ${remaining} pts`
                  : `Points restants : ${remaining! - keypadValue} pts`}
              </Text>
            </View>
          )}

          {scoreInputMode === 'stepper' ? (
            <View style={styles.stepperContainer}>
              <Pressable
                style={({ pressed }) => [styles.stepperBtn, pressed && styles.stepperBtnPressed, (scoreMin !== undefined && stepperValue <= scoreMin) && styles.stepperBtnDisabled]}
                onPress={() => setStepperValue(v => scoreMin !== undefined ? Math.max(scoreMin, v - scoreStep) : v - scoreStep)}
                disabled={scoreMin !== undefined && stepperValue <= scoreMin}
              >
                <Ionicons name="remove" size={48} color={(scoreMin !== undefined && stepperValue <= scoreMin) ? colors.textMuted : colors.text} />
              </Pressable>
              <Pressable
                style={({ pressed }) => [styles.stepperBtn, pressed && styles.stepperBtnPressed, (scoreMax !== undefined && stepperValue >= scoreMax) && styles.stepperBtnDisabled]}
                onPress={() => setStepperValue(v => scoreMax !== undefined ? Math.min(scoreMax, v + scoreStep) : v + scoreStep)}
                disabled={scoreMax !== undefined && stepperValue >= scoreMax}
              >
                <Ionicons name="add" size={48} color={(scoreMax !== undefined && stepperValue >= scoreMax) ? colors.textMuted : colors.text} />
              </Pressable>
            </View>
          ) : (
            <NumericKeypad onKeyPress={pressKey} onBackspace={backspace} />
          )}

          {quickActions && quickActions.length > 0 && (
            <View style={styles.quickActionsSection}>
              <Text style={styles.quickActionsLabel}>{t.announceLabel}</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.quickActionsRow}
              >
                {quickActions.map((action, index) => {
                  const count = actionCounts.get(index) ?? 0;
                  const isActive = count > 0;
                  return (
                    <Pressable
                      key={index}
                      style={({ pressed }) => [styles.chip, isActive && styles.chipActive, pressed && styles.pressed]}
                      onPress={() => incrementAction(index)}
                    >
                      <Text style={[styles.chipLabel, isActive && styles.chipLabelActive]}>
                        {action.label}{count > 1 ? ` ×${count}` : ''}
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
