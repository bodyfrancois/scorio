import { useState, useLayoutEffect, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Modal,
  useWindowDimensions,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import UnoScoreModal from '../components/UnoScoreModal';
import EndGameModal from '../components/EndGameModal';
import { getGameEngine } from '../core/gameEngine';
import { RankingItem } from '../core/types';
import { saveGameToHistory } from '../storage/historyStorage';
import { useTheme } from '../theme/ThemeContext';
import { useTranslation } from '../i18n';
import { lightColors } from '../theme/colors';

const ROUND_COL = 36;
const PLAYER_COL = 90;
const HEADER_H = 108;
const ROW_H = 56;

const makeStyles = (c: typeof lightColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: c.background,
    },
    tableCard: {
      overflow: 'hidden',
      backgroundColor: c.card,
      shadowColor: c.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 3,
    },
    leftCol: {
      zIndex: 2,
      backgroundColor: c.card,
      shadowColor: c.shadow,
      shadowOffset: { width: 4, height: 0 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 4,
    },
    cornerCell: {
      width: ROUND_COL,
      height: HEADER_H,
      backgroundColor: c.card,
    },
    roundCell: {
      width: ROUND_COL,
      height: ROW_H,
      alignItems: 'center',
      justifyContent: 'center',
      borderTopWidth: 1,
      borderTopColor: c.border,
    },
    roundNum: {
      fontSize: 14,
      fontWeight: '400',
      color: c.textMuted,
    },
    playerHeaderCol: {
      width: PLAYER_COL,
      height: HEADER_H,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 4,
      paddingVertical: 14,
      borderLeftWidth: 1,
      borderLeftColor: c.card,
      backgroundColor: c.card,
    },
    avatar: {
      width: 32,
      height: 32,
      borderRadius: 22,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarText: {
      fontSize: 13,
      fontWeight: '700',
      color: c.textSecondary,
    },
    playerName: {
      fontSize: 12,
      fontWeight: '700',
      color: c.textSecondary,
      maxWidth: PLAYER_COL - 8,
      textAlign: 'center',
    },
    totalScore: {
      fontSize: 18,
      fontWeight: '800',
      letterSpacing: -0.5,
    },
    scoreCell: {
      width: PLAYER_COL,
      height: ROW_H,
      alignItems: 'center',
      justifyContent: 'center',
      borderTopWidth: 1,
      borderTopColor: c.border,
      borderLeftWidth: 1,
      borderLeftColor: c.border,
    },
    scoreValue: {
      fontSize: 15,
      color: c.text,
    },
    scoreEmpty: {
      color: c.textMuted,
    },
    addRoundBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      marginTop: 28,
      paddingVertical: 8,
    },
    addRoundText: {
      color: c.primary,
      fontSize: 15,
      fontWeight: '600',
    },
    endSection: {
      paddingVertical: 16,
      alignItems: 'center',
    },
    endLink: {
      fontSize: 13,
      color: c.textMuted,
    },
    overlay: {
      flex: 1,
      backgroundColor: c.overlay,
      justifyContent: 'flex-end',
    },
    rulesSheet: {
      backgroundColor: c.card,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 40,
      maxHeight: '70%',
    },
    rulesSheetHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    rulesSheetTitle: {
      fontSize: 17,
      fontWeight: '700',
      color: c.text,
    },
    rulesDescription: {
      fontSize: 14,
      color: c.textSecondary,
      lineHeight: 20,
      marginBottom: 12,
    },
    rulesDetailed: {
      fontSize: 13,
      color: c.textSecondary,
      lineHeight: 20,
    },
    exitOverlay: {
      flex: 1,
      backgroundColor: c.overlay,
      justifyContent: 'center',
      paddingHorizontal: 24,
    },
    exitCard: {
      backgroundColor: c.card,
      borderRadius: 20,
      paddingHorizontal: 24,
      paddingTop: 28,
      paddingBottom: 28,
    },
    exitTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: c.text,
      marginBottom: 8,
    },
    exitSubtitle: {
      fontSize: 14,
      color: c.textSecondary,
      marginBottom: 28,
    },
    exitButtons: {
      flexDirection: 'row',
      gap: 12,
    },
    exitBtn: {
      flex: 1,
      paddingVertical: 14,
      borderRadius: 14,
      alignItems: 'center',
    },
    exitBtnSecondary: {
      backgroundColor: c.searchBackground,
    },
    exitBtnSecondaryText: {
      fontSize: 15,
      fontWeight: '600',
      color: c.textSecondary,
    },
    exitBtnPrimary: {
      backgroundColor: c.primary,
    },
    exitBtnPrimaryText: {
      fontSize: 15,
      fontWeight: '700',
      color: c.white,
    },
  });

export default function ScoreboardScreen({ route, navigation }: any) {
  const { colors, language } = useTheme();
  const t = useTranslation(language);
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const { players, gameName, teamColors, sessionScoreLimit, sessionRoundLimit, sessionQuickActions } = route.params;
  const engine = getGameEngine(gameName);
  const { config } = engine;

  const { width: screenWidth } = useWindowDimensions();
  const playerColWidth = players.length <= 3
    ? (screenWidth - ROUND_COL) / players.length
    : PLAYER_COL;

  const [scores, setScores] = useState(engine.initializeScores(players));
  const [baseScores, setBaseScores] = useState(engine.initializeScores(players));
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPlayerIndex, setSelectedPlayerIndex] = useState<number | null>(null);
  const [selectedRoundIndex, setSelectedRoundIndex] = useState<number | null>(null);
  const [endGameVisible, setEndGameVisible] = useState(false);
  const [ranking, setRanking] = useState<RankingItem[]>([]);

  const [rulesModalVisible, setRulesModalVisible] = useState(false);
  const [exitModalVisible, setExitModalVisible] = useState(false);
  const [pendingNavAction, setPendingNavAction] = useState<any>(null);

  const avatarPalette = [
    colors.avatarRose, colors.avatarPeche, colors.avatarJaune, colors.avatarVert,
    colors.avatarCiel, colors.avatarBleu, colors.avatarViole, colors.avatarFuchsia,
  ];
  const getAvatarColor = (i: number) => teamColors?.[i] ?? avatarPalette[i % avatarPalette.length];
  const getAvatarTextColor = (i: number) => teamColors?.[i] ? colors.white : colors.textSecondary;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          onPress={() => setRulesModalVisible(true)}
          style={{ width: 34, height: 34, borderRadius: 100, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}
          hitSlop={8}
        >
          <Ionicons name="information-circle-outline" size={20} color="#fff" />
        </Pressable>
      ),
    });
  }, [navigation, colors]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e: any) => {
      e.preventDefault();
      setPendingNavAction(e.data.action);
      setExitModalVisible(true);
    });
    return unsubscribe;
  }, [navigation]);

  const addRound = () => setScores(engine.addRound(scores));

  const updateScore = (playerIndex: number, roundIndex: number, value: number, base: number) => {
    setBaseScores(prev => engine.updateScore(prev, playerIndex, roundIndex, base));
    const updated = engine.updateScore(scores, playerIndex, roundIndex, value);
    setScores(updated);
    const result = engine.checkEndGame(updated, players, sessionScoreLimit, sessionRoundLimit);
    if (result.hasEnded) {
      setRanking(result.ranking!);
      setEndGameVisible(true);
      saveGameToHistory({
        id: Date.now().toString(),
        gameName,
        date: new Date().toISOString(),
        players,
        ranking: result.ranking!,
      });
    }
  };

  const totals = engine.getTotals(scores);
  const numberOfRounds = scores[0]?.length ?? 0;

  const minTotal = Math.min(...totals);
  const maxTotal = Math.max(...totals);

  const getTotalColor = (total: number) => {
    if (minTotal === maxTotal) return colors.text;
    if (config.lowestScoreWins) {
      if (total === minTotal) return colors.primary;
      if (total === maxTotal) return colors.danger;
    } else {
      if (total === maxTotal) return colors.primary;
      if (total === minTotal) return colors.danger;
    }
    return colors.text;
  };

  return (
    <View style={styles.container}>

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <View style={styles.tableCard}>
          <View style={{ flexDirection: 'row' }}>

            <View style={styles.leftCol}>
              <View style={styles.cornerCell} />
              {Array.from({ length: numberOfRounds }, (_, i) => (
                <View key={i} style={styles.roundCell}>
                  <Text style={styles.roundNum}>{i + 1}</Text>
                </View>
              ))}
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View>

                <View style={{ flexDirection: 'row', backgroundColor: colors.background }}>
                  {players.map((player: string, index: number) => (
                    <View key={index} style={[styles.playerHeaderCol, { width: playerColWidth }]}>
                      <View style={[styles.avatar, { backgroundColor: getAvatarColor(index) }]}>
                        <Text style={[styles.avatarText, { color: getAvatarTextColor(index) }]}>
                          {player.trim().slice(0, 2).toUpperCase()}
                        </Text>
                      </View>
                      <Text style={styles.playerName} numberOfLines={1}>{player}</Text>
                      <Text style={[styles.totalScore, { color: getTotalColor(totals[index]) }]}>
                        {totals[index]}
                      </Text>
                    </View>
                  ))}
                </View>

                {Array.from({ length: numberOfRounds }, (_, roundIndex) => (
                  <View key={roundIndex} style={{ flexDirection: 'row' }}>
                    {players.map((_: string, playerIndex: number) => (
                      <Pressable
                        key={playerIndex}
                        style={[styles.scoreCell, { width: playerColWidth }, roundIndex % 2 === 1 && { backgroundColor: colors.rowAlt }]}
                        onPress={() => {
                          setSelectedPlayerIndex(playerIndex);
                          setSelectedRoundIndex(roundIndex);
                          setModalVisible(true);
                        }}
                      >
                        <Text style={[styles.scoreValue, scores[playerIndex][roundIndex] === null && styles.scoreEmpty]}>
                          {scores[playerIndex][roundIndex] ?? '–'}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                ))}

              </View>
            </ScrollView>

          </View>
        </View>

        <Pressable style={styles.addRoundBtn} onPress={addRound}>
          <Ionicons name="add-circle-outline" size={20} color={colors.primary} />
          <Text style={styles.addRoundText}>{t.addRound}</Text>
        </Pressable>

      </ScrollView>

      <View style={styles.endSection}>
        <Pressable onPress={() => navigation.popToTop()}>
          <Text style={styles.endLink}>{t.finish}</Text>
        </Pressable>
      </View>

      {/* Modal règles */}
      <Modal visible={rulesModalVisible} transparent animationType="slide">
        <View style={styles.overlay}>
          <View style={styles.rulesSheet}>

            <View style={styles.rulesSheetHeader}>
              <Text style={styles.rulesSheetTitle}>
                {t.rules} {config.name ? `– ${config.name}` : ''}
              </Text>
              <Pressable onPress={() => setRulesModalVisible(false)}>
                <Ionicons name="close" size={22} color={colors.textSecondary} />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {config.description && (
                <Text style={styles.rulesDescription}>{config.description}</Text>
              )}
              {config.detailedRules && (
                <Text style={styles.rulesDetailed}>{config.detailedRules}</Text>
              )}
            </ScrollView>

          </View>
        </View>
      </Modal>

      {/* Modal quitter */}
      <Modal visible={exitModalVisible} transparent animationType="fade">
        <View style={styles.exitOverlay}>
          <View style={styles.exitCard}>

            <Text style={styles.exitTitle}>{t.quitGame}</Text>
            <Text style={styles.exitSubtitle}>{t.progressLost}</Text>

            <View style={styles.exitButtons}>
              <Pressable
                style={[styles.exitBtn, styles.exitBtnSecondary]}
                onPress={() => {
                  setExitModalVisible(false);
                  if (pendingNavAction) navigation.dispatch(pendingNavAction);
                }}
              >
                <Text style={styles.exitBtnSecondaryText}>{t.yes}</Text>
              </Pressable>

              <Pressable
                style={[styles.exitBtn, styles.exitBtnPrimary]}
                onPress={() => setExitModalVisible(false)}
              >
                <Text style={styles.exitBtnPrimaryText}>{t.no}</Text>
              </Pressable>
            </View>

          </View>
        </View>
      </Modal>

      {selectedPlayerIndex !== null && selectedRoundIndex !== null && (
        <UnoScoreModal
          visible={modalVisible}
          playerName={players[selectedPlayerIndex]}
          roundNumber={selectedRoundIndex + 1}
          playerIndex={selectedPlayerIndex}
          quickActions={sessionQuickActions}
          roundTotal={config.roundTotal}
          currentRoundBases={baseScores.map(row => row[selectedRoundIndex])}
          onClose={() => setModalVisible(false)}
          onValidate={(total, base) => {
            updateScore(selectedPlayerIndex, selectedRoundIndex, total, base);
          }}
        />
      )}

      <EndGameModal
        visible={endGameVisible}
        ranking={ranking}
        onReplay={() => {
          setScores(engine.initializeScores(players));
          setEndGameVisible(false);
        }}
        onHome={() => {
          setEndGameVisible(false);
          navigation.dispatch(pendingNavAction ?? { type: 'GO_BACK' });
        }}
      />

    </View>
  );
}
