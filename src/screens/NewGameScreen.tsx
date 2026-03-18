import { useState, useEffect, useMemo } from 'react';
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
import { TEAM_COLORS } from '../theme/colors';
import { lightColors } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { getGameEngine } from '../core/gameEngine';
import ScoreLimitModal from '../components/ScoreLimitModal';
import { useTheme } from '../theme/ThemeContext';
import { useTranslation } from '../i18n';

const makeStyles = (c: typeof lightColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: c.background,
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
      color: c.textSecondary,
      letterSpacing: 1,
      marginBottom: 12,
    },
    sectionLabelTop: {
      marginTop: 28,
    },
    teamSection: {
      marginTop: 16,
      backgroundColor: c.card,
      borderRadius: 16,
      borderTopWidth: 3,
      paddingHorizontal: 14,
      paddingTop: 14,
      paddingBottom: 14,
      shadowColor: c.shadow,
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
      color: c.text,
      padding: 0,
    },
    addPlayerBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    addPlayerText: {
      color: c.primary,
      fontSize: 13,
      fontWeight: '600',
    },
    playerList: {
      gap: 8,
    },
    playerCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: c.card,
      borderRadius: 14,
      paddingVertical: 12,
      paddingHorizontal: 14,
      gap: 12,
      borderWidth: 1,
      borderColor: 'transparent',
      shadowColor: c.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 3,
      elevation: 1,
    },
    teamPlayerCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: c.background,
      borderRadius: 12,
      paddingVertical: 10,
      paddingHorizontal: 12,
      gap: 12,
      borderWidth: 1,
      borderColor: 'transparent',
    },
    playerCardFocused: {
      borderColor: c.borderActive,
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
      color: c.textSecondary,
    },
    playerInput: {
      flex: 1,
      fontSize: 15,
      color: c.text,
      padding: 0,
    },
    paramCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: c.card,
      borderRadius: 14,
      paddingVertical: 14,
      paddingHorizontal: 16,
      gap: 12,
      shadowColor: c.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 3,
      elevation: 1,
    },
    paramIconBox: {
      width: 34,
      height: 34,
      borderRadius: 8,
      backgroundColor: c.iconBackground,
      alignItems: 'center',
      justifyContent: 'center',
    },
    paramLabel: {
      flex: 1,
      fontSize: 15,
      color: c.text,
    },
    paramValue: {
      fontSize: 15,
      fontWeight: '700',
      color: c.text,
    },
    stepper: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    stepBtn: {
      width: 28,
      height: 28,
      borderRadius: 8,
      backgroundColor: c.searchBackground,
      alignItems: 'center',
      justifyContent: 'center',
    },
    stepValue: {
      fontSize: 15,
      fontWeight: '700',
      color: c.text,
      minWidth: 44,
      textAlign: 'center',
    },
    startButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: c.primary,
      borderRadius: 16,
      paddingVertical: 16,
      marginTop: 28,
      gap: 6,
      shadowColor: c.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    startButtonDisabled: {
      backgroundColor: c.searchBackground,
      shadowOpacity: 0,
      elevation: 0,
    },
    startText: {
      fontSize: 16,
      fontWeight: '700',
      color: c.white,
    },
    startTextDisabled: {
      color: c.textMuted,
    },
    rulesCard: {
      backgroundColor: c.card,
      borderRadius: 16,
      padding: 16,
      shadowColor: c.shadow,
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
      color: c.text,
      marginBottom: 6,
    },
    rulesInfoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    rulesInfoText: {
      fontSize: 12,
      color: c.textMuted,
    },
    rulesBullet: {
      fontSize: 12,
      color: c.iconMuted,
    },
    rulesDescription: {
      fontSize: 13,
      color: c.textSecondary,
      lineHeight: 18,
    },
    expandButton: {
      marginTop: 12,
      paddingTop: 12,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderTopWidth: 1,
      borderTopColor: c.border,
    },
    expandText: {
      color: c.primary,
      fontWeight: '600',
      fontSize: 13,
    },
    rulesDetailed: {
      marginTop: 10,
      fontSize: 13,
      lineHeight: 20,
      color: c.textSecondary,
    },
  });

export default function NewGameScreen({ route, navigation }: any) {
  const { colors, language } = useTheme();
  const t = useTranslation(language);
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const { gameName } = route.params ?? { gameName: 'Jeu' };
  const { config } = getGameEngine(gameName);

  const isTeamMode = !!config.teams;

  const [players, setPlayers] = useState<string[]>(['']);

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

  const avatarPalette = [
    colors.avatarViole, colors.avatarRose, colors.avatarPeche, colors.avatarJaune,
    colors.avatarVert, colors.avatarCiel, colors.avatarBleu, colors.avatarFuchsia,
  ];
  const getAvatarColor = (index: number) => avatarPalette[index % avatarPalette.length];

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

  const isValidPlayerCount = isTeamMode
    ? validTeams.every(
        (team) =>
          team.length >= (config.teams?.minPlayersPerTeam ?? 1) &&
          team.length <= (config.teams?.maxPlayersPerTeam ?? 99)
      )
    : validPlayers.length >= config.minPlayers && validPlayers.length <= config.maxPlayers;

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

  const hasSettings = config.scoreLimit != null || !!config.quickActions?.length;

  return (
    <>
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >

      {!isTeamMode && (
        <>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>{t.players}</Text>
            {players.length < config.maxPlayers && (
              <Pressable onPress={addPlayer} style={styles.addPlayerBtn}>
                <Ionicons name="add-circle-outline" size={16} color={colors.primary} />
                <Text style={styles.addPlayerText}>{t.addPlayer}</Text>
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
                  placeholder={t.playerName}
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

      {isTeamMode && (
        <>
          <Text style={styles.sectionLabel}>{t.teams}</Text>

          {teamPlayers.map((teamMembers, teamIndex) => {
            const teamColor = teamColors[teamIndex];
            const nameFocusKey = `t${teamIndex}_name`;

            return (
              <View key={teamIndex} style={[styles.teamSection, { borderTopColor: teamColor }]}>

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
                      <Text style={styles.addPlayerText}>{t.add}</Text>
                    </Pressable>
                  )}
                </View>

                <View style={styles.playerList}>
                  {teamMembers.map((player, playerIndex) => {
                    const focusKey = `t${teamIndex}_p${playerIndex}`;
                    return (
                      <View
                        key={playerIndex}
                        style={[styles.teamPlayerCard, focusedKey === focusKey && styles.playerCardFocused]}
                      >
                        <TextInput
                          placeholder={t.playerName}
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

      {hasSettings && (
        <>
          <Text style={[styles.sectionLabel, styles.sectionLabelTop]}>
            {t.gameSettings}
          </Text>

          {config.scoreLimit != null && (
            <Pressable style={styles.paramCard} onPress={() => setScoreLimitModalVisible(true)}>
              <View style={styles.paramIconBox}>
                <Ionicons name="flag-outline" size={18} color={colors.textSecondary} />
              </View>
              <Text style={styles.paramLabel}>{t.scoreLimit}</Text>
              <Text style={styles.paramValue}>{sessionScoreLimit} pts</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.iconMuted} />
            </Pressable>
          )}

          {!!config.quickActions?.length && (
            <View style={[styles.paramCard, config.scoreLimit != null && { marginTop: 8 }]}>
              <View style={styles.paramIconBox}>
                <Ionicons name="flash-outline" size={18} color={colors.textSecondary} />
              </View>
              <Text style={styles.paramLabel}>{t.announcements}</Text>
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
          {t.newGame}
        </Text>
      </Pressable>

      <Text style={[styles.sectionLabel, styles.sectionLabelTop]}>
        {t.gameRules}
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
                {rulesExpanded ? t.hideRules : t.showRules}
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

    <ScoreLimitModal
      visible={scoreLimitModalVisible}
      currentValue={sessionScoreLimit}
      onClose={() => setScoreLimitModalVisible(false)}
      onValidate={(value) => setSessionScoreLimit(value)}
    />
  </>
  );
}
