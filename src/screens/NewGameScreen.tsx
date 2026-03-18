import { useState, useEffect } from 'react';
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
  Switch,
} from 'react-native';
import { colors, TEAM_COLORS } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { getGameEngine } from '../core/gameEngine';
import ScoreLimitModal from '../components/ScoreLimitModal';


export default function NewGameScreen({ route, navigation }: any) {
  /* ---------------- INITIALISATION ---------------- */

  const { gameName } = route.params ?? { gameName: 'Jeu' };
  const { config } = getGameEngine(gameName);

  const isTeamMode = !!config.teams;

  /* Joueurs (mode individuel) */
  const [players, setPlayers] = useState<string[]>(['']);

  /* Équipes (mode équipe) */
  const [teamPlayers, setTeamPlayers] = useState<string[][]>(() => {
    if (!config.teams) return [];
    return Array.from({ length: config.teams.count }, () =>
      Array.from({ length: config.teams!.minPlayersPerTeam }, () => '')
    );
  });
  const [teamNames, setTeamNames] = useState<string[]>(() => {
    if (!config.teams) return [];
    return Array.from({ length: config.teams.count }, (_, i) => `Équipe ${i + 1}`);
  });
  const teamColors = Array.from(
    { length: config.teams?.count ?? 0 },
    (_, i) => TEAM_COLORS[i % TEAM_COLORS.length]
  );

  /* Paramètres de session */
  const [sessionScoreLimit, setSessionScoreLimit] = useState<number>(config.scoreLimit ?? 500);
  const [quickActionsEnabled, setQuickActionsEnabled] = useState<boolean>(!!config.quickActions?.length);
  const [scoreLimitModalVisible, setScoreLimitModalVisible] = useState(false);

  const [rulesExpanded, setRulesExpanded] = useState(false);
  const [focusedKey, setFocusedKey] = useState<string | null>(null);

  useEffect(() => {
    if (
      Platform.OS === 'android' &&
      UIManager.setLayoutAnimationEnabledExperimental
    ) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  /* ---------------- AVATAR (mode individuel) ---------------- */

  const avatarPalette = [
    colors.avatarViole,
    colors.avatarRose,
    colors.avatarPeche,
    colors.avatarJaune,
    colors.avatarVert,
    colors.avatarCiel,
    colors.avatarBleu,
    colors.avatarFuchsia,
  ];
  const getAvatarColor = (index: number) => avatarPalette[index % avatarPalette.length];

  /* ---------------- LOGIQUE JOUEURS (mode individuel) ---------------- */

  const updatePlayer = (index: number, value: string) => {
    const updated = [...players];
    updated[index] = value;
    setPlayers(updated);
  };

  const addPlayer = () => {
    if (players.length < config.maxPlayers) setPlayers([...players, '']);
  };

  const removePlayer = (index: number) => {
    setPlayers(players.filter((_, i) => i !== index));
  };

  const validPlayers = players.filter((p) => p.trim().length > 0);

  /* ---------------- LOGIQUE ÉQUIPES ---------------- */

  const updateTeamName = (teamIndex: number, value: string) => {
    const updated = [...teamNames];
    updated[teamIndex] = value;
    setTeamNames(updated);
  };

  const updateTeamPlayer = (teamIndex: number, playerIndex: number, value: string) => {
    const updated = teamPlayers.map((team) => [...team]);
    updated[teamIndex][playerIndex] = value;
    setTeamPlayers(updated);
  };

  const addTeamPlayer = (teamIndex: number) => {
    if (!config.teams) return;
    if (teamPlayers[teamIndex].length >= config.teams.maxPlayersPerTeam) return;
    const updated = teamPlayers.map((team) => [...team]);
    updated[teamIndex] = [...updated[teamIndex], ''];
    setTeamPlayers(updated);
  };

  const removeTeamPlayer = (teamIndex: number, playerIndex: number) => {
    const updated = teamPlayers.map((team) => [...team]);
    updated[teamIndex] = updated[teamIndex].filter((_, i) => i !== playerIndex);
    setTeamPlayers(updated);
  };

  const validTeams = teamPlayers.map((team) => team.filter((p) => p.trim().length > 0));

  /* ---------------- VALIDATION ---------------- */

  const isValidPlayerCount = isTeamMode
    ? validTeams.every(
        (team) =>
          team.length >= (config.teams?.minPlayersPerTeam ?? 1) &&
          team.length <= (config.teams?.maxPlayersPerTeam ?? 99)
      )
    : validPlayers.length >= config.minPlayers && validPlayers.length <= config.maxPlayers;

  /* ---------------- LANCEMENT PARTIE ---------------- */

  const startGame = () => {
    if (!isValidPlayerCount) {
      Alert.alert(
        'Configuration invalide',
        isTeamMode
          ? `Chaque équipe doit avoir entre ${config.teams!.minPlayersPerTeam} et ${config.teams!.maxPlayersPerTeam} joueur(s).`
          : `Le nombre de joueurs doit être entre ${config.minPlayers} et ${config.maxPlayers}.`
      );
      return;
    }

    const sessionQuickActions = quickActionsEnabled ? config.quickActions : undefined;

    if (isTeamMode) {
      navigation.navigate('Scoreboard', {
        gameName,
        players: validTeams.map((_, i) => teamNames[i]?.trim() || `Équipe ${i + 1}`),
        teams: validTeams,
        teamColors,
        sessionScoreLimit: config.scoreLimit != null ? sessionScoreLimit : undefined,
        sessionQuickActions,
      });
    } else {
      navigation.navigate('Scoreboard', {
        gameName,
        players: validPlayers,
        sessionScoreLimit: config.scoreLimit != null ? sessionScoreLimit : undefined,
        sessionQuickActions,
      });
    }
  };

  /* ---------------- UI ---------------- */

  const hasSettings = config.scoreLimit != null || !!config.quickActions?.length;

  return (
    <>
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >

      {/* ===== MODE INDIVIDUEL ===== */}

      {!isTeamMode && (
        <>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>JOUEURS</Text>
            {players.length < config.maxPlayers && (
              <Pressable onPress={addPlayer} style={styles.addPlayerBtn}>
                <Ionicons name="add-circle-outline" size={16} color={colors.primary} />
                <Text style={styles.addPlayerText}>Ajouter un joueur</Text>
              </Pressable>
            )}
          </View>

          <View style={styles.playerList}>
            {players.map((player, index) => (
              <View
                key={index}
                style={[styles.playerCard, focusedKey === `p${index}` && styles.playerCardFocused]}
              >
                <View style={[styles.avatar, { backgroundColor: getAvatarColor(index) }]}>
                  <Text style={styles.avatarText}>
                    {player.trim() ? player.trim().slice(0, 2).toUpperCase() : '—'}
                  </Text>
                </View>
                <TextInput
                  placeholder="Nom du joueur"
                  value={player}
                  onChangeText={(text) => updatePlayer(index, text)}
                  onFocus={() => setFocusedKey(`p${index}`)}
                  onBlur={() => setFocusedKey(null)}
                  style={styles.playerInput}
                  placeholderTextColor={colors.textMuted}
                />
                {players.length > 1 && (
                  <Pressable onPress={() => removePlayer(index)}>
                    <Ionicons name="remove-circle-outline" size={22} color={colors.textMuted} />
                  </Pressable>
                )}
              </View>
            ))}
          </View>
        </>
      )}

      {/* ===== MODE ÉQUIPE ===== */}

      {isTeamMode && (
        <>
          <Text style={styles.sectionLabel}>ÉQUIPES</Text>

          {teamPlayers.map((teamMembers, teamIndex) => {
            const teamColor = teamColors[teamIndex];
            const nameFocusKey = `t${teamIndex}_name`;

            return (
              <View key={teamIndex} style={[styles.teamSection, { borderTopColor: teamColor }]}>

                {/* Nom de l'équipe */}
                <View style={styles.teamHeader}>
                  <View style={[styles.teamColorDot, { backgroundColor: teamColor }]} />
                  <TextInput
                    value={teamNames[teamIndex]}
                    onChangeText={(text) => updateTeamName(teamIndex, text)}
                    onFocus={() => setFocusedKey(nameFocusKey)}
                    onBlur={() => setFocusedKey(null)}
                    placeholder={`Équipe ${teamIndex + 1}`}
                    placeholderTextColor={colors.textMuted}
                    style={styles.teamNameInput}
                  />
                  {teamMembers.length < (config.teams?.maxPlayersPerTeam ?? 99) && (
                    <Pressable onPress={() => addTeamPlayer(teamIndex)} style={styles.addPlayerBtn}>
                      <Ionicons name="add-circle-outline" size={16} color={colors.primary} />
                      <Text style={styles.addPlayerText}>Ajouter</Text>
                    </Pressable>
                  )}
                </View>

                {/* Joueurs (sans avatar) */}
                <View style={styles.playerList}>
                  {teamMembers.map((player, playerIndex) => {
                    const focusKey = `t${teamIndex}_p${playerIndex}`;
                    return (
                      <View
                        key={playerIndex}
                        style={[styles.teamPlayerCard, focusedKey === focusKey && styles.playerCardFocused]}
                      >
                        <TextInput
                          placeholder="Nom du joueur"
                          value={player}
                          onChangeText={(text) => updateTeamPlayer(teamIndex, playerIndex, text)}
                          onFocus={() => setFocusedKey(focusKey)}
                          onBlur={() => setFocusedKey(null)}
                          style={styles.playerInput}
                          placeholderTextColor={colors.textMuted}
                        />
                        {teamMembers.length > (config.teams?.minPlayersPerTeam ?? 1) && (
                          <Pressable onPress={() => removeTeamPlayer(teamIndex, playerIndex)}>
                            <Ionicons name="remove-circle-outline" size={22} color={colors.textMuted} />
                          </Pressable>
                        )}
                      </View>
                    );
                  })}
                </View>

              </View>
            );
          })}
        </>
      )}

      {/* ===== PARAMÈTRES DE SESSION ===== */}

      {hasSettings && (
        <>
          <Text style={[styles.sectionLabel, styles.sectionLabelTop]}>
            PARAMÈTRES DE LA PARTIE
          </Text>

          {/* Limite de score */}
          {config.scoreLimit != null && (
            <Pressable style={styles.paramCard} onPress={() => setScoreLimitModalVisible(true)}>
              <View style={styles.paramIconBox}>
                <Ionicons name="flag-outline" size={18} color={colors.textSecondary} />
              </View>
              <Text style={styles.paramLabel}>Limite de score</Text>
              <Text style={styles.paramValue}>{sessionScoreLimit} pts</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.iconMuted} />
            </Pressable>
          )}

          {/* Annonces (quick actions) */}
          {!!config.quickActions?.length && (
            <View style={[styles.paramCard, config.scoreLimit != null && { marginTop: 8 }]}>
              <View style={styles.paramIconBox}>
                <Ionicons name="flash-outline" size={18} color={colors.textSecondary} />
              </View>
              <Text style={styles.paramLabel}>Annonces</Text>
              <Switch
                value={quickActionsEnabled}
                onValueChange={setQuickActionsEnabled}
                trackColor={{ false: colors.searchBackground, true: colors.primaryLight }}
                thumbColor={quickActionsEnabled ? colors.primary : colors.textMuted}
                ios_backgroundColor={colors.searchBackground}
              />
            </View>
          )}
        </>
      )}

      {/* ===== BOUTON NOUVELLE PARTIE ===== */}

      <Pressable
        style={[styles.startButton, !isValidPlayerCount && styles.startButtonDisabled]}
        onPress={startGame}
        disabled={!isValidPlayerCount}
      >
        <Ionicons
          name="add"
          size={20}
          color={isValidPlayerCount ? colors.white : colors.textMuted}
        />
        <Text style={[styles.startText, !isValidPlayerCount && styles.startTextDisabled]}>
          Nouvelle Partie
        </Text>
      </Pressable>

      {/* ===== RÈGLES DU JEU ===== */}

      <Text style={[styles.sectionLabel, styles.sectionLabelTop]}>
        RÈGLES DU JEU
      </Text>

      <View style={styles.rulesCard}>

        <View style={styles.rulesCardHeader}>
          {config.image && (
            <Image source={config.image} style={styles.rulesImage} resizeMode="cover" />
          )}
          <View style={styles.rulesCardMeta}>
            <Text style={styles.rulesGameName}>{config.name}</Text>
            <View style={styles.rulesInfoRow}>
              <Ionicons name="people-outline" size={13} color={colors.textMuted} />
              <Text style={styles.rulesInfoText}>
                {config.minPlayers === config.maxPlayers
                  ? config.minPlayers
                  : `${config.minPlayers}-${config.maxPlayers}`}
              </Text>
              {config.estimatedDuration && (
                <>
                  <Text style={styles.rulesBullet}>·</Text>
                  <Ionicons name="time-outline" size={13} color={colors.textMuted} />
                  <Text style={styles.rulesInfoText}>{config.estimatedDuration} min</Text>
                </>
              )}
              {config.age && (
                <>
                  <Text style={styles.rulesBullet}>·</Text>
                  <Ionicons name="person-outline" size={13} color={colors.textMuted} />
                  <Text style={styles.rulesInfoText}>{config.age}</Text>
                </>
              )}
            </View>
          </View>
        </View>

        {config.description && (
          <Text style={styles.rulesDescription}>{config.description}</Text>
        )}

        {config.detailedRules && (
          <>
            <Pressable
              style={styles.expandButton}
              onPress={() => {
                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                setRulesExpanded(!rulesExpanded);
              }}
            >
              <Text style={styles.expandText}>
                {rulesExpanded ? 'Masquer les règles' : 'Voir les règles complètes'}
              </Text>
              <Ionicons
                name={rulesExpanded ? 'chevron-up' : 'chevron-down'}
                size={16}
                color={colors.primary}
              />
            </Pressable>
            {rulesExpanded && (
              <Text style={styles.rulesDetailed}>{config.detailedRules}</Text>
            )}
          </>
        )}
      </View>
    </ScrollView>

    {/* ===== MODAL LIMITE DE SCORE ===== */}
    <ScoreLimitModal
      visible={scoreLimitModalVisible}
      currentValue={sessionScoreLimit}
      onClose={() => setScoreLimitModalVisible(false)}
      onValidate={(value) => setSessionScoreLimit(value)}
    />
  </>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 48,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 1,
    marginBottom: 12,
  },
  sectionLabelTop: {
    marginTop: 28,
  },

  /* Mode équipe */
  teamSection: {
    marginTop: 16,
    backgroundColor: colors.card,
    borderRadius: 16,
    borderTopWidth: 3,
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 14,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    gap: 12,
  },
  teamHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  teamColorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  teamNameInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    padding: 0,
  },

  /* Bouton ajouter */
  addPlayerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addPlayerText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '600',
  },

  /* Joueurs */
  playerList: {
    gap: 8,
  },
  playerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: 'transparent',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  teamPlayerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  playerCardFocused: {
    borderColor: colors.borderActive,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  playerInput: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
    padding: 0,
  },

  /* Paramètres */
  paramCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  paramIconBox: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: colors.iconBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paramLabel: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
  },
  paramValue: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },

  /* Stepper score limit */
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: colors.searchBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepValue: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    minWidth: 44,
    textAlign: 'center',
  },

  /* Bouton démarrer */
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    marginTop: 28,
    gap: 6,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  startButtonDisabled: {
    backgroundColor: colors.searchBackground,
    shadowOpacity: 0,
    elevation: 0,
  },
  startText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
  },
  startTextDisabled: {
    color: colors.textMuted,
  },

  /* Règles */
  rulesCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  rulesCardHeader: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 12,
  },
  rulesImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
  },
  rulesCardMeta: {
    flex: 1,
    justifyContent: 'center',
  },
  rulesGameName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
  },
  rulesInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rulesInfoText: {
    fontSize: 12,
    color: colors.textMuted,
  },
  rulesBullet: {
    fontSize: 12,
    color: colors.iconMuted,
  },
  rulesDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  expandButton: {
    marginTop: 12,
    paddingTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  expandText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 13,
  },
  rulesDetailed: {
    marginTop: 10,
    fontSize: 13,
    lineHeight: 20,
    color: colors.textSecondary,
  },
});
