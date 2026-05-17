import { View, Text, ViewStyle } from 'react-native';

type Props = {
  name: string;
  color: string;
  size?: number;
  style?: ViewStyle;
  initials?: string;
};

export default function PlayerAvatar({ name, color, size = 40, style, initials: customInitials }: Props) {
  const initials = customInitials ?? (name.trim() ? name.trim().slice(0, 2).toUpperCase() : '—');
  const fontSize = Math.round(size * 0.35);

  return (
    <View
      style={[
        { width: size, height: size, borderRadius: size / 2, backgroundColor: color, alignItems: 'center', justifyContent: 'center' },
        style,
      ]}
    >
      <Text style={{ fontSize, fontWeight: '700', color: '#FFFFFF' }}>{initials}</Text>
    </View>
  );
}
