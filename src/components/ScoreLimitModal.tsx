import { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  Pressable,
  Modal,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { useTranslation } from '../i18n';
import { makeScoreLimitModalStyles } from '../theme/styles';
import NumericKeypad from './NumericKeypad';

type Props = {
  visible: boolean;
  currentValue: number;
  onClose: () => void;
  onValidate: (value: number) => void;
  title?: string;
  subtitle?: string;
  unit?: string;
  minValue?: number;
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
}: Props) {
  const { colors, language } = useTheme();
  const t = useTranslation(language);
  const styles = useMemo(() => makeScoreLimitModalStyles(colors), [colors]);

  const title = titleProp ?? t.scoreLimitTitle;
  const subtitle = subtitleProp ?? t.scoreLimitSubtitle;
  const unit = unitProp ?? 'pts';

  const [input, setInput] = useState(String(currentValue));

  useEffect(() => {
    if (visible) setInput(String(currentValue));
  }, [visible, currentValue]);

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
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.sheet}>

          <Text style={[styles.labelPrimary, { marginBottom: 6 }]}>{title}</Text>
          <Text style={[styles.bodySecondary, { marginBottom: 20 }]}>{subtitle}</Text>

          <View style={styles.display}>
            <Text style={[styles.displayValue, !input && styles.displayPlaceholder]}>
              {displayValue}
            </Text>
            <Text style={styles.displayUnit}>{unit}</Text>
          </View>

          <NumericKeypad onKeyPress={pressKey} onBackspace={backspace} />

          <View style={styles.buttons}>
            <Pressable
              style={({ pressed }) => [styles.btn, styles.btnPrimary, !isValid && styles.btnDisabled, pressed && isValid && styles.pressed]}
              onPress={validate}
              disabled={!isValid}
            >
              <Text style={styles.btnPrimaryText}>{t.validate}</Text>
            </Pressable>

            <Pressable style={({ pressed }) => [styles.btn, styles.btnSecondary, pressed && styles.pressed]} onPress={cancel}>
              <Text style={styles.btnSecondaryText}>{t.cancel}</Text>
            </Pressable>
          </View>

        </View>
      </View>
    </Modal>
  );
}
