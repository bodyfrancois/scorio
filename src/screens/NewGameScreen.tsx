import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  LayoutAnimation,
  Platform,
  UIManager,
  ScrollView,
  Image,
} from 'react-native';
import { colors } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { getGameEngine } from '../core/gameEngine';

export default function NewGameScreen({ route, navigation }: any) {
  /* ---------------- INITIALISATION ---------------- */

  const { gameName } = route.params ?? { gameName: 'Jeu' };
  const { config } = getGameEngine(gameName);

  const [players, setPlayers] = useState<string[]>(['']);
  const [rulesExpanded, setRulesExpanded] = useState(false);

  // Active LayoutAnimation sur Android
  if (
    Platform.OS === 'android' &&
    UIManager.setLayoutAnimationEnabledExperimental
  ) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  /* ---------------- LOGIQUE JOUEURS ---------------- */

  const updatePlayer = (index: number, value: string) => {
    const updated = [...players];
    updated[index] = value;
    setPlayers(updated);
  };

  const addPlayer = () => {
    if (players.length < config.maxPlayers) {
      setPlayers([...players, '']);
    }
  };

  const removePlayer = (index: number) => {
    setPlayers(players.filter((_, i) => i !== index));
  };

  const validPlayers = players.filter(
    (p) => p.trim().length > 0
  );

  const isValidPlayerCount =
    validPlayers.length >= config.minPlayers &&
    validPlayers.length <= config.maxPlayers;

  /* ---------------- LANCEMENT PARTIE ---------------- */

  const startGame = () => {
    if (!isValidPlayerCount) {
      Alert.alert(
        'Configuration invalide',
        `Le nombre de joueurs doit être entre ${config.minPlayers} et ${config.maxPlayers}.`
      );
      return;
    }

    navigation.navigate('Scoreboard', {
      gameName,
      players: validPlayers,
    });
  };

  /* ---------------- UI ---------------- */

  return (
    <ScrollView style={styles.container}>

      {/* ---------- SECTION JOUEURS ---------- */}

      <View style={styles.section}>
        <View style={styles.listHeader}>
          <Text style={styles.sectionTitle}>
            Liste des joueurs
          </Text>

          {players.length < config.maxPlayers && (
            <Pressable
              onPress={addPlayer}
              style={styles.addButton}
            >
              <Text style={styles.addButtonText}>
                + Ajouter
              </Text>
            </Pressable>
          )}
        </View>

        {players.map((player, index) => (
          <View key={index} style={styles.playerRow}>
            <TextInput
              placeholder={`Joueur ${index + 1}`}
              value={player}
              onChangeText={(text) =>
                updatePlayer(index, text)
              }
              style={styles.input}
              placeholderTextColor="#9CA3AF"
            />

            {players.length > 1 && (
              <Pressable
                onPress={() => removePlayer(index)}
                style={styles.removeButton}
              >
                <Text style={styles.removeText}>✕</Text>
              </Pressable>
            )}
          </View>
        ))}
      </View>

      {/* ---------- BOUTON DEMARRER ---------- */}

      <Pressable
        style={[
          styles.startButton,
          !isValidPlayerCount &&
            styles.startButtonDisabled,
        ]}
        onPress={startGame}
        disabled={!isValidPlayerCount}
      >
        <Text style={styles.startText}>
          Démarrer une partie
        </Text>
      </Pressable>

      {/* ---------- SECTION RÈGLES ---------- */}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Règles
        </Text>

        {/* Résumé */}
        <View style={styles.ruleRow}>
          <Ionicons
            name="people-outline"
            size={18}
            color="#6B7280"
          />
          <Text style={styles.ruleText}>
            {config.minPlayers} - {config.maxPlayers} joueurs
          </Text>
        </View>

        {config.estimatedDuration && (
          <View style={styles.ruleRow}>
            <Ionicons
              name="time-outline"
              size={18}
              color="#6B7280"
            />
            <Text style={styles.ruleText}>
              {config.estimatedDuration} minutes
            </Text>
          </View>
        )}

        {config.image && (
          <Image
            source={config.image}
            style={styles.rulesImage}
            resizeMode="cover"
          />
        )}

        {config.description && (
          <Text style={styles.ruleDescription}>
            {config.description}
          </Text>
        )}

        {/* Collapse uniquement sur detailedRules */}
        {config.detailedRules && (
          <>
            <Pressable
              style={styles.expandButton}
              onPress={() => {
                LayoutAnimation.configureNext(
                  LayoutAnimation.Presets.easeInEaseOut
                );
                setRulesExpanded(!rulesExpanded);
              }}
            >
              <Text style={styles.expandText}>
                {rulesExpanded
                  ? 'Masquer règles complètes'
                  : 'Voir règles complètes'}
              </Text>

              <Ionicons
                name={
                  rulesExpanded
                    ? 'chevron-up'
                    : 'chevron-down'
                }
                size={18}
                color={colors.primary}
              />
            </Pressable>

            {rulesExpanded && (
              <View style={styles.detailedRules}>
                <Text style={styles.ruleDescription}>
                  {config.detailedRules}
                </Text>
              </View>
            )}
          </>
        )}
      </View>
    </ScrollView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },

  section: {
    marginBottom: 28,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },

  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  input: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    fontSize: 16,
    color: colors.text,
  },

  removeButton: {
    marginLeft: 8,
    padding: 8,
  },

  removeText: {
    fontSize: 18,
    color: '#EF4444',
  },

  addButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#EEF2FF',
  },

  addButtonText: {
    color: colors.primary,
    fontWeight: '600',
  },

  startButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 24,
  },

  startButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },

  startText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },

  ruleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  ruleText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#6B7280',
  },

  rulesImage: {
    width: 70,
    height: 70,
    borderRadius: 12,
    marginTop: 12,
  },

  ruleDescription: {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 18,
    color: '#6B7280',
  },

  expandButton: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  expandText: {
    color: colors.primary,
    fontWeight: '600',
  },

  detailedRules: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
});