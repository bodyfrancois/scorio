import {
  View,
  Text,
  Modal,
  Pressable,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';
import IconStar from './icons/IconStar';
import IconCrown from './icons/IconCrown';
import IconReload from './icons/IconReload';
import IconHomeFill from './icons/IconHomeFill';

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
          <View style={styles.titleRow}>
            <IconStar size={22} color={colors.gold} />
            <Text style={styles.title}>Partie Terminée</Text>
            <IconStar size={22} color={colors.gold} />
          </View>
          <Text style={styles.subtitle}>Voici le classement final</Text>

          {/* Classement */}
          <View style={styles.rankingList}>
            {ranking.map((player, index) => {
              const isWinner = index === 0;

              if (isWinner) {
                return (
                  <LinearGradient
                    key={player.name}
                    colors={[colors.winnerGradientStart, colors.primary]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.winnerCard}
                  >
                    <View style={styles.winnerIconBox}>
                      <IconCrown size={22} color={colors.white} />
                    </View>
                    <View style={styles.winnerInfo}>
                      <Text style={styles.winnerName}>{player.name}</Text>
                      <Text style={styles.winnerLabel}>VAINQUEUR</Text>
                    </View>
                    <View style={styles.winnerScoreBox}>
                      <Text style={styles.winnerScore}>{player.score}</Text>
                      <Text style={styles.winnerUnit}>PTS</Text>
                    </View>
                  </LinearGradient>
                );
              }

              return (
                <View key={player.name} style={styles.rankRow}>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.playerName}>{player.name}</Text>
                  <View style={styles.scoreInfo}>
                    <Text style={styles.score}>{player.score}</Text>
                    <Text style={styles.scoreUnit}>PTS</Text>
                  </View>
                </View>
              );
            })}
          </View>

          {/* Boutons — Rejouer en primaire, accueil en secondaire */}
          <Pressable style={styles.replayBtn} onPress={onReplay}>
            <IconReload size={20} color={colors.white} />
            <Text style={styles.replayBtnText}>Rejouer</Text>
          </Pressable>

          <Pressable style={styles.homeBtn} onPress={onHome}>
            <IconHomeFill size={18} color={colors.primary} />
            <Text style={styles.homeBtnText}>Retour à l'accueil</Text>
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: 20,
  },

  /* Classement */
  rankingList: {
    gap: 8,
    marginBottom: 24,
  },

  /* Carte vainqueur */
  winnerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 4,
    borderColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 14,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 25 },
    shadowOpacity: 0.25,
    shadowRadius: 50,
    elevation: 12,
  },
  winnerIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  winnerInfo: {
    flex: 1,
  },
  winnerName: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.white,
  },
  winnerLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textOnDark,
    letterSpacing: 0.8,
    marginTop: 2,
  },
  winnerScoreBox: {
    alignItems: 'flex-end',
  },
  winnerScore: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.white,
    lineHeight: 28,
  },
  winnerUnit: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textOnDark,
    letterSpacing: 0.5,
  },

  /* Autres joueurs */
  rankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 12,
  },
  badge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.searchBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  playerName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '400',
    color: colors.text,
  },
  scoreInfo: {
    alignItems: 'flex-end',
  },
  score: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  scoreUnit: {
    fontSize: 10,
    fontWeight: '400',
    color: colors.textMuted,
    letterSpacing: 0.5,
  },

  /* Boutons */
  replayBtn: {
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
  replayBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
  },
  homeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.card,
    borderRadius: 16,
    paddingVertical: 16,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  homeBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
});
