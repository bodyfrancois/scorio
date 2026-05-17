import { useLayoutEffect, useState, useMemo, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  Text,
  Image,
  Pressable,
  Modal,
  SectionList,
} from 'react-native';

import { getHistory, clearHistory, GameHistoryItem } from '../storage/historyStorage';
import { makeHistoryStyles } from '../theme/styles';
import { getGameConfig } from '../games/registry';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { useTranslation } from '../i18n';
import { lightColors } from '../theme/colors';
import PlayerCard from '../components/PlayerCard';
import FilterModal, { FilterState } from '../components/FilterModal';

/* ─── Helpers ─────────────────────────────────────────────── */

const MOIS_FR = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
];

function formatDate(iso: string) {
  const d = new Date(iso);
  const mois = MOIS_FR[d.getMonth()].slice(0, 3);
  const jour = String(d.getDate()).padStart(2, '0');
  const h    = String(d.getHours()).padStart(2, '0');
  const m    = String(d.getMinutes()).padStart(2, '0');
  return `${mois} ${jour} • ${h}:${m}`;
}

function keyMonth(iso: string) {
  const d = new Date(iso);
  return `${MOIS_FR[d.getMonth()].toUpperCase()} ${d.getFullYear()}`;
}

function groupByMonth(items: GameHistoryItem[]) {
  const map: Record<string, GameHistoryItem[]> = {};
  items.forEach((item) => {
    const key = keyMonth(item.date);
    if (!map[key]) map[key] = [];
    map[key].push(item);
  });
  return Object.entries(map).map(([title, data]) => ({ title, data }));
}

/* ─── Illustration cartes à jouer (état vide) ─────────────── */

export function IllustrationCartes({ colors }: { colors: typeof lightColors }) {
  const card: any = {
    position: 'absolute',
    width: 62,
    height: 86,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  };
  return (
    <View style={{ width: 160, height: 130, alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
      <View style={[card, {
        backgroundColor: colors.surfaceAlt,
        transform: [{ rotate: '-14deg' }, { translateX: -36 }, { translateY: 10 }],
        shadowColor: colors.shadowCard, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 6, elevation: 2,
      }]}>
        <Text style={{ fontSize: 26, color: colors.iconMuted }}>♣</Text>
      </View>
      <View style={[card, {
        backgroundColor: colors.searchBackground,
        transform: [{ rotate: '10deg' }, { translateX: 34 }, { translateY: 8 }],
        shadowColor: colors.shadowCard, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 6, elevation: 2,
      }]}>
        <Text style={{ fontSize: 26, color: colors.border }}>♦</Text>
      </View>
      <View style={[card, {
        backgroundColor: colors.card,
        zIndex: 3,
        shadowColor: colors.shadowCard, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.12, shadowRadius: 10, elevation: 4,
      }]}>
        <Text style={{ position: 'absolute', top: 5, left: 7, fontSize: 11, fontWeight: '700', color: colors.primary }}>A</Text>
        <Text style={{ fontSize: 30, color: colors.primary }}>♠</Text>
        <Text style={{ position: 'absolute', bottom: 5, right: 7, fontSize: 11, fontWeight: '700', color: colors.primary, transform: [{ rotate: '180deg' }] }}>A</Text>
      </View>
      <View style={{ position: 'absolute', top: 4, right: 22, width: 9, height: 9, borderRadius: 5,
        backgroundColor: colors.primary, opacity: 0.7, zIndex: 5 }} />
      <View style={{ position: 'absolute', bottom: 6, left: 20, width: 6, height: 6, borderRadius: 3,
        backgroundColor: colors.primary, opacity: 0.45, zIndex: 5 }} />
    </View>
  );
}

/* ─── Carte de partie ─────────────────────────────────────── */

const MAX_VISIBLE = 3;

function GameCard({ item, colors, t }: { item: GameHistoryItem; colors: typeof lightColors; t: ReturnType<typeof useTranslation> }) {
  const config = getGameConfig(item.gameName);
  const [expanded, setExpanded] = useState(false);
  const hasMore = item.ranking.length > MAX_VISIBLE;
  const visible = expanded ? item.ranking : item.ranking.slice(0, MAX_VISIBLE);
  const s = useMemo(() => makeHistoryStyles(colors), [colors]);

  return (
    <View style={[s.card, { marginBottom: 16 }]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        {config?.image ? (
          <Image source={config.image} style={s.logo} />
        ) : (
          <View style={s.logoFallback}>
            <Text style={s.logoLetter}>{item.gameName[0]}</Text>
          </View>
        )}
        <View>
          <Text style={s.itemTitle}>{item.gameName}</Text>
          <Text style={[s.caption, { marginTop: 2 }]}>{formatDate(item.date)}</Text>
        </View>
      </View>

      <View>
        {visible.map((player, i) => {
          let rank = 1;
          for (let j = 0; j < i; j++) {
            if (item.ranking[j].score > player.score) rank++;
          }
          return (
            <PlayerCard
              key={`${player.name}-${i}`}
              variant="rank"
              name={player.name}
              score={player.score}
              rank={rank}
            />
          );
        })}
      </View>

      {hasMore && (
        <Pressable
          style={({ pressed }) => [s.seeMore, pressed && { opacity: 0.72 }]}
          onPress={() => setExpanded(!expanded)}
        >
          <Text style={s.addBtnText}>
            {expanded ? t.seeLess : `${t.seeMore} (${item.ranking.length - MAX_VISIBLE})`}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

/* ─── Modale confirmation effacement ─────────────────────── */

function ModalConfirmClear({
  visible,
  onConfirm,
  onCancel,
  colors,
  t,
}: {
  visible:   boolean;
  onConfirm: () => void;
  onCancel:  () => void;
  colors:    typeof lightColors;
  t:         ReturnType<typeof useTranslation>;
}) {
  const s = useMemo(() => makeHistoryStyles(colors), [colors]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable style={s.overlayCenter} onPress={onCancel}>
        <Pressable onPress={(e) => e.stopPropagation()}>
          <View style={s.modalCard}>
            <Text style={[s.subheading, { marginBottom: 8 }]}>{t.clearHistory}</Text>
            <Text style={[s.caption, { marginBottom: 24, lineHeight: 20 }]}>{t.clearHistoryMsg}</Text>
            <View style={s.buttons}>
              <Pressable
                style={({ pressed }) => [s.btn, s.btnSecondary, pressed && s.pressed]}
                onPress={onCancel}
              >
                <Text style={s.btnSecondaryText}>{t.cancel}</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [s.btn, s.btnDangerFull, pressed && s.pressed]}
                onPress={onConfirm}
              >
                <Text style={s.btnPrimaryText}>{t.clear}</Text>
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

/* ─── Écran principal ─────────────────────────────────────── */

export default function HistoryScreen({ navigation }: any) {
  const { colors, language } = useTheme();
  const t = useTranslation(language);
  const styles = useMemo(() => makeHistoryStyles(colors), [colors]);

  const [history, setHistory]           = useState<GameHistoryItem[]>([]);
  const [filtersOpen, setFiltersOpen]   = useState(false);
  const [filter, setFilter]             = useState<FilterState>({ game: null, month: null, year: null });
  const [confirmVisible, setConfirmVisible] = useState(false);

  const load = useCallback(() => { getHistory().then(setHistory); }, []);
  useFocusEffect(load);

  const hasFilters = filter.game !== null || filter.month !== null || filter.year !== null;

  const handleClearHistory = useCallback(async () => {
    await clearHistory();
    setHistory([]);
    setFilter({ game: null, month: null, year: null });
    setConfirmVisible(false);
  }, []);

  const availableYears = useMemo(() => {
    const set = new Set<number>();
    history.forEach(item => set.add(new Date(item.date).getFullYear()));
    return Array.from(set).sort((a, b) => b - a);
  }, [history]);

  const gameNames = useMemo(
    () => [...new Set(history.map((h) => h.gameName))].sort(),
    [history]
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: t.history,
      headerRight: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingRight: 16 }}>
          <Pressable
            onPress={() => setConfirmVisible(true)}
            style={({ pressed }) => [styles.hdrBtn, pressed && { opacity: 0.72 }]}
            hitSlop={8}
          >
            <Ionicons name="trash-outline" size={20} color="#fff" />
          </Pressable>
          <Pressable
            onPress={() => setFiltersOpen(true)}
            style={({ pressed }) => [styles.hdrBtn, pressed && { opacity: 0.72 }]}
            hitSlop={8}
          >
            <Ionicons name="filter-outline" size={20} color="#fff" />
            {hasFilters && <View style={styles.hdrPoint} />}
          </Pressable>
        </View>
      ),
    });
  }, [navigation, hasFilters, filtersOpen, colors, styles, t]);

  const filtered = useMemo(() => {
    return history.filter((item) => {
      if (filter.game && item.gameName !== filter.game) return false;
      const d = new Date(item.date);
      if (filter.month !== null && d.getMonth() !== filter.month) return false;
      if (filter.year !== null && d.getFullYear() !== filter.year) return false;
      return true;
    });
  }, [history, filter]);

  const sections = useMemo(() => groupByMonth(filtered), [filtered]);

  return (
    <View style={styles.container}>
      {sections.length === 0 ? (
        <View style={styles.emptyCenter}>
          <IllustrationCartes colors={colors} />
          <Text style={[styles.subheading, { textAlign: 'center' }]}>{t.noGameFound}</Text>
          <Text style={[styles.muted, { textAlign: 'center', paddingHorizontal: 32 }]}>
            {hasFilters ? t.adjustFilters : t.startFirst}
          </Text>
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          stickySectionHeadersEnabled={false}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={[styles.sectionLabel, { marginTop: 16, marginBottom: 8 }]}>{title}</Text>
          )}
          renderItem={({ item }) => <GameCard item={item} colors={colors} t={t} />}
        />
      )}

      <FilterModal
        visible={filtersOpen}
        value={filter}
        gameOptions={gameNames}
        availableYears={availableYears}
        onApply={setFilter}
        onClose={() => setFiltersOpen(false)}
      />

      <ModalConfirmClear
        visible={confirmVisible}
        onConfirm={handleClearHistory}
        onCancel={() => setConfirmVisible(false)}
        colors={colors}
        t={t}
      />
    </View>
  );
}
