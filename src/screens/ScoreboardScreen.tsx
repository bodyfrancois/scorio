import { useState, useLayoutEffect, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Modal,
  useWindowDimensions,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import EditScoreModal from '../components/EditScoreModal';
import EndGameModal from '../components/EndGameModal';
import { getGameEngine } from '../core/gameEngine';
import { RankingItem } from '../core/types';
import { saveGameToHistory } from '../storage/historyStorage';
import { useTheme } from '../theme/ThemeContext';
import { useTranslation } from '../i18n';
import { makeScoreboardStyles } from '../theme/styles';
import PlayerAvatar from '../components/PlayerAvatar';
import { getAvatarColorByIndex } from '../utils/avatarColors';

const ROUND_COL = 36;
const PLAYER_COL = 90;
const HEADER_H = 108;
const ROW_H = 56;

export default function ScoreboardScreen({ route, navigation }: any) {
  const { colors, language } = useTheme();
  const t = useTranslation(language);
  const styles = useMemo(() => makeScoreboardStyles(colors, ROUND_COL, PLAYER_COL, HEADER_H, ROW_H), [colors]);

  const { players, gameName, displayName, teamColors, playerColors, teams, sessionScoreLimit, sessionRoundLimit, sessionLowestScoreWins, sessionQuickActions } = route.params;
  const effectiveGameName: string = displayName ?? gameName;
  const engine = getGameEngine(gameName);
  const { config } = engine;
  const effectiveLowestScoreWins: boolean = sessionLowestScoreWins ?? config.lowestScoreWins;

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

  const getAvatarColor = (i: number) => teamColors?.[i] ?? playerColors?.[i] ?? getAvatarColorByIndex(i, colors);

  // Expand team ranking into individual player entries for history/stats
  const buildHistoryData = (ranking: { name: string; score: number }[]) => {
    if (!teams || !(teams as string[][]).length) {
      return { historyPlayers: players as string[], historyRanking: ranking };
    }
    const historyRanking: { name: string; score: number }[] = [];
    for (const entry of ranking) {
      const teamIdx = (players as string[]).indexOf(entry.name);
      const members: string[] = (teams as string[][])[teamIdx] ?? [];
      const names = members.length > 0 ? members : [entry.name];
      for (const member of names) {
        historyRanking.push({ name: member, score: entry.score });
      }
    }
    return { historyPlayers: (teams as string[][]).flat(), historyRanking };
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: effectiveGameName,
      headerRight: () => (
        <Pressable
          onPress={() => setRulesModalVisible(true)}
          style={({ pressed }) => [styles.hdrBtn, { marginRight: 16 }, pressed && { opacity: 0.72 }]}
          hitSlop={8}
        >
          <Ionicons name="information-circle-outline" size={20} color="#fff" />
        </Pressable>
      ),
    });
  }, [navigation, colors]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e: any) => {
      if (endGameVisible) return;
      e.preventDefault();
      setPendingNavAction(e.data.action);
      setExitModalVisible(true);
    });
    return unsubscribe;
  }, [navigation, endGameVisible]);

  const addRound = () => {
    setScores(engine.addRound(scores));
    setBaseScores(engine.addRound(baseScores));
  };

  const updateScore = (playerIndex: number, roundIndex: number, value: number, base: number) => {
    setBaseScores(prev => engine.updateScore(prev, playerIndex, roundIndex, base));
    const updated = engine.updateScore(scores, playerIndex, roundIndex, value);
    setScores(updated);
    const result = engine.checkEndGame(updated, players, sessionScoreLimit, sessionRoundLimit, effectiveLowestScoreWins);
    if (result.hasEnded) {
      setRanking(result.ranking!);
      setEndGameVisible(true);
      const { historyPlayers, historyRanking } = buildHistoryData(result.ranking!);
      saveGameToHistory({
        id: Date.now().toString(),
        gameName: effectiveGameName,
        date: new Date().toISOString(),
        players: historyPlayers,
        ranking: historyRanking,
      });
    }
  };

  const hasAutoEnd = sessionScoreLimit !== undefined || sessionRoundLimit !== undefined;

  const endGameManually = () => {
    const currentTotals = engine.getTotals(scores);
    const finalRanking = players
      .map((name: string, i: number) => ({ name, score: currentTotals[i] }))
      .sort((a: { score: number }, b: { score: number }) =>
        effectiveLowestScoreWins ? a.score - b.score : b.score - a.score
      );
    setRanking(finalRanking);
    setEndGameVisible(true);
    const { historyPlayers, historyRanking } = buildHistoryData(finalRanking);
    saveGameToHistory({
      id: Date.now().toString(),
      gameName,
      date: new Date().toISOString(),
      players: historyPlayers,
      ranking: historyRanking,
    });
  };

  const totals = engine.getTotals(scores);
  const numberOfRounds = scores[0]?.length ?? 0;

  const minTotal = Math.min(...totals);
  const maxTotal = Math.max(...totals);

  const getTotalColor = (total: number) => {
    if (minTotal === maxTotal) return colors.text;
    if (effectiveLowestScoreWins) {
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
                  <Text style={styles.muted}>{i + 1}</Text>
                </View>
              ))}
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View>

                <View style={{ flexDirection: 'row', backgroundColor: colors.background }}>
                  {players.map((player: string, index: number) => (
                    <View key={index} style={[styles.playerHeaderCol, { width: playerColWidth }]}>
                      <PlayerAvatar
                        name={player}
                        color={getAvatarColor(index)}
                        initials={teamColors ? `E${index + 1}` : undefined}
                      />
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
                        <Text style={[styles.body, scores[playerIndex][roundIndex] === null && styles.scoreEmpty]}>
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

        <Pressable style={({ pressed }) => [styles.addRoundBtn, pressed && styles.pressed]} onPress={addRound}>
          <Ionicons name="add-circle-outline" size={20} color={colors.primary} />
          <Text style={styles.addBtnText}>{t.addRound}</Text>
        </Pressable>

      </ScrollView>

      <View style={styles.endSection}>
        {!hasAutoEnd && (
          <Pressable style={({ pressed }) => [styles.endGameBtn, pressed && styles.pressed]} onPress={endGameManually}>
            <Text style={styles.btnPrimaryText}>{t.endGameBtn}</Text>
          </Pressable>
        )}
      </View>

      {/* Modal règles */}
      <Modal visible={rulesModalVisible} transparent animationType="slide">
        <View style={styles.overlay}>
          <View style={styles.rulesSheet}>

            <View style={styles.rulesSheetHeader}>
              <Text style={styles.subheading}>
                {t.rules} {config.name ? `– ${config.name}` : ''}
              </Text>
              <Pressable onPress={() => setRulesModalVisible(false)}>
                <Ionicons name="close" size={22} color={colors.textSecondary} />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {config.description && (
                <Text style={[styles.caption, { lineHeight: 20 }]}>{config.description}</Text>
              )}
              {config.detailedRules && (
                <Text style={[styles.caption, { lineHeight: 20 }]}>{config.detailedRules}</Text>
              )}
            </ScrollView>

          </View>
        </View>
      </Modal>

      {/* Modal quitter */}
      <Modal visible={exitModalVisible} transparent animationType="fade">
        <View style={styles.overlayCenter}>
          <View style={styles.modalCard}>

            <Text style={[styles.subheading, { marginBottom: 8 }]}>{t.quitGame}</Text>
            <Text style={[styles.caption, { marginBottom: 28 }]}>{t.progressLost}</Text>

            <View style={styles.buttons}>
              <Pressable
                style={({ pressed }) => [styles.btn, styles.btnSecondary, pressed && styles.pressed]}
                onPress={() => {
                  setExitModalVisible(false);
                  if (pendingNavAction) navigation.dispatch(pendingNavAction);
                }}
              >
                <Text style={styles.btnSecondaryText}>{t.yes}</Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [styles.btn, styles.btnPrimary, pressed && styles.pressed]}
                onPress={() => setExitModalVisible(false)}
              >
                <Text style={styles.btnPrimaryText}>{t.no}</Text>
              </Pressable>
            </View>

          </View>
        </View>
      </Modal>

      {selectedPlayerIndex !== null && selectedRoundIndex !== null && (
        <EditScoreModal
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
