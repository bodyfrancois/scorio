import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';

import { colors } from '../theme/colors';
import {
  getHistory,
  GameHistoryItem,
} from '../storage/historyStorage';

export default function HistoryScreen() {
  const [history, setHistory] = useState<GameHistoryItem[]>([]);

  useEffect(() => {
    getHistory().then(setHistory);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historique</Text>

      {history.length === 0 && (
        <Text style={styles.empty}>
          Aucune partie enregistrée
        </Text>
      )}

      <ScrollView>
        {history.map((game) => (
          <View key={game.id} style={styles.card}>
            <Text style={styles.gameName}>
              🎮 {game.gameName}
            </Text>

            <Text style={styles.date}>
              {new Date(game.date).toLocaleDateString()}
            </Text>

            {game.ranking.map((player, index) => (
              <Text key={player.name} style={styles.player}>
                {index + 1}. {player.name} — {player.score}
              </Text>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
    color: colors.text,
  },
  empty: {
    color: '#6B7280',
    marginTop: 40,
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  gameName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: colors.text,
  },
  date: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  player: {
    fontSize: 14,
    color: colors.text,
  },
});
