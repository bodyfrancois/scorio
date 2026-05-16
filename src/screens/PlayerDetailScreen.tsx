import React, { useMemo } from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { useTranslation } from '../i18n';
import { makePlayerDetailStyles } from '../theme/styles';
import { getGameConfig } from '../games/registry';
import { PlayerStats } from '../utils/statsEngine';

export default function PlayerDetailScreen({ route }: any) {
  const { player } = route.params as { player: PlayerStats };
  const { colors, language } = useTheme();
  const t = useTranslation(language);
  const styles = useMemo(() => makePlayerDetailStyles(colors), [colors]);

  const statRows: { icon: string; iconBg: string; iconColor: string; label: string; value: string }[] = [
    {
      icon: 'game-controller',
      iconBg: colors.primarySubtle,
      iconColor: colors.primary,
      label: t.statsTotalGames,
      value: `${player.games} ${t.statsParties}`,
    },
    {
      icon: 'trophy',
      iconBg: colors.goldSubtle,
      iconColor: colors.goldText,
      label: t.statsVictories,
      value: String(player.wins),
    },
    {
      icon: 'stats-chart',
      iconBg: colors.primarySubtle,
      iconColor: colors.primary,
      label: t.statsWinRate,
      value: `${player.winRate}%`,
    },
    ...(player.streak > 1 ? [{
      icon: 'flame',
      iconBg: colors.goldSubtle,
      iconColor: colors.goldText,
      label: t.statsStreak,
      value: `${player.streak} ${t.statsVictories}`,
    }] : []),
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.pageTitle}>{player.name}</Text>

      {/* Liste de stats */}
      <View style={[styles.card, { marginBottom: 24 }]}>
        {statRows.map((row, i) => (
          <View key={i}>
            {i > 0 && <View style={styles.infoRowDivider} />}
            <View style={styles.infoRow}>
              <View style={[styles.iconBoxPrimary, { backgroundColor: row.iconBg }]}>
                <Ionicons name={row.icon as any} size={16} color={row.iconColor} />
              </View>
              <Text style={[styles.body, { flex: 1 }]}>{row.label}</Text>
              <Text style={styles.itemTitle}>{row.value}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Détail par jeu */}
      {player.gameBreakdown.length > 0 && (
        <>
          <Text style={styles.sectionLabel}>{t.statsGamesSection}</Text>
          <View style={[styles.card, { padding: 0 }]}>
            {player.gameBreakdown.map((g, i) => {
              const config = (() => { try { return getGameConfig(g.gameName) ?? null; } catch { return null; } })();
              return (
                <View key={g.gameName} style={[styles.gameRow, i === 0 && styles.gameRowFirst]}>
                  {config?.image ? (
                    <Image source={config.image} style={styles.gameLogo} resizeMode="cover" />
                  ) : (
                    <View style={styles.gameLogoFallback}>
                      <Ionicons name="game-controller" size={18} color={colors.primary} />
                    </View>
                  )}
                  <Text style={styles.gameName} numberOfLines={1}>{g.gameName}</Text>
                  <Text style={styles.body}>
                    {g.wins} {t.statsVictories} / {g.games} {t.statsParties}
                  </Text>
                </View>
              );
            })}
          </View>
        </>
      )}
    </ScrollView>
  );
}
