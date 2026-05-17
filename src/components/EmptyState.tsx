import { useMemo } from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { makeSharedStyles } from '../theme/styles';

type Props = {
  iconName: string;
  heading: string;
  description: string;
};

export default function EmptyState({ iconName, heading, description }: Props) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeSharedStyles(colors), [colors]);

  return (
    <View style={styles.emptyWrap}>
      <View style={styles.iconBoxLg}>
        <Ionicons name={iconName as any} size={36} color={colors.primary} />
      </View>
      <Text style={[styles.subheading, { marginBottom: 8, textAlign: 'center' }]}>{heading}</Text>
      <Text style={[styles.muted, { textAlign: 'center', lineHeight: 20 }]}>{description}</Text>
    </View>
  );
}
