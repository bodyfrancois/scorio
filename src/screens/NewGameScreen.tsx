import { useState, useEffect, useLayoutEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Modal,
  Alert,
  LayoutAnimation,
  Platform,
  UIManager,
  ScrollView,
  Switch,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { loadFavorites, FavoritePlayer } from '../storage/favoritePlayers';
import { TEAM_COLORS } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { getGameEngine } from '../core/gameEngine';
import ScoreLimitModal from '../components/ScoreLimitModal';
import { useTheme } from '../theme/ThemeContext';
import { useTranslation } from '../i18n';
import { makeNewGameStyles } from '../theme/styles';
import PlayerAvatar from '../components/PlayerAvatar';
import { getAvatarColorByIndex, getAvatarColorByKey } from '../utils/avatarColors';
import GameRulesCard from '../components/GameRulesCard';
import FavoritesSheet from '../components/FavoritesSheet';
import TeamsToggleCard from '../components/TeamsToggleCard';


export default function NewGameScreen({ route, navigation }: any) {
  const { colors, language } = useTheme();
  const t = useTranslation(language);
  const styles = useMemo(() => makeNewGameStyles(colors), [colors]);

  const { gameName } = route.params ?? { gameName: 'Jeu' };
  const { config } = getGameEngine(gameName);

  useLayoutEffect(() => {
    navigation.setOptions({ title: t.newGame });
  }, [navigation, t.newGame]);

  const [players, setPlayers] = useState<string[]>(['']);
  const [playerColorKeys, setPlayerColorKeys] = useState<(string | null)[]>([null]);

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
  const [sessionGameName, setSessionGameName] = useState('');
  const [sessionScoreLimit, setSessionScoreLimit] = useState<number>(config.scoreLimit ?? 500);
  const [sessionRoundLimit, setSessionRoundLimit] = useState<number>(config.roundLimit ?? 10);
  const [sessionLowestScoreWins, setSessionLowestScoreWins] = useState<boolean>(config.lowestScoreWins);
  const [sessionTimeLimit, setSessionTimeLimit] = useState<number | null>(null);
  const [timeLimitEnabled, setTimeLimitEnabled] = useState(false);
  const [roundLimitEnabled, setRoundLimitEnabled] = useState(false);
  const [teamsEnabled, setTeamsEnabled] = useState(false);
  const [sessionTeamCount, setSessionTeamCount] = useState(2);
  const [sessionPlayersPerTeam, setSessionPlayersPerTeam] = useState(2);
  const [quickActionsEnabled, setQuickActionsEnabled] = useState<boolean>(!!config.quickActions?.length);
  const [scoreLimitEnabled, setScoreLimitEnabled] = useState(false);
  const [scoreLimitModalVisible, setScoreLimitModalVisible] = useState(false);
  const [roundLimitModalVisible, setRoundLimitModalVisible] = useState(false);
  const [timeLimitModalVisible, setTimeLimitModalVisible] = useState(false);

  const [focusedKey, setFocusedKey] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<FavoritePlayer[]>([]);
  const [favSheetVisible, setFavSheetVisible] = useState(false);
  const [favTargetIndex, setFavTargetIndex] = useState<number | null>(null);
  const [favTeamTarget, setFavTeamTarget] = useState<{ teamIndex: number; playerIndex: number } | null>(null);

  useFocusEffect(useCallback(() => {
    loadFavorites().then(setFavorites);
  }, []));

  useEffect(() => {
    if (
      Platform.OS === 'android' &&
      UIManager.setLayoutAnimationEnabledExperimental
    ) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  const isTeamMode = !!config.teams || (!!config.teamsToggle && teamsEnabled);
  const effectiveTeams = config.teams ?? (isTeamMode ? {
    count: sessionTeamCount,
    minPlayersPerTeam: 1,
    maxPlayersPerTeam: 10,
  } : undefined);
  const teamColors = Array.from(
    { length: effectiveTeams?.count ?? 0 },
    (_, i) => TEAM_COLORS[i % TEAM_COLORS.length]
  );

  useEffect(() => {
    if (config.teams) return;
    if (!teamsEnabled) { setTeamPlayers([]); setTeamNames([]); return; }
    setTeamPlayers(Array.from({ length: sessionTeamCount }, () =>
      Array.from({ length: sessionPlayersPerTeam }, () => '')
    ));
    setTeamNames(Array.from({ length: sessionTeamCount }, (_, i) => `Équipe ${i + 1}`));
  }, [teamsEnabled, sessionTeamCount, sessionPlayersPerTeam]);

  const getAvatarColor = (index: number) => {
    const key = playerColorKeys[index];
    return key ? getAvatarColorByKey(key, colors) : getAvatarColorByIndex(index, colors);
  };

  const updatePlayer = (index: number, value: string) => {
    const updated = [...players];
    updated[index] = value;
    setPlayers(updated);
  };

  const openFavSheet = (index: number) => {
    setFavTeamTarget(null);
    setFavTargetIndex(index);
    setFavSheetVisible(true);
  };

  const openFavSheetTeam = (teamIndex: number, playerIndex: number) => {
    setFavTargetIndex(null);
    setFavTeamTarget({ teamIndex, playerIndex });
    setFavSheetVisible(true);
  };

  const selectFavorite = (fav: FavoritePlayer) => {
    if (favTeamTarget !== null) {
      updateTeamPlayer(favTeamTarget.teamIndex, favTeamTarget.playerIndex, fav.name);
      setFavTeamTarget(null);
    } else if (favTargetIndex !== null) {
      updatePlayer(favTargetIndex, fav.name);
      setPlayerColorKeys((prev) => {
        const next = [...prev];
        next[favTargetIndex] = fav.colorKey;
        return next;
      });
    }
    setFavSheetVisible(false);
  };

  const addPlayer = () => {
    if (players.length < config.maxPlayers) {
      setPlayers([...players, '']);
      setPlayerColorKeys([...playerColorKeys, null]);
    }
  };

  const removePlayer = (index: number) => {
    setPlayers(players.filter((_, i) => i !== index));
    setPlayerColorKeys(playerColorKeys.filter((_, i) => i !== index));
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
    if (!effectiveTeams) return;
    if (teamPlayers[teamIndex].length >= effectiveTeams.maxPlayersPerTeam) return;
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

  const duplicateNames = useMemo(() => {
    const allNames = isTeamMode
      ? teamPlayers.flat().map((p) => p.trim().toLowerCase()).filter(Boolean)
      : players.map((p) => p.trim().toLowerCase()).filter(Boolean);
    const seen = new Set<string>();
    const dupes = new Set<string>();
    allNames.forEach((n) => { if (seen.has(n)) dupes.add(n); else seen.add(n); });
    return dupes;
  }, [isTeamMode, players, teamPlayers]);

  const isValidPlayerCount = isTeamMode
    ? validTeams.every(
        (team) =>
          team.length >= (effectiveTeams?.minPlayersPerTeam ?? 1) &&
          team.length <= (effectiveTeams?.maxPlayersPerTeam ?? 99)
      )
    : validPlayers.length >= config.minPlayers && validPlayers.length <= config.maxPlayers;

  const startGame = () => {
    if (!isValidPlayerCount) {
      Alert.alert(
        'Configuration invalide',
        isTeamMode
          ? `Chaque équipe doit avoir entre ${effectiveTeams!.minPlayersPerTeam} et ${effectiveTeams!.maxPlayersPerTeam} joueur(s).`
          : `Le nombre de joueurs doit être entre ${config.minPlayers} et ${config.maxPlayers}.`
      );
      return;
    }

    const sessionQuickActions = quickActionsEnabled ? config.quickActions : undefined;
    const displayName = config.cardSubtitle
      ? (sessionGameName.trim() || t.freeGameDefaultName)
      : undefined;
    const resolvedRoundLimit = (config.roundLimit != null || roundLimitEnabled) ? sessionRoundLimit : undefined;
    const resolvedTimeLimit = timeLimitEnabled ? (sessionTimeLimit ?? 30) : undefined;
    const resolvedScoreLimit = config.scoreLimitToggle
      ? (scoreLimitEnabled ? sessionScoreLimit : undefined)
      : (config.scoreLimit != null ? sessionScoreLimit : undefined);

    if (isTeamMode) {
      navigation.navigate('Scoreboard', {
        gameName,
        displayName,
        players: validTeams.map((_, i) => teamNames[i]?.trim() || `Équipe ${i + 1}`),
        teams: validTeams,
        teamColors,
        sessionScoreLimit: resolvedScoreLimit,
        sessionRoundLimit: resolvedRoundLimit,
        sessionTimeLimit: resolvedTimeLimit,
        sessionQuickActions,
      });
    } else {
      const validIndices = players.reduce<number[]>((acc, p, i) => {
        if (p.trim().length > 0) acc.push(i);
        return acc;
      }, []);
      const validPlayerColors = validIndices.map((i) => {
        const key = playerColorKeys[i];
        return key ? getAvatarColorByKey(key, colors) : getAvatarColorByIndex(i, colors);
      });
      navigation.navigate('Scoreboard', {
        gameName,
        displayName,
        players: validPlayers,
        playerColors: validPlayerColors,
        sessionScoreLimit: resolvedScoreLimit,
        sessionRoundLimit: resolvedRoundLimit,
        sessionTimeLimit: resolvedTimeLimit,
        sessionLowestScoreWins: config.lowestScoreWinsToggle ? sessionLowestScoreWins : undefined,
        sessionQuickActions,
      });
    }
  };

  const hasSettings = config.scoreLimit != null || config.roundLimit != null || !!config.quickActions?.length || !!config.lowestScoreWinsToggle || !!config.timeLimitToggle || !!config.roundLimitToggle || !!config.scoreLimitToggle || !!config.teamsToggle || !!config.cardSubtitle;

  return (
    <>
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >

      {!!config.cardSubtitle && (
        <View style={[styles.card, styles.cardRow]}>
          <View style={styles.iconBoxSm}>
            <Ionicons name="create-outline" size={18} color={colors.textSecondary} />
          </View>
          <TextInput
            style={styles.playerInput}
            placeholder={t.gameNamePlaceholder}
            placeholderTextColor={colors.textMuted}
            value={sessionGameName}
            onChangeText={setSessionGameName}
            accessibilityLabel={t.gameNamePlaceholder}
          />
        </View>
      )}

      {config.teamsToggle && (
        <TeamsToggleCard
          enabled={teamsEnabled}
          onToggle={setTeamsEnabled}
          teamCount={sessionTeamCount}
          onTeamCountChange={setSessionTeamCount}
          playersPerTeam={sessionPlayersPerTeam}
          onPlayersPerTeamChange={setSessionPlayersPerTeam}
        />
      )}

      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionLabel, styles.sectionLabelNoMargin]}>
          {isTeamMode ? t.teams : t.players}
        </Text>
        {!isTeamMode && players.length < config.maxPlayers && (
          <Pressable accessibilityRole="button" onPress={addPlayer} style={styles.addBtn}>
            <Ionicons name="add-circle-outline" size={16} color={colors.primary} />
            <Text style={styles.addBtnText}>{t.addPlayer}</Text>
          </Pressable>
        )}
      </View>

      {!isTeamMode && (
        <View>
          {players.map((player, index) => (
            <View
              key={index}
              style={[
                [styles.card, styles.cardRow],
                focusedKey === `p${index}` && styles.playerCardFocused,
                duplicateNames.has(player.trim().toLowerCase()) && styles.playerCardDuplicate,
              ]}
            >
              <PlayerAvatar name={player.trim() || '—'} color={getAvatarColor(index)} />
              <TextInput
                placeholder={t.playerName}
                value={player}
                onChangeText={(text) => updatePlayer(index, text)}
                onFocus={() => setFocusedKey(`p${index}`)}
                onBlur={() => setFocusedKey(null)}
                style={styles.playerInput}
                placeholderTextColor={colors.textMuted}
                accessibilityLabel={`${t.playerName} ${index + 1}`}
              />
              {favorites.length > 0 && (
                <Pressable
                  onPress={() => openFavSheet(index)}
                  hitSlop={8}
                  accessibilityRole="button"
                  accessibilityLabel={t.addFavoritePlayer}
                >
                  <Ionicons name="star-outline" size={20} color={colors.primary} />
                </Pressable>
              )}
              {players.length > 1 && (
                <Pressable
                  onPress={() => removePlayer(index)}
                  hitSlop={8}
                  accessibilityRole="button"
                  accessibilityLabel={t.removePlayerAction}
                >
                  <Ionicons name="remove-circle-outline" size={22} color={colors.textMuted} />
                </Pressable>
              )}
            </View>
          ))}
        </View>
      )}

      {isTeamMode && (
        <>
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
                    accessibilityLabel={`Nom de l'équipe ${teamIndex + 1}`}
                  />
                  {teamMembers.length < (effectiveTeams?.maxPlayersPerTeam ?? 99) && (
                    <Pressable accessibilityRole="button" onPress={() => addTeamPlayer(teamIndex)} style={styles.addBtn}>
                      <Ionicons name="add-circle-outline" size={16} color={colors.primary} />
                      <Text style={styles.addBtnText}>{t.add}</Text>
                    </Pressable>
                  )}
                </View>

                <View style={styles.playerList}>
                  {teamMembers.map((player, playerIndex) => {
                    const focusKey = `t${teamIndex}_p${playerIndex}`;
                    return (
                      <View
                        key={playerIndex}
                        style={[
                          styles.teamPlayerCard,
                          focusedKey === focusKey && styles.playerCardFocused,
                          duplicateNames.has(player.trim().toLowerCase()) && styles.playerCardDuplicate,
                        ]}
                      >
                        <TextInput
                          placeholder={t.playerName}
                          value={player}
                          onChangeText={(text) => updateTeamPlayer(teamIndex, playerIndex, text)}
                          onFocus={() => setFocusedKey(focusKey)}
                          onBlur={() => setFocusedKey(null)}
                          style={styles.playerInput}
                          placeholderTextColor={colors.textMuted}
                          accessibilityLabel={`${t.playerName} ${playerIndex + 1} – Équipe ${teamIndex + 1}`}
                        />
                        {favorites.length > 0 && (
                          <Pressable
                            onPress={() => openFavSheetTeam(teamIndex, playerIndex)}
                            hitSlop={8}
                            accessibilityRole="button"
                            accessibilityLabel={t.addFavoritePlayer}
                          >
                            <Ionicons name="star-outline" size={20} color={colors.primary} />
                          </Pressable>
                        )}
                        {teamMembers.length > (effectiveTeams?.minPlayersPerTeam ?? 1) && (
                          <Pressable
                            onPress={() => removeTeamPlayer(teamIndex, playerIndex)}
                            accessibilityRole="button"
                            accessibilityLabel={t.removePlayerAction}
                          >
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

          {config.scoreLimit != null && !config.scoreLimitToggle && (
            <Pressable accessibilityRole="button" style={[styles.card, styles.cardRow]} onPress={() => setScoreLimitModalVisible(true)}>
              <View style={styles.iconBoxSm}>
                <Ionicons name="flag-outline" size={18} color={colors.textSecondary} />
              </View>
              <Text style={[styles.body, { flex: 1 }]}>{t.scoreLimit}</Text>
              <Text style={styles.itemTitle}>{sessionScoreLimit} pts</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.iconMuted} />
            </Pressable>
          )}

          {config.roundLimit != null && (
            <Pressable accessibilityRole="button" style={[styles.card, styles.cardRow]} onPress={() => setScoreLimitModalVisible(true)}>
              <View style={styles.iconBoxSm}>
                <Ionicons name="refresh-outline" size={18} color={colors.textSecondary} />
              </View>
              <Text style={[styles.body, { flex: 1 }]}>{t.roundLimit}</Text>
              <Text style={styles.itemTitle}>{sessionRoundLimit}</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.iconMuted} />
            </Pressable>
          )}

          {!!config.quickActions?.length && (
            <View style={[styles.card, styles.cardRow]}>
              <View style={styles.iconBoxSm}>
                <Ionicons name="flash-outline" size={18} color={colors.textSecondary} />
              </View>
              <Text style={[styles.body, { flex: 1 }]}>{t.announcements}</Text>
              <Switch
                value={quickActionsEnabled}
                onValueChange={setQuickActionsEnabled}
                trackColor={{ false: colors.searchBackground, true: colors.primaryLight }}
                thumbColor={quickActionsEnabled ? colors.primary : colors.textMuted}
                ios_backgroundColor={colors.searchBackground}
              />
            </View>
          )}

          {config.scoreLimitToggle && (
            <View style={[styles.card, { marginTop: 0 }]}>
              <View style={styles.settingToggleRow}>
                <View style={styles.iconBoxSm}>
                  <Ionicons name="flag-outline" size={18} color={colors.textSecondary} />
                </View>
                <Text style={[styles.body, { flex: 1 }]}>{t.scoreLimit}</Text>
                <Switch
                  value={scoreLimitEnabled}
                  onValueChange={setScoreLimitEnabled}
                  trackColor={{ false: colors.searchBackground, true: colors.primaryLight }}
                  thumbColor={scoreLimitEnabled ? colors.primary : colors.textMuted}
                  ios_backgroundColor={colors.searchBackground}
                />
              </View>
              {scoreLimitEnabled && (
                <>
                  <View style={styles.settingDivider} />
                  <Pressable accessibilityRole="button" style={styles.settingSubRow} onPress={() => setScoreLimitModalVisible(true)}>
                    <Text style={[styles.body, { flex: 1 }]}>{t.scoreLimitGoal}</Text>
                    <Text style={styles.itemTitle}>{sessionScoreLimit} pts</Text>
                    <Ionicons name="chevron-forward" size={16} color={colors.iconMuted} />
                  </Pressable>
                </>
              )}
            </View>
          )}

          {config.timeLimitToggle && (
            <View style={[styles.card, { marginTop: 0 }]}>
              <View style={styles.settingToggleRow}>
                <View style={styles.iconBoxSm}>
                  <Ionicons name="timer-outline" size={18} color={colors.textSecondary} />
                </View>
                <Text style={[styles.body, { flex: 1 }]}>{t.timeLimit}</Text>
                <Switch
                  value={timeLimitEnabled}
                  onValueChange={setTimeLimitEnabled}
                  trackColor={{ false: colors.searchBackground, true: colors.primaryLight }}
                  thumbColor={timeLimitEnabled ? colors.primary : colors.textMuted}
                  ios_backgroundColor={colors.searchBackground}
                />
              </View>
              {timeLimitEnabled && (
                <>
                  <View style={styles.settingDivider} />
                  <Pressable accessibilityRole="button" style={styles.settingSubRow} onPress={() => setTimeLimitModalVisible(true)}>
                    <Text style={[styles.body, { flex: 1 }]}>{t.duration}</Text>
                    <Text style={styles.itemTitle}>{sessionTimeLimit ?? 30} min</Text>
                    <Ionicons name="chevron-forward" size={16} color={colors.iconMuted} />
                  </Pressable>
                </>
              )}
            </View>
          )}

          {config.roundLimitToggle && (
            <View style={[styles.card, { marginTop: 0 }]}>
              <View style={styles.settingToggleRow}>
                <View style={styles.iconBoxSm}>
                  <Ionicons name="refresh-outline" size={18} color={colors.textSecondary} />
                </View>
                <Text style={[styles.body, { flex: 1 }]}>{t.roundLimitToggleLabel}</Text>
                <Switch
                  value={roundLimitEnabled}
                  onValueChange={setRoundLimitEnabled}
                  trackColor={{ false: colors.searchBackground, true: colors.primaryLight }}
                  thumbColor={roundLimitEnabled ? colors.primary : colors.textMuted}
                  ios_backgroundColor={colors.searchBackground}
                />
              </View>
              {roundLimitEnabled && (
                <>
                  <View style={styles.settingDivider} />
                  <Pressable accessibilityRole="button" style={styles.settingSubRow} onPress={() => setRoundLimitModalVisible(true)}>
                    <Text style={[styles.body, { flex: 1 }]}>{t.roundCount}</Text>
                    <Text style={styles.itemTitle}>{sessionRoundLimit}</Text>
                    <Ionicons name="chevron-forward" size={16} color={colors.iconMuted} />
                  </Pressable>
                </>
              )}
            </View>
          )}

          {config.lowestScoreWinsToggle && (
            <View style={[styles.card]}>
              <View style={[styles.cardRow, { marginBottom: 12, borderWidth: 0 }]}>
                <View style={styles.iconBoxSm}>
                  <Ionicons name="podium-outline" size={18} color={colors.textSecondary} />
                </View>
                <Text style={styles.body}>{t.winnerMode}</Text>
              </View>
              <View style={[styles.radioRow, { gap: 8 }]}>
                <Pressable
                  style={[styles.radioOption, !sessionLowestScoreWins && styles.radioOptionSelected]}
                  onPress={() => setSessionLowestScoreWins(false)}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: !sessionLowestScoreWins }}
                >
                  <View style={[styles.radioCircle, !sessionLowestScoreWins && styles.radioCircleSelected]} />
                  <Text style={[styles.caption, !sessionLowestScoreWins && { color: colors.primary }]}>{t.highestWins}</Text>
                </Pressable>
                <Pressable
                  style={[styles.radioOption, sessionLowestScoreWins && styles.radioOptionSelected]}
                  onPress={() => setSessionLowestScoreWins(true)}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: sessionLowestScoreWins }}
                >
                  <View style={[styles.radioCircle, sessionLowestScoreWins && styles.radioCircleSelected]} />
                  <Text style={[styles.caption, sessionLowestScoreWins && { color: colors.primary }]}>{t.lowestWins}</Text>
                </Pressable>
              </View>
            </View>
          )}
        </>
      )}

      <Pressable accessibilityRole="button"
        style={({ pressed }) => [
          styles.btnPrimary, styles.btnPrimaryBig, styles.startButtonLayout,
          (!isValidPlayerCount || duplicateNames.size > 0) && styles.startButtonDisabled,
          pressed && isValidPlayerCount && duplicateNames.size === 0 && styles.pressed,
        ]}
        onPress={startGame}
        disabled={!isValidPlayerCount || duplicateNames.size > 0}
      >
        <Text style={styles.btnPrimaryText}>
          {t.newGame}
        </Text>
      </Pressable>

      <Text style={[styles.sectionLabel, styles.sectionLabelTop]}>
        {t.gameRules}
      </Text>

      <GameRulesCard config={config} />

    </ScrollView>

    <FavoritesSheet
      visible={favSheetVisible}
      favorites={favorites}
      onClose={() => setFavSheetVisible(false)}
      onSelect={selectFavorite}
    />

    <ScoreLimitModal
      visible={scoreLimitModalVisible}
      currentValue={sessionScoreLimit}
      onClose={() => setScoreLimitModalVisible(false)}
      onValidate={(value) => setSessionScoreLimit(value)}
    />

    <ScoreLimitModal
      visible={roundLimitModalVisible}
      currentValue={sessionRoundLimit}
      onClose={() => setRoundLimitModalVisible(false)}
      onValidate={(value) => setSessionRoundLimit(value)}
      title={t.roundLimitTitle}
      subtitle={t.roundLimitSubtitle}
      unit=""
      minValue={1}
    />

    <ScoreLimitModal
      visible={timeLimitModalVisible}
      currentValue={sessionTimeLimit ?? 30}
      onClose={() => setTimeLimitModalVisible(false)}
      onValidate={(value) => setSessionTimeLimit(value)}
      title={t.timeLimitTitle}
      subtitle={t.timeLimitSubtitle}
      unit="min"
      minValue={1}
    />
  </>
  );
}
