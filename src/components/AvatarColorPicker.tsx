import { ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { AVATAR_PALETTE_KEYS, getAvatarColorByKey } from '../utils/avatarColors';

type Props = {
  selectedKey: string;
  onSelect: (key: string) => void;
};

export default function AvatarColorPicker({ selectedKey, onSelect }: Props) {
  const { colors } = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ flexDirection: 'row', gap: 10, paddingHorizontal: 4, marginBottom: 20 }}
    >
      {AVATAR_PALETTE_KEYS.map((key) => {
        const bg = getAvatarColorByKey(key as string, colors);
        const isSelected = key === selectedKey;
        return (
          <Pressable
            key={key}
            onPress={() => onSelect(key as string)}
            hitSlop={4}
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: bg,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: isSelected ? 2.5 : 0,
              borderColor: colors.text,
            }}
          >
            {isSelected && <Ionicons name="checkmark" size={18} color="#fff" />}
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
