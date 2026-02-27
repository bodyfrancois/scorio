import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

type Props = {
  name: string;
  icon: string;
  minPlayers: number;
  maxPlayers: number;
  estimatedTime: string;
  onPress: () => void;
};

export default function GameCard({
  name,
  icon,
  minPlayers,
  maxPlayers,
  estimatedTime,
  onPress,
}: Props) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Text style={styles.icon}>{icon}</Text>

      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.meta}>
          {minPlayers}–{maxPlayers} joueurs • {estimatedTime}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: 32,
    marginRight: 16,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  meta: {
    marginTop: 4,
    color: '#6B7280',
  },
});
