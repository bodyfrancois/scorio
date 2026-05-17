import { useMemo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { makeSharedStyles } from '../theme/styles';

const PAD_ROWS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['⌫', '0', null],
];

type Props = {
  onKeyPress: (key: string) => void;
  onBackspace: () => void;
};

export default function NumericKeypad({ onKeyPress, onBackspace }: Props) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeSharedStyles(colors), [colors]);

  return (
    <View style={styles.keypadModal}>
      {PAD_ROWS.map((row, ri) => (
        <View key={ri} style={styles.keyRow}>
          {row.map((key, ci) => {
            if (key === null) {
              return <View key={ci} style={styles.keyEmpty} />;
            }
            if (key === '⌫') {
              return (
                <Pressable
                  key={ci}
                  style={({ pressed }) => [styles.keyCard, pressed && styles.keyPressed]}
                  onPress={onBackspace}
                >
                  <Ionicons name="backspace-outline" size={22} color={colors.textSecondary} />
                </Pressable>
              );
            }
            return (
              <Pressable
                key={ci}
                style={({ pressed }) => [styles.keyCard, pressed && styles.keyPressed]}
                onPress={() => onKeyPress(key)}
              >
                <Text style={styles.keyText}>{key}</Text>
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
}
