import {
  View,
  Text,
  Modal,
  Pressable,
  StyleSheet,
} from 'react-native';
import { colors } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';

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
        <View style={styles.card}>

          {/* Header */}
          <Text style={styles.title}>Partie Terminée</Text>
          <Text style={styles.subtitle}>Voici le classement final</Text>

          {/* Classement */}
          <View style={styles.rankingList}>
            {ranking.map((player, index) => {
              const isWinner = index === 0;
              const isMuted = index >= 3;

              return (
                <View key={player.name} style={styles.rankContainer}>

                  {/* Badge numéro */}
                  <View style={[styles.badge, isWinner && styles.badgeGold]}>
                    <Text style={[styles.badgeText, isWinner && styles.badgeTextGold]}>
                      {index + 1}
                    </Text>
                  </View>

                  {/* Ligne joueur */}
                  <View style={[styles.rankRow, isWinner && styles.rankRowWinner]}>
                    {isWinner && (
                      <Ionicons name="trophy" size={28} color="#F59E0B" style={{ marginRight: 12 }} />
                    )}

                    <View style={styles.playerInfo}>
                      <Text style={[styles.playerName, isMuted && styles.playerNameMuted]}>
                        {player.name}
                      </Text>
                      {isWinner && (
                        <Text style={styles.winnerLabel}>VAINQUEUR</Text>
                      )}
                    </View>

                    <View style={styles.scoreInfo}>
                      <Text style={[
                        styles.score,
                        isWinner && styles.scoreWinner,
                        isMuted && styles.scoreMuted,
                      ]}>
                        {player.score}
                      </Text>
                      <Text style={styles.scoreUnit}>PTS</Text>
                    </View>
                  </View>

                </View>
              );
            })}
          </View>

          {/* Boutons */}
          <Pressable style={styles.homeBtn} onPress={onHome}>
            <Ionicons name="home" size={18} color="#FFFFFF" />
            <Text style={styles.homeBtnText}>Retour à l'accueil</Text>
          </Pressable>

          <Pressable style={styles.replayBtn} onPress={onReplay}>
            <Ionicons name="refresh" size={18} color={colors.primary} />
            <Text style={styles.replayBtnText}>Rejouer</Text>
          </Pressable>

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 24,
  },

  /* Header */
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: 24,
  },

  /* Classement */
  rankingList: {
    gap: 8,
    marginBottom: 24,
  },
  rankContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.searchBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeGold: {
    backgroundColor: '#F59E0B',
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  badgeTextGold: {
    color: '#FFFFFF',
  },
  rankRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  rankRowWinner: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1.5,
    borderColor: '#FCD34D',
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  playerNameMuted: {
    color: colors.textMuted,
    fontWeight: '500',
  },
  winnerLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 0.5,
    marginTop: 2,
  },
  scoreInfo: {
    alignItems: 'flex-end',
  },
  score: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  scoreWinner: {
    fontSize: 22,
    color: colors.primary,
  },
  scoreMuted: {
    color: colors.textMuted,
    fontWeight: '600',
  },
  scoreUnit: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textMuted,
    letterSpacing: 0.5,
  },

  /* Boutons */
  homeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    marginBottom: 10,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  homeBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  replayBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primarySubtle,
    borderRadius: 16,
    paddingVertical: 16,
  },
  replayBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
});
