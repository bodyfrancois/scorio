import { useMemo } from 'react';
import { View, Text, Pressable, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { useTranslation } from '../i18n';
import { makeNewGameStyles } from '../theme/styles';

type Props = {
  enabled: boolean;
  onToggle: (v: boolean) => void;
  teamCount: number;
  onTeamCountChange: (v: number) => void;
  playersPerTeam: number;
  onPlayersPerTeamChange: (v: number) => void;
};

export default function TeamsToggleCard({
  enabled,
  onToggle,
  teamCount,
  onTeamCountChange,
  playersPerTeam,
  onPlayersPerTeamChange,
}: Props) {
  const { colors, language } = useTheme();
  const t = useTranslation(language);
  const styles = useMemo(() => makeNewGameStyles(colors), [colors]);

  return (
    <View style={[styles.card, { marginBottom: 40 }]}>
      <View style={styles.settingToggleRow}>
        <View style={styles.iconBoxSm}>
          <Ionicons name="people-outline" size={18} color={colors.textSecondary} />
        </View>
        <Text style={[styles.body, { flex: 1 }]}>{t.teamMode}</Text>
        <Switch
          value={enabled}
          onValueChange={onToggle}
          trackColor={{ false: colors.searchBackground, true: colors.primaryLight }}
          thumbColor={enabled ? colors.primary : colors.textMuted}
          ios_backgroundColor={colors.searchBackground}
        />
      </View>

      {enabled && (
        <>
          <View style={styles.settingDivider} />
          <View style={styles.settingSubRow}>
            <Text style={[styles.body, { flex: 1 }]}>{t.teamCount}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Pressable
                onPress={() => onTeamCountChange(Math.max(2, teamCount - 1))}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel={t.decreaseTeamCount}
              >
                <Ionicons name="remove-circle-outline" size={22} color={teamCount > 2 ? colors.primary : colors.textMuted} />
              </Pressable>
              <Text style={styles.itemTitle}>{teamCount}</Text>
              <Pressable
                onPress={() => onTeamCountChange(Math.min(8, teamCount + 1))}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel={t.increaseTeamCount}
              >
                <Ionicons name="add-circle-outline" size={22} color={teamCount < 8 ? colors.primary : colors.textMuted} />
              </Pressable>
            </View>
          </View>

          <View style={styles.settingDivider} />
          <View style={styles.settingSubRow}>
            <Text style={[styles.body, { flex: 1 }]}>{t.playersPerTeam}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Pressable
                onPress={() => onPlayersPerTeamChange(Math.max(1, playersPerTeam - 1))}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel={t.decreasePlayersPerTeam}
              >
                <Ionicons name="remove-circle-outline" size={22} color={playersPerTeam > 1 ? colors.primary : colors.textMuted} />
              </Pressable>
              <Text style={styles.itemTitle}>{playersPerTeam}</Text>
              <Pressable
                onPress={() => onPlayersPerTeamChange(Math.min(5, playersPerTeam + 1))}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel={t.increasePlayersPerTeam}
              >
                <Ionicons name="add-circle-outline" size={22} color={playersPerTeam < 5 ? colors.primary : colors.textMuted} />
              </Pressable>
            </View>
          </View>
        </>
      )}
    </View>
  );
}
