import { useMemo } from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { makeSharedStyles } from '../theme/styles';

type Props = {
  iconName: string;
  iconBg: string;
  iconColor: string;
  label: string;
  value: string;
  showDivider?: boolean;
};

export default function InfoRow({ iconName, iconBg, iconColor, label, value, showDivider = false }: Props) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeSharedStyles(colors), [colors]);

  return (
    <>
      {showDivider && <View style={styles.infoRowDivider} />}
      <View style={styles.infoRow}>
        <View style={[styles.iconBoxPrimary, { backgroundColor: iconBg }]}>
          <Ionicons name={iconName as any} size={16} color={iconColor} />
        </View>
        <Text style={[styles.body, { flex: 1 }]}>{label}</Text>
        <Text style={styles.itemTitle}>{value}</Text>
      </View>
    </>
  );
}
