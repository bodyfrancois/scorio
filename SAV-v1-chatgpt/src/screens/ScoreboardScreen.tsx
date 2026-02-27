import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
} from 'react-native';

import { colors } from '../theme/colors';
import UnoScoreModal from '../components/UnoScoreModal';
import EndGameModal from '../components/EndGameModal';
import { getGameEngine } from '../core/gameEngine';
import { RankingItem } from '../core/types';


export default function ScoreboardScreen({
  route,
  navigation,
}: any) {
  const { players, gameName } = route.params;

  const engine = getGameEngine(gameName);

  const [scores, setScores] = useState(
    engine.initializeScores(players)
  );

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPlayerIndex, setSelectedPlayerIndex] =
    useState<number | null>(null);
  const [selectedRoundIndex, setSelectedRoundIndex] =
    useState<number | null>(null);

  const [endGameVisible, setEndGameVisible] =
    useState(false);

  const [ranking, setRanking] = useState<RankingItem[]>(
    []
  );

  const addRound = () => {
    setScores(engine.addRound(scores));
  };

  const updateScore = (
    playerIndex: number,
    roundIndex: number,
    value: number
  ) => {
    const updated = engine.updateScore(
      scores,
      playerIndex,
      roundIndex,
      value
    );

    setScores(updated);

    const result = engine.checkEndGame(
      updated,
      players
    );

    if (result.hasEnded) {
      setRanking(result.ranking!);
      setEndGameVisible(true);
    }
  };

  const totals = engine.getTotals(scores);
  const numberOfRounds = scores[0]?.length ?? 0;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {gameName}
      </Text>

      {/* TABLEAU */}
      <View style={{ flexDirection: 'row' }}>
        
        {/* COLONNE FIXE MANCHE */}
        <View>
          {/* Header */}
          <View style={[styles.cell, styles.roundHeader]}>

          </View>

          {/* Lignes manches */}
          {Array.from(
            { length: numberOfRounds },
            (_, roundIndex) => (
              <View
                key={roundIndex}
                style={[
                  styles.cell,
                  styles.roundCell,
                ]}
              >
                <Text>
                  {roundIndex + 1}
                </Text>
              </View>
            )
          )}
        </View>

        {/* PARTIE SCROLLABLE */}
        <ScrollView horizontal>
          <View>

            {/* HEADER JOUEURS */}
            <View style={{ flexDirection: 'row' }}>
              {players.map(
                (player: string, index: number) => (
                  <View
                    key={player}
                    style={[
                      styles.cell,
                      styles.playerHeader,
                    ]}
                  >
                    <Text style={styles.initials}>
                      {player
                        .slice(0, 2)
                        .toUpperCase()}
                    </Text>
                    <Text style={styles.playerName}>
                      {player}
                    </Text>
                    <Text style={styles.totalScore}>
                      {totals[index]}
                    </Text>
                  </View>
                )
              )}
            </View>

            {/* LIGNES SCORES */}
            {Array.from(
              { length: numberOfRounds },
              (_, roundIndex) => (
                <View
                  key={roundIndex}
                  style={{ flexDirection: 'row' }}
                >
                  {players.map(
                    (
                      _player: string,
                      playerIndex: number
                    ) => (
                      <Pressable
                        key={playerIndex}
                        style={styles.cell}
                        onPress={() => {
                          setSelectedPlayerIndex(
                            playerIndex
                          );
                          setSelectedRoundIndex(
                            roundIndex
                          );
                          setModalVisible(true);
                        }}
                      >
                        <Text>
                          {
                            scores[playerIndex][
                              roundIndex
                            ]
                          }
                        </Text>
                      </Pressable>
                    )
                  )}
                </View>
              )
            )}
          </View>
        </ScrollView>
      </View>

      {/* Lien Ajouter une manche */}
      <Pressable onPress={addRound}>
        <Text style={styles.addRoundLink}>
          + Ajouter une manche
        </Text>
      </Pressable>

      {/* MODAL SCORE */}
      {selectedPlayerIndex !== null &&
        selectedRoundIndex !== null && (
          <UnoScoreModal
            visible={modalVisible}
            playerName={
              players[selectedPlayerIndex]
            }
            onClose={() =>
              setModalVisible(false)
            }
            onValidate={(value) => {
              updateScore(
                selectedPlayerIndex,
                selectedRoundIndex,
                value
              );
              setModalVisible(false);
            }}
          />
        )}

      {/* POPIN FIN */}
      <EndGameModal
        visible={endGameVisible}
        ranking={ranking}
        onReplay={() => {
          setScores(
            engine.initializeScores(players)
          );
          setEndGameVisible(false);
        }}
        onHome={() => {
          setEndGameVisible(false);
          navigation.popToTop();
        }}
      />
    </View>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
    color: colors.text,
  },
  cell: {
    minWidth: 90,
    height: 70,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  roundHeader: {
    backgroundColor: '#F3F4F6',
  },
  roundCell: {
    backgroundColor: '#F9FAFB',
  },
  playerHeader: {
    backgroundColor: '#F3F4F6',
  },
  headerText: {
    fontWeight: '600',
  },
  initials: {
    fontSize: 16,
    fontWeight: '700',
  },
  playerName: {
    fontSize: 13,
  },
  totalScore: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 4,
  },
  addRoundLink: {
    marginTop: 20,
    color: colors.primary,
    fontWeight: '600',
    textAlign: 'center',
  },
});