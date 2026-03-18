import React, { useMemo } from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../theme/ThemeContext';
import { useTranslation } from '../i18n';
import { lightColors } from '../theme/colors';
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

const makeStyles = (c: typeof lightColors) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: c.overlay,
      justifyContent: 'center',
      paddingHorizontal: 20,
    },
    card: {
      backgroundColor: c.card,
      borderRadius: 24,
      paddingHorizontal: 20,
      paddingTop: 28,
      paddingBottom: 24,
    },
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
      color: c.text,
      letterSpacing: -0.5,
    },
    subtitle: {
      fontSize: 14,
      color: c.textMuted,
      textAlign: 'center',
      marginBottom: 20,
    },
    rankingList: {
      gap: 8,
      marginBottom: 24,
    },
    winnerCard: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 12,
      borderWidth: 4,
      borderColor: c.white,
      paddingHorizontal: 16,
      paddingVertical: 14,
      gap: 14,
      shadowColor: c.shadow,
      shadowOffset: { width: 0, height: 25 },
      shadowOpacity: 0.25,
      shadowRadius: 50,
      elevation: 12,
    },
    winnerIconBox: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: c.gold,
      alignItems: 'center',
      justifyContent: 'center',
    },
    winnerInfo: {
      flex: 1,
    },
    winnerName: {
      fontSize: 17,
      fontWeight: '800',
      color: c.textOnLight,
    },
    winnerLabel: {
      fontSize: 11,
      fontWeight: '700',
      color: c.textOnLight,
      letterSpacing: 0.8,
      marginTop: 2,
    },
    winnerScoreBox: {
      alignItems: 'flex-end',
    },
    winnerScore: {
      fontSize: 26,
      fontWeight: '800',
      color: c.textOnLight,
      lineHeight: 28,
    },
    winnerUnit: {
      fontSize: 10,
      fontWeight: '600',
      color: c.textOnLight,
      letterSpacing: 0.5,
    },
    rankRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: c.background,
      borderRadius: 14,
      paddingHorizontal: 14,
      paddingVertical: 12,
      gap: 12,
    },
    badge: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: c.searchBackground,
      alignItems: 'center',
      justifyContent: 'center',
    },
    badgeText: {
      fontSize: 12,
      fontWeight: '500',
      color: c.textSecondary,
    },
    playerName: {
      flex: 1,
      fontSize: 15,
      fontWeight: '400',
      color: c.text,
    },
    scoreInfo: {
      alignItems: 'flex-end',
    },
    score: {
      fontSize: 16,
      fontWeight: '600',
      color: c.text,
    },
    scoreUnit: {
      fontSize: 10,
      fontWeight: '400',
      color: c.textMuted,
      letterSpacing: 0.5,
    },
    replayBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      backgroundColor: c.primary,
      borderRadius: 16,
      paddingVertical: 16,
      marginBottom: 10,
      shadowColor: c.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    replayBtnText: {
      fontSize: 16,
      fontWeight: '700',
      color: c.white,
    },
    homeBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      backgroundColor: c.card,
      borderRadius: 16,
      paddingVertical: 16,
      borderWidth: 1.5,
      borderColor: c.border,
    },
    homeBtnText: {
      fontSize: 16,
      fontWeight: '600',
      color: c.primary,
    },
  });

export default function EndGameModal({
  visible,
  ranking,
  onReplay,
  onHome,
}: Props) {
  const { colors, language } = useTheme();
  const t = useTranslation(language);
  const styles = useMemo(() => makeStyles(colors), [colors]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>

          {/* Header */}
          <View style={styles.titleRow}>
            <IconStar size={22} color={colors.gold} />
            <Text style={styles.title}>{t.gameOver}</Text>
            <IconStar size={22} color={colors.gold} />
          </View>
          <Text style={styles.subtitle}>{t.finalRanking}</Text>

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
                      <Text style={styles.winnerLabel}>{t.winner}</Text>
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

          <Pressable style={styles.replayBtn} onPress={onReplay}>
            <IconReload size={20} color={colors.white} />
            <Text style={styles.replayBtnText}>{t.replay}</Text>
          </Pressable>

          <Pressable style={styles.homeBtn} onPress={onHome}>
            <IconHomeFill size={18} color={colors.primary} />
            <Text style={styles.homeBtnText}>{t.backHome}</Text>
          </Pressable>

        </View>
      </View>
    </Modal>
  );
}
