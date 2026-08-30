import { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  Pressable,
  Modal,
  Animated,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { useTranslation } from '../i18n';
import { makeScoreLimitModalStyles } from '../theme/styles';
import NumericKeypad from './NumericKeypad';
import { useSheetAnimation } from '../hooks/useSheetAnimation';

type Props = {
  visible: boolean;
  currentValue: number;
  onClose: () => void;
  onValidate: (value: number) => void;
  title?: string;
  subtitle?: string;
  unit?: string;
  minValue?: number;
  /**
   * Ouvre la feuille avec un champ vide au lieu de la valeur courante.
   * Le pavé ajoute les chiffres à la suite : partir de la valeur oblige à tout
   * effacer avant de ressaisir, ce qui n'a de sens que pour une correction.
   */
  startEmpty?: boolean;
};


export default function ScoreLimitModal({
  visible,
  currentValue,
  onClose,
  onValidate,
  title: titleProp,
  subtitle: subtitleProp,
  unit: unitProp,
  minValue = 1,
  startEmpty = false,
}: Props) {
  const { colors, language } = useTheme();
  const t = useTranslation(language);
  const styles = useMemo(() => makeScoreLimitModalStyles(colors), [colors]);

  const title = titleProp ?? t.scoreLimitTitle;
  const subtitle = subtitleProp ?? t.scoreLimitSubtitle;
  const unit = unitProp ?? 'pts';

  const [input, setInput] = useState(startEmpty ? '' : String(currentValue));

  useEffect(() => {
    if (visible) setInput(startEmpty ? '' : String(currentValue));
  }, [visible, currentValue, startEmpty]);

  const { rendered, overlayStyle, sheetStyle } = useSheetAnimation(visible);

  const pressKey = (key: string) => {
    if (input.length >= 5) return;
    setInput((prev) => prev + key);
  };

  const backspace = () => setInput((prev) => prev.slice(0, -1));

  const validate = () => {
    const value = parseInt(input, 10);
    if (!isNaN(value) && value >= minValue) {
      onValidate(value);
      onClose();
    }
  };

  const cancel = () => {
    setInput(String(currentValue));
    onClose();
  };

  const displayValue = input || '0';
  const parsedValue = parseInt(input, 10);
  const isValid = !isNaN(parsedValue) && parsedValue >= minValue;

  return (
    <Modal visible={rendered} transparent animationType="none" onRequestClose={cancel}>
      <Animated.View style={[styles.overlay, StyleSheet.absoluteFillObject, overlayStyle]} />
      <View style={{ flex: 1, justifyContent: 'flex-end' }} pointerEvents="box-none">
        <Animated.View style={[styles.sheet, sheetStyle]}>

          <Text style={[styles.labelPrimary, { marginBottom: 6 }]} accessibilityRole="header">{title}</Text>
          <Text style={[styles.bodySecondary, { marginBottom: 20 }]}>{subtitle}</Text>

          <View style={styles.display}>
            <Text style={[styles.displayValue, !input && styles.displayPlaceholder]}>
              {displayValue}
            </Text>
            <Text style={styles.displayUnit}>{unit}</Text>
          </View>

          <NumericKeypad onKeyPress={pressKey} onBackspace={backspace} />

          <View style={styles.buttons}>
            <Pressable accessibilityRole="button"
              style={({ pressed }) => [styles.btn, styles.btnPrimary, !isValid && styles.btnDisabled, pressed && isValid && styles.pressed]}
              onPress={validate}
              disabled={!isValid}
            >
              <Text style={styles.btnPrimaryText}>{t.validate}</Text>
            </Pressable>

            <Pressable accessibilityRole="button" style={({ pressed }) => [styles.btn, styles.btnSecondary, pressed && styles.pressed]} onPress={cancel}>
              <Text style={styles.btnSecondaryText}>{t.cancel}</Text>
            </Pressable>
          </View>

        </Animated.View>
      </View>
    </Modal>
  );
}
