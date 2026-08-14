import { useState, useMemo } from 'react';
import { View, Text, Pressable, Image, LayoutAnimation } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { useTranslation } from '../i18n';
import { makeNewGameStyles } from '../theme/styles';
import { GameConfig } from '../core/types';
import { localizeGameConfig } from '../utils/gameLocalization';

type Props = {
  config: GameConfig;
};

export default function GameRulesCard({ config }: Props) {
  const { colors, language } = useTheme();
  const t = useTranslation(language);
  const styles = useMemo(() => makeNewGameStyles(colors), [colors]);
  const [expanded, setExpanded] = useState(false);
  const { displayName, description, detailedRules } = localizeGameConfig(config, language);

  return (
    <View style={styles.card}>
      <View style={styles.rulesCardHeader}>
        {config.image && (
          <Image source={config.image} style={styles.rulesImage} resizeMode="cover" accessible={false} />
        )}
        <View style={styles.rulesCardMeta}>
          <Text style={[styles.itemTitle, { marginBottom: 6 }]}>{displayName}</Text>
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

      {description && (
        <Text style={styles.bodySecondary}>{description}</Text>
      )}

      {detailedRules && (
        <>
          <Pressable
            style={styles.expandButton}
            onPress={() => {
              LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
              setExpanded(prev => !prev);
            }}
            accessibilityRole="button"
            accessibilityState={{ expanded }}
          >
            <Text style={styles.addBtnText}>
              {expanded ? t.hideRules : t.showRules}
            </Text>
            <Ionicons
              name={expanded ? 'chevron-up' : 'chevron-down'}
              size={16}
              color={colors.primary}
            />
          </Pressable>
          {expanded && (
            <Text style={[styles.bodySecondary, { marginTop: 10, lineHeight: 20 }]}>
              {detailedRules}
            </Text>
          )}
        </>
      )}
    </View>
  );
}
