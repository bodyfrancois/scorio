import { useState, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  Modal,
  StyleSheet,
} from 'react-native';
import { colors } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  visible: boolean;
  currentValue: number;
  onClose: () => void;
  onValidate: (value: number) => void;
};

const PAD_ROWS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['⌫', '0', null],
];

export default function ScoreLimitModal({
  visible,
  currentValue,
  onClose,
  onValidate,
}: Props) {
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
    if (!isNaN(value) && value >= 50) {
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
  const isValid = !isNaN(parsedValue) && parsedValue >= 50;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.sheet}>

          {/* En-tête */}
          <Text style={styles.title}>Limite de score</Text>
          <Text style={styles.subtitle}>
            Points requis pour terminer la partie
          </Text>

          {/* Affichage */}
          <View style={styles.display}>
            <Text style={[styles.displayValue, !input && styles.displayPlaceholder]}>
              {displayValue}
            </Text>
            <Text style={styles.displayUnit}>pts</Text>
          </View>

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

          {/* Boutons */}
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

  title: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    marginBottom: 20,
  },

  display: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 16,
    paddingVertical: 12,
    backgroundColor: colors.background,
    borderRadius: 16,
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
  displayUnit: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textMuted,
    paddingBottom: 4,
  },

  keypad: {
    gap: 8,
    marginBottom: 20,
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
