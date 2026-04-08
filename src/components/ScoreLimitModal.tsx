import { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  Pressable,
  Modal,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { useTranslation } from '../i18n';
import { lightColors } from '../theme/colors';
import { makeSharedStyles } from '../theme/styles';

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

const PAD_ROWS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['⌫', '0', null],
];

const makeStyles = (c: typeof lightColors) => ({
  ...makeSharedStyles(c),
  ...StyleSheet.create({
    // keypad override : marginBottom différent du partagé
    keypad: {
      gap: 8,
      marginBottom: 20,
    },
    // key override : fond card + bordure au lieu de fond background
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
    title: {
      fontSize: 13,
      fontWeight: '700',
      color: c.primary,
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: 6,
    },
    subtitle: {
      fontSize: 15,
      color: c.textSecondary,
      marginBottom: 20,
    },
    display: {
      flexDirection: 'row',
      alignItems: 'baseline',
      justifyContent: 'center',
      gap: 6,
      marginBottom: 16,
      paddingVertical: 12,
      backgroundColor: c.background,
      borderRadius: 24,
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
    displayUnit: {
      fontSize: 16,
      fontWeight: '600',
      color: c.textMuted,
      paddingBottom: 4,
    },
  }),
});

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
  const styles = useMemo(() => makeStyles(colors), [colors]);

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

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>

          <View style={styles.display}>
            <Text style={[styles.displayValue, !input && styles.displayPlaceholder]}>
              {displayValue}
            </Text>
            <Text style={styles.displayUnit}>{unit}</Text>
          </View>

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
