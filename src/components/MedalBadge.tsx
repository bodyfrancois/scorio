import { View, Text } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

export const MEDAL_COLORS = ['#F59E0B', '#94A3B8', '#CD7F32'];
export const MEDAL_BG_LIGHT = ['#FEF3C7', '#F1F5F9', '#FDF0E6'];
export const MEDAL_BG_DARK = ['#3B2A00', '#1E293B', '#2A1500'];

type Props = {
  rank: number; // 1-based
  size?: number;
};

export default function MedalBadge({ rank, size = 34 }: Props) {
  const { colors, isDark } = useTheme();
  const idx = rank - 1;
  const color = MEDAL_COLORS[idx] ?? colors.textMuted;
  const bg = (isDark ? MEDAL_BG_DARK : MEDAL_BG_LIGHT)[idx] ?? colors.surfaceAlt;
  const borderRadius = Math.round(size * 0.29);
  const fontSize = Math.round(size * 0.38);

  return (
    <View style={{ width: size, height: size, borderRadius, backgroundColor: bg, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize, fontWeight: '800', color }}>{rank}</Text>
    </View>
  );
}
