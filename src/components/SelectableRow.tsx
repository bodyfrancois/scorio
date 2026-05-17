import { useMemo, ReactNode } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { makeSharedStyles } from '../theme/styles';

type Props = {
  icon: ReactNode;
  label: string;
  selected: boolean;
  onPress: () => void;
};

export default function SelectableRow({ icon, label, selected, onPress }: Props) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeSharedStyles(colors), [colors]);

  return (
    <Pressable
      style={({ pressed }) => [styles.listRow, pressed && styles.pressed]}
      onPress={onPress}
    >
      <View style={[styles.iconBoxSm, { marginRight: 12 }]}>{icon}</View>
      <Text style={[styles.body, selected && { color: colors.primary, fontWeight: '600' }]}>
        {label}
      </Text>
      {selected && (
        <Ionicons name="checkmark" size={18} color={colors.primary} style={{ marginLeft: 8 }} />
      )}
    </Pressable>
  );
}
