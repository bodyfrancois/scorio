import { useMemo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { makeSharedStyles } from '../theme/styles';
import { useTranslation } from '../i18n';
import MedalBadge from './MedalBadge';
import PlayerAvatar from './PlayerAvatar';
import IconPen from './icons/IconPen';
import { PlayerStats } from '../utils/statsEngine';

// ─── manage variant ───────────────────────────────────────────────────────────

type ManageProps = {
  variant: 'manage';
  name: string;
  avatarColor: string;
  onEdit: () => void;
  onDelete: () => void;
};

// ─── stats variant ────────────────────────────────────────────────────────────

type StatsProps = {
  variant: 'stats';
  player: PlayerStats;
  rank: number; // 0-based index → displayed as rank+1
  onPress: () => void;
};

// ─── rank variant ─────────────────────────────────────────────────────────────

type RankProps = {
  variant: 'rank';
  name: string;
  score: number;
  rank: number; // 1-based
};

type Props = ManageProps | StatsProps | RankProps;

export default function PlayerCard(props: Props) {
  const { colors, language } = useTheme();
  const t = useTranslation(language);
  const s = useMemo(() => makeSharedStyles(colors), [colors]);

  if (props.variant === 'manage') {
    return (
      <View style={[s.card, s.cardRow]}>
        <PlayerAvatar name={props.name} color={props.avatarColor} />
        <Text style={[s.bodyMedium, { flex: 1 }]}>{props.name}</Text>
        <View style={{ flexDirection: 'row', gap: 4 }}>
          <Pressable
            style={({ pressed }) => [{ padding: 8 }, pressed && s.pressed]}
            onPress={props.onEdit}
          >
            <IconPen size={18} color={colors.textSecondary} />
          </Pressable>
          <Pressable
            style={({ pressed }) => [{ padding: 8 }, pressed && s.pressed]}
            onPress={props.onDelete}
          >
            <Ionicons name="trash-outline" size={18} color={colors.danger} />
          </Pressable>
        </View>
      </View>
    );
  }

  if (props.variant === 'stats') {
    return (
      <Pressable
        style={({ pressed }) => [
          { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 },
          pressed && { opacity: 0.72 },
        ]}
        onPress={props.onPress}
      >
        <MedalBadge rank={props.rank + 1} />
        <View style={{ flex: 1 }}>
          <Text style={s.itemTitle}>{props.player.name}</Text>
          <Text style={[s.muted, { marginTop: 2 }]}>
            {props.player.wins} {t.statsVictories} / {props.player.games} {t.statsParties}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
      </Pressable>
    );
  }

  // rank variant
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 6 }}>
      <MedalBadge rank={props.rank} />
      <Text style={[s.dd, { flex: 1 }]}>{props.name}</Text>
      <Text style={[s.itemTitle, { marginLeft: 'auto' }]}>{props.score} pts</Text>
    </View>
  );
}
