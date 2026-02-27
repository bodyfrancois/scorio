import {
  View,
  Text,
  Modal,
  Pressable,
  StyleSheet,
} from 'react-native';
import { colors } from '../theme/colors';

type RankingItem = {
  name: string;
  score: number;
};

type Props = {
  visible: boolean;
  ranking: RankingItem[];
  onReplay: () => void;
  onHome: () => void;
};

export default function EndGameModal({
  visible,
  ranking,
  onReplay,
  onHome,
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>🏁 Fin de partie</Text>

          {/* Classement */}
          <View style={styles.ranking}>
            {ranking.map((player, index) => (
              <Text key={player.name} style={styles.rankItem}>
                {index + 1}. {player.name} — {player.score}
              </Text>
            ))}
          </View>

          {/* Actions */}
          <Pressable style={styles.replayButton} onPress={onReplay}>
            <Text style={styles.replayText}>Rejouer une partie</Text>
          </Pressable>

          <Pressable style={styles.homeButton} onPress={onHome}>
            <Text style={styles.homeText}>Quitter le jeu</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
    color: colors.text,
    textAlign: 'center',
  },
  ranking: {
    marginBottom: 24,
  },
  rankItem: {
    fontSize: 16,
    marginBottom: 8,
    color: colors.text,
  },
  replayButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  replayText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  homeButton: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  homeText: {
    color: '#6B7280',
    fontSize: 16,
  },
});
