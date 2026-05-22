import { View, Text } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

type Props = {
  rank: number; // 1-based
  size?: number;
};

export default function MedalBadge({ rank, size = 34 }: Props) {
  const { colors } = useTheme();
  const borderRadius = Math.round(size * 0.29);
  const fontSize = Math.round(size * 0.38);

  const rankColors: Record<number, { color: string; bg: string }> = {
    1: { color: colors.rank1Color, bg: colors.rank1Bg },
    2: { color: colors.rank2Color, bg: colors.rank2Bg },
    3: { color: colors.rank3Color, bg: colors.rank3Bg },
  };
  const { color, bg } = rankColors[rank] ?? { color: colors.textMuted, bg: colors.surfaceAlt };

  return (
    <View style={{ width: size, height: size, borderRadius, backgroundColor: bg, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize, fontWeight: '800', color }}>{rank}</Text>
    </View>
  );
}
