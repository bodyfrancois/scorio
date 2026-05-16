import { useState, useEffect, useMemo } from 'react';
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
  Image,
  Switch,
} from 'react-native';
import { useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { loadFavorites } from '../storage/favoritePlayers';
import { TEAM_COLORS } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { getGameEngine } from '../core/gameEngine';
import ScoreLimitModal from '../components/ScoreLimitModal';
import { useTheme } from '../theme/ThemeContext';
import { useTranslation } from '../i18n';
import { makeNewGameStyles } from '../theme/styles';


export default function NewGameScreen({ route, navigation }: any) {
  const { colors, language } = useTheme();
  const t = useTranslation(language);
  const styles = useMemo(() => makeNewGameStyles(colors), [colors]);

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
  const [sessionRoundLimit, setSessionRoundLimit] = useState<number>(config.roundLimit ?? 10);
  const [quickActionsEnabled, setQuickActionsEnabled] = useState<boolean>(!!config.quickActions?.length);
  const [scoreLimitModalVisible, setScoreLimitModalVisible] = useState(false);
  const [roundLimitModalVisible, setRoundLimitModalVisible] = useState(false);

  const [rulesExpanded, setRulesExpanded] = useState(false);
  const [focusedKey, setFocusedKey] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

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

  const [favSheetVisible, setFavSheetVisible] = useState(false);
  const [favTargetIndex, setFavTargetIndex] = useState<number | null>(null);
  const [favTeamTarget, setFavTeamTarget] = useState<{ teamIndex: number; playerIndex: number } | null>(null);

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

  const selectFavorite = (name: string) => {
    if (favTeamTarget !== null) {
      updateTeamPlayer(favTeamTarget.teamIndex, favTeamTarget.playerIndex, name);
      setFavTeamTarget(null);
    } else if (favTargetIndex !== null) {
      updatePlayer(favTargetIndex, name);
    }
    setFavSheetVisible(false);
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
        sessionRoundLimit: config.roundLimit != null ? sessionRoundLimit : undefined,
        sessionQuickActions,
      });
    } else {
      navigation.navigate('Scoreboard', {
        gameName,
        players: validPlayers,
        sessionScoreLimit: config.scoreLimit != null ? sessionScoreLimit : undefined,
        sessionRoundLimit: config.roundLimit != null ? sessionRoundLimit : undefined,
        sessionQuickActions,
      });
    }
  };

  const hasSettings = config.scoreLimit != null || config.roundLimit != null || !!config.quickActions?.length;

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
            <Text style={[styles.sectionLabel, styles.sectionLabelNoMargin]}>{t.players}</Text>
            {players.length < config.maxPlayers && (
              <Pressable onPress={addPlayer} style={styles.addBtn}>
                <Ionicons name="add-circle-outline" size={16} color={colors.primary} />
                <Text style={styles.addBtnText}>{t.addPlayer}</Text>
              </Pressable>
            )}
          </View>

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
                {favorites.length > 0 && (
                  <Pressable onPress={() => openFavSheet(index)} hitSlop={8}>
                    <Ionicons name="star-outline" size={20} color={colors.primary} />
                  </Pressable>
                )}
                {players.length > 1 && (
                  <Pressable onPress={() => removePlayer(index)} hitSlop={8}>
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
                    <Pressable onPress={() => addTeamPlayer(teamIndex)} style={styles.addBtn}>
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
                        />
                        {favorites.length > 0 && (
                          <Pressable onPress={() => openFavSheetTeam(teamIndex, playerIndex)} hitSlop={8}>
                            <Ionicons name="star-outline" size={20} color={colors.primary} />
                          </Pressable>
                        )}
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
            <Pressable style={[styles.card, styles.cardRow]} onPress={() => setScoreLimitModalVisible(true)}>
              <View style={styles.iconBoxSm}>
                <Ionicons name="flag-outline" size={18} color={colors.textSecondary} />
              </View>
              <Text style={[styles.body, { flex: 1 }]}>{t.scoreLimit}</Text>
              <Text style={styles.itemTitle}>{sessionScoreLimit} pts</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.iconMuted} />
            </Pressable>
          )}

          {config.roundLimit != null && (
            <Pressable
              style={[[styles.card, styles.cardRow], config.scoreLimit != null && { marginTop: 8 }]}
              onPress={() => setRoundLimitModalVisible(true)}
            >
              <View style={styles.iconBoxSm}>
                <Ionicons name="refresh-outline" size={18} color={colors.textSecondary} />
              </View>
              <Text style={[styles.body, { flex: 1 }]}>{t.roundLimit}</Text>
              <Text style={styles.itemTitle}>{sessionRoundLimit}</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.iconMuted} />
            </Pressable>
          )}

          {!!config.quickActions?.length && (
            <View style={[[styles.card, styles.cardRow], config.scoreLimit != null && { marginTop: 8 }]}>
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
        </>
      )}

      <Pressable
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

      <View style={styles.card}>

        <View style={styles.rulesCardHeader}>
          {config.image && (
            <Image source={config.image} style={styles.rulesImage} resizeMode="cover" />
          )}
          <View style={styles.rulesCardMeta}>
            <Text style={[styles.itemTitle, { marginBottom: 6 }]}>{config.name}</Text>
            <View style={styles.rulesInfoRow}>
              <Ionicons name="people-outline" size={13} color={colors.textMuted} />
              <Text style={styles.muted}>
                {config.minPlayers === config.maxPlayers
                  ? config.minPlayers
                  : `${config.minPlayers}-${config.maxPlayers}`}
              </Text>
              {config.estimatedDuration && (
                <>
                  <Text style={styles.muted}>·</Text>
                  <Ionicons name="time-outline" size={13} color={colors.textMuted} />
                  <Text style={styles.muted}>{config.estimatedDuration} min</Text>
                </>
              )}
              {config.age && (
                <>
                  <Text style={styles.muted}>·</Text>
                  <Ionicons name="person-outline" size={13} color={colors.textMuted} />
                  <Text style={styles.muted}>{config.age}</Text>
                </>
              )}
            </View>
          </View>
        </View>

        {config.description && (
          <Text style={[styles.caption, { lineHeight: 18 }]}>{config.description}</Text>
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
              <Text style={styles.addBtnText}>
                {rulesExpanded ? t.hideRules : t.showRules}
              </Text>
              <Ionicons
                name={rulesExpanded ? 'chevron-up' : 'chevron-down'}
                size={16}
                color={colors.primary}
              />
            </Pressable>
            {rulesExpanded && (
              <Text style={[styles.caption, { marginTop: 10, lineHeight: 20 }]}>{config.detailedRules}</Text>
            )}
          </>
        )}
      </View>
    </ScrollView>

    <Modal visible={favSheetVisible} transparent animationType="slide">
      <Pressable style={styles.overlay} onPress={() => setFavSheetVisible(false)}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          <Text style={[styles.labelPrimary, { marginBottom: 4 }]}>{t.fromFavorites}</Text>
          {favorites.map((name, i) => (
            <Pressable
              key={name}
              style={({ pressed }) => [
                styles.favItem,
                i === favorites.length - 1 && styles.favItemLast,
                pressed && styles.cardPressed,
              ]}
              onPress={() => selectFavorite(name)}
            >
              <View style={[styles.favAvatar, { backgroundColor: avatarPalette[i % avatarPalette.length] }]}>
                <Text style={styles.avatarText}>{name.slice(0, 2).toUpperCase()}</Text>
              </View>
              <Text style={[styles.bodyMedium, { flex: 1 }]}>{name}</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.iconMuted} />
            </Pressable>
          ))}
        </Pressable>
      </Pressable>
    </Modal>

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
  </>
  );
}
