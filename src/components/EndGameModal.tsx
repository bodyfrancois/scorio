import React, { useMemo, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  StyleSheet,
  ScrollView,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../theme/ThemeContext';
import { useTranslation } from '../i18n';
import { lightColors } from '../theme/colors';
import { makeSharedStyles } from '../theme/styles';
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

const CONFETTI_COLORS = [
  '#FF6B6B', '#FFE66D', '#4ECDC4', '#45B7D1',
  '#FF9FF3', '#A29BFE', '#55EFC4', '#FD79A8',
  '#FDCB6E', '#6C5CE7', '#00CEC9', '#E17055',
  '#74B9FF', '#00B894', '#E84393', '#F9CA24',
];

// [largeur, hauteur, borderRadius] — formes variées de confettis
const SHAPES: [number, number, number][] = [
  [5, 14, 1],
  [14, 5, 1],
  [9, 9, 2],
  [11, 11, 6],
  [6, 16, 1],
  [16, 6, 1],
];

// 3 explosions × 18 particules, à t=0 / 1700 / 3400ms → durée totale ~5s
const BURSTS = [
  { delay: 0,    ox: 0,   oy: 0  },
  { delay: 1700, ox: -40, oy: 10 },
  { delay: 3400, ox: 40,  oy: -5 },
];
const PER_BURST = 18;

function makeConfettiParticles() {
  return BURSTS.flatMap((burst, bi) =>
    Array.from({ length: PER_BURST }, (_, pi) => {
      const [w, h, br] = SHAPES[(bi * PER_BURST + pi) % SHAPES.length];
      // angle réparti en cercle complet + léger offset par burst
      const angle    = (pi / PER_BURST) * Math.PI * 2 + bi * 0.7;
      const radius1  = 70  + (pi % 4) * 20;   // distance après phase 1 (burst)
      const radius2  = 130 + (pi % 4) * 28;   // distance après phase 2 (retombée)
      const gravity  = 60  + (pi % 5) * 18;   // chute vers le bas en phase 2
      const rotDir   = pi % 2 === 0 ? 1 : -1;
      const rotTurns = (1 + pi % 3) * rotDir;
      // délai intra-burst : quelques ms d'écart pour un effet "éclaboussure"
      const delay    = burst.delay + pi * 15;
      return {
        translateX: new Animated.Value(burst.ox),
        translateY: new Animated.Value(burst.oy),
        opacity:    new Animated.Value(0),
        rotate:     new Animated.Value(0),
        w, h, br,
        color: CONFETTI_COLORS[(bi * PER_BURST + pi) % CONFETTI_COLORS.length],
        ox: burst.ox, oy: burst.oy,
        // cible phase 1
        tx1: burst.ox + Math.cos(angle) * radius1,
        ty1: burst.oy + Math.sin(angle) * radius1,
        // cible phase 2 (gravité)
        tx2: burst.ox + Math.cos(angle) * radius2,
        ty2: burst.oy + Math.sin(angle) * radius2 + gravity,
        rotTurns,
        delay,
      };
    })
  );
}

function Confetti({ visible }: { visible: boolean }) {
  const particles = useRef(makeConfettiParticles()).current;

  useEffect(() => {
    if (!visible) return;

    particles.forEach(p => {
      p.translateX.setValue(p.ox);
      p.translateY.setValue(p.oy);
      p.opacity.setValue(0);
      p.rotate.setValue(0);
    });

    const anims = particles.map(p =>
      Animated.sequence([
        Animated.delay(p.delay),
        // apparition instantanée
        Animated.timing(p.opacity, { toValue: 1, duration: 60, useNativeDriver: true }),
        // phase 1 : explosion rapide vers l'extérieur
        Animated.parallel([
          Animated.timing(p.translateX, { toValue: p.tx1, duration: 280, useNativeDriver: true }),
          Animated.timing(p.translateY, { toValue: p.ty1, duration: 280, useNativeDriver: true }),
          Animated.timing(p.rotate,     { toValue: p.rotTurns * 0.4, duration: 280, useNativeDriver: true }),
        ]),
        // phase 2 : retombée avec gravité + rotation continue + fondu
        Animated.parallel([
          Animated.timing(p.translateX, { toValue: p.tx2, duration: 750, useNativeDriver: true }),
          Animated.timing(p.translateY, { toValue: p.ty2, duration: 750, useNativeDriver: true }),
          Animated.timing(p.rotate,     { toValue: p.rotTurns, duration: 750, useNativeDriver: true }),
          Animated.sequence([
            Animated.delay(350),
            Animated.timing(p.opacity,  { toValue: 0, duration: 400, useNativeDriver: true }),
          ]),
        ]),
      ])
    );

    Animated.parallel(anims).start();
  }, [visible]);

  return (
    <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ width: 0, height: 0 }}>
        {particles.map((p, i) => (
          <Animated.View
            key={i}
            style={{
              position: 'absolute',
              width:  p.w,
              height: p.h,
              borderRadius: p.br,
              backgroundColor: p.color,
              opacity: p.opacity,
              transform: [
                { translateX: p.translateX },
                { translateY: p.translateY },
                { rotate: p.rotate.interpolate({ inputRange: [-3, 3], outputRange: ['-1080deg', '1080deg'] }) },
              ],
            }}
          />
        ))}
      </View>
    </View>
  );
}

const SCROLL_THRESHOLD = 6;

const makeStyles = (c: typeof lightColors) => ({
  ...makeSharedStyles(c),
  ...StyleSheet.create({
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
    rankingScroll: {
      maxHeight: 320,
      marginBottom: 24,
    },
    rankingScrollContent: {
      gap: 8,
    },
    winnerCard: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 12,
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
    replayBtnLayout: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      marginBottom: 16,
    },
    homeBtnLayout: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      paddingVertical: 16,
      borderRadius: 16,
    },
  }),
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
  const needsScroll = ranking.length > SCROLL_THRESHOLD;

  const renderRanking = () =>
    ranking.map((player, index) => {
      const isWinner = index === 0;
      if (isWinner) {
        return (
          <LinearGradient
            key={`${player.name}-${index}`}
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
        <View key={`${player.name}-${index}`} style={styles.rankRow}>
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
    });

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>

          {/* Confetti centré sur le titre */}
          <View style={{ alignItems: 'center', marginBottom: 6 }}>
            <View style={{ position: 'relative' }}>
              <Confetti visible={visible} />
              <View style={styles.titleRow}>
                <IconStar size={22} color={colors.gold} />
                <Text style={styles.title}>{t.gameOver}</Text>
                <IconStar size={22} color={colors.gold} />
              </View>
            </View>
          </View>
          <Text style={styles.subtitle}>{t.finalRanking}</Text>

          {/* Classement */}
          {needsScroll ? (
            <ScrollView
              style={styles.rankingScroll}
              contentContainerStyle={styles.rankingScrollContent}
              showsVerticalScrollIndicator={false}
            >
              {renderRanking()}
            </ScrollView>
          ) : (
            <View style={styles.rankingList}>
              {renderRanking()}
            </View>
          )}

          <Pressable style={({ pressed }) => [styles.btnPrimary, styles.replayBtnLayout, pressed && styles.pressed]} onPress={onReplay}>
            <IconReload size={20} color={colors.white} />
            <Text style={styles.btnPrimaryText}>{t.replay}</Text>
          </Pressable>

          <Pressable style={({ pressed }) => [styles.btnSecondary, styles.homeBtnLayout, pressed && styles.pressed]} onPress={onHome}>
            <IconHomeFill size={18} color={colors.text} />
            <Text style={styles.btnSecondaryText}>{t.backHome}</Text>
          </Pressable>

        </View>
      </View>
    </Modal>
  );
}
