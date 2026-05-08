import { useEffect, useLayoutEffect, useState, useMemo, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  SectionList,
  Image,
  Pressable,
  Modal,
  ScrollView,
} from 'react-native';

import { getHistory, clearHistory, GameHistoryItem } from '../storage/historyStorage';
import { makeSharedStyles } from '../theme/styles';
import { getGameConfig, ALL_GAMES } from '../games/registry';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { useTranslation } from '../i18n';
import { lightColors } from '../theme/colors';

/* ─── Constantes ──────────────────────────────────────────── */

const MOIS_FR = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
];

/* ─── Helpers ─────────────────────────────────────────────── */

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

/* ─── Badge classement ────────────────────────────────────── */

const MEDAL_COLORS   = ['#F59E0B', '#94A3B8', '#CD7F32'];
const MEDAL_BG_LIGHT = ['#FEF3C7', '#F1F5F9', '#FDF0E6'];
const MEDAL_BG_DARK  = ['#3B2A00', '#1E293B', '#2A1500'];

function BadgeRank({ rank, isDark, colors }: { rank: number; isDark: boolean; colors: typeof lightColors }) {
  const idx       = rank - 1;
  const color     = MEDAL_COLORS[idx]   ?? colors.textMuted;
  const bg        = (isDark ? MEDAL_BG_DARK : MEDAL_BG_LIGHT)[idx] ?? colors.surfaceAlt;
  return (
    <View style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: bg, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 13, fontWeight: '800', color }}>{rank}</Text>
    </View>
  );
}

/* ─── Carte de partie ─────────────────────────────────────── */

const MAX_VISIBLE = 3;

function GameCard({ item, colors, isDark, t }: { item: GameHistoryItem; colors: typeof lightColors; isDark: boolean; t: ReturnType<typeof useTranslation> }) {
  const config = getGameConfig(item.gameName);
  const [expanded, setExpanded] = useState(false);
  const hasMore = item.ranking.length > MAX_VISIBLE;
  const visible = expanded ? item.ranking : item.ranking.slice(0, MAX_VISIBLE);

  const s = useMemo(() => StyleSheet.create({
    logo:         { width: 48, height: 48, borderRadius: 12, borderWidth: 1, borderColor: colors.border },
    logoFallback: { width: 48, height: 48, borderRadius: 12, backgroundColor: colors.primarySubtle, alignItems: 'center', justifyContent: 'center' },
    logoLetter:   { fontSize: 20, fontWeight: '700', color: colors.primary },
    gameName:     { fontSize: 16, fontWeight: '700', color: colors.text },
    date:         { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
    playerRow:    { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8, borderTopWidth: 1, borderTopColor: colors.borderSubtle },
    playerName:   { flex: 1, fontSize: 14, fontWeight: '500' as const, color: colors.text },
    score:        { fontSize: 12, color: colors.textMuted },
    seeMore:      { marginTop: 10, alignItems: 'center' },
    seeMoreText:  { fontSize: 13, color: colors.primary, fontWeight: '600' },
  }), [colors]);

  return (
    <View style={[makeSharedStyles(colors).cardSm, { marginBottom: 16 }]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        {config?.image ? (
          <Image source={config.image} style={s.logo} />
        ) : (
          <View style={s.logoFallback}>
            <Text style={s.logoLetter}>{item.gameName[0]}</Text>
          </View>
        )}
        <View>
          <Text style={s.gameName}>{item.gameName}</Text>
          <Text style={s.date}>{formatDate(item.date)}</Text>
        </View>
      </View>

      <View>
        {visible.map((player, i) => (
          <View key={`${player.name}-${i}`} style={s.playerRow}>
            <BadgeRank rank={i + 1} isDark={isDark} colors={colors} />
            <Text style={s.playerName}>{player.name}</Text>
            <Text style={s.score}>{player.score} pts</Text>
          </View>
        ))}
      </View>

      {hasMore && (
        <Pressable
          style={({ pressed }) => [s.seeMore, pressed && { opacity: 0.72 }]}
          onPress={() => setExpanded(!expanded)}
        >
          <Text style={s.seeMoreText}>
            {expanded ? t.seeLess : `${t.seeMore} (${item.ranking.length - MAX_VISIBLE})`}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

/* ─── Dropdown partagé ────────────────────────────────────── */

type Filtres = {
  jeu:   string | null;
  mois:  number | null;
  annee: number | null;
};

const MOIS_LABELS_FR = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
const MOIS_LABELS_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function DropdownJeu({
  valeur,
  onChange,
  colors,
  labelAllGames,
}: {
  valeur: string | null;
  onChange: (v: string | null) => void;
  colors: typeof lightColors;
  labelAllGames: string;
}) {
  const [open, setOpen] = useState(false);
  const nomsJeux = ALL_GAMES.map((g) => g.name);
  const s = useMemo(() => makeSharedStyles(colors), [colors]);

  return (
    <>
      <Pressable
        style={[s.ddInput, open && s.ddInputOpen]}
        onPress={() => setOpen((o) => !o)}
      >
        {valeur ? (
          <View style={s.ddValueRow}>
            {getGameConfig(valeur)?.image && (
              <Image source={getGameConfig(valeur)!.image} style={s.ddLogoSmall} />
            )}
            <Text style={s.ddValueText}>{valeur}</Text>
          </View>
        ) : (
          <Text style={s.ddPlaceholder}>{labelAllGames}</Text>
        )}
        <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={16} color={colors.textSecondary} />
      </Pressable>

      {open && (
        <View style={s.ddList}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Pressable
              style={s.ddOption}
              onPress={() => { onChange(null); setOpen(false); }}
            >
              <Text style={[s.ddOptionText, !valeur && s.ddOptionTextActive]}>{labelAllGames}</Text>
              {!valeur && <Ionicons name="checkmark" size={16} color={colors.primary} />}
            </Pressable>
            {nomsJeux.map((nom) => {
              const config = getGameConfig(nom);
              const actif  = valeur === nom;
              return (
                <Pressable
                  key={nom}
                  style={[s.ddOption, actif && s.ddOptionActive]}
                  onPress={() => { onChange(nom); setOpen(false); }}
                >
                  <View style={s.ddValueRow}>
                    {config?.image && <Image source={config.image} style={s.ddLogoSmall} />}
                    <Text style={[s.ddOptionText, actif && s.ddOptionTextActive]}>{nom}</Text>
                  </View>
                  {actif && <Ionicons name="checkmark" size={16} color={colors.primary} />}
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      )}
    </>
  );
}

function DropdownSelect({
  valeur,
  options,
  placeholder,
  onChange,
  colors,
}: {
  valeur: number | null;
  options: { label: string; value: number }[];
  placeholder: string;
  onChange: (v: number | null) => void;
  colors: typeof lightColors;
}) {
  const [open, setOpen] = useState(false);
  const s = useMemo(() => makeSharedStyles(colors), [colors]);
  const label = options.find((o) => o.value === valeur)?.label ?? null;

  return (
    <>
      <Pressable
        style={[s.ddInput, open && s.ddInputOpen]}
        onPress={() => setOpen((o) => !o)}
      >
        <Text style={[s.ddPlaceholder, label !== null && { color: colors.text, fontWeight: '500' }]}>
          {label ?? placeholder}
        </Text>
        <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={16} color={colors.textSecondary} />
      </Pressable>

      {open && (
        <View style={s.ddList}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Pressable
              style={s.ddOption}
              onPress={() => { onChange(null); setOpen(false); }}
            >
              <Text style={[s.ddOptionText, valeur === null && s.ddOptionTextActive]}>{placeholder}</Text>
              {valeur === null && <Ionicons name="checkmark" size={16} color={colors.primary} />}
            </Pressable>
            {options.map((opt) => {
              const actif = valeur === opt.value;
              return (
                <Pressable
                  key={opt.value}
                  style={[s.ddOption, actif && s.ddOptionActive]}
                  onPress={() => { onChange(opt.value); setOpen(false); }}
                >
                  <Text style={[s.ddOptionText, actif && s.ddOptionTextActive]}>{opt.label}</Text>
                  {actif && <Ionicons name="checkmark" size={16} color={colors.primary} />}
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      )}
    </>
  );
}

/* ─── Modale filtres ──────────────────────────────────────── */

function ModalFilters({
  visible,
  filtres,
  historique,
  onApply,
  onClose,
  colors,
  t,
  language,
}: {
  visible:    boolean;
  filtres:    Filtres;
  historique: GameHistoryItem[];
  onApply:    (f: Filtres) => void;
  onClose:    () => void;
  colors:     typeof lightColors;
  t:          ReturnType<typeof useTranslation>;
  language:   string;
}) {
  const [local, setLocal] = useState<Filtres>(filtres);
  useEffect(() => { setLocal(filtres); }, [filtres, visible]);

  const moisLabels = language === 'fr' ? MOIS_LABELS_FR : MOIS_LABELS_EN;

  const yearsAvailable = useMemo(() => {
    const set = new Set<number>();
    historique.forEach(item => set.add(new Date(item.date).getFullYear()));
    return Array.from(set).sort((a, b) => b - a);
  }, [historique]);

  const monthOptions = moisLabels.map((label, i) => ({ label, value: i }));
  const yearOptions  = yearsAvailable.map((a) => ({ label: String(a), value: a }));

  const s = useMemo(() => makeSharedStyles(colors), [colors]);

  const reset = () => {
    const empty: Filtres = { jeu: null, mois: null, annee: null };
    onApply(empty);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={s.overlay} onPress={onClose} />
      <View style={s.sheet}>
        <View style={s.sheetHandle} />
        <Text style={s.sheetTitle}>{t.filterGames}</Text>

        <Text style={s.sheetSectionTitle}>{t.game}</Text>
        <DropdownJeu
          valeur={local.jeu}
          onChange={(v) => setLocal((f) => ({ ...f, jeu: v }))}
          colors={colors}
          labelAllGames={t.allGames}
        />

        <Text style={s.sheetSectionTitle}>{t.date}</Text>
        <View style={s.sheetDateRow}>
          <View style={s.sheetDateCol}>
            <DropdownSelect
              valeur={local.mois}
              options={monthOptions}
              placeholder={t.month}
              onChange={(v) => setLocal((f) => ({ ...f, mois: v }))}
              colors={colors}
            />
          </View>
          <View style={s.sheetDateCol}>
            <DropdownSelect
              valeur={local.annee}
              options={yearOptions}
              placeholder={t.year}
              onChange={(v) => setLocal((f) => ({ ...f, annee: v }))}
              colors={colors}
            />
          </View>
        </View>

        <View style={s.sheetActions}>
          <Pressable style={({ pressed }) => [s.btn, s.btnSecondary, pressed && s.pressed]} onPress={reset}>
            <Text style={s.btnSecondaryText}>{t.reset}</Text>
          </Pressable>
          <Pressable style={({ pressed }) => [s.btn, s.btnPrimary, pressed && s.pressed]} onPress={() => { onApply(local); onClose(); }}>
            <Text style={s.btnPrimaryText}>{t.apply}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
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
  const s = useMemo(() => ({
    ...makeSharedStyles(colors),
    ...StyleSheet.create({
      title: { fontSize: 17, fontWeight: '700' as const, color: colors.text, marginBottom: 8 },
      body:  { fontSize: 14, color: colors.textSecondary, marginBottom: 24, lineHeight: 20 },
      btnDangerFull: {
        backgroundColor: colors.danger,
        shadowColor: colors.danger,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 0,
        elevation: 8,
      },
    }),
  }), [colors]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable style={s.overlayCenter} onPress={onCancel}>
        <Pressable onPress={(e) => e.stopPropagation()}>
          <View style={s.modalCard}>
            <Text style={s.title}>{t.clearHistory}</Text>
            <Text style={s.body}>{t.clearHistoryMsg}</Text>
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
  const { colors, isDark, language } = useTheme();
  const t = useTranslation(language);

  const styles = useMemo(() => ({
    ...makeSharedStyles(colors),
    ...StyleSheet.create({
      list:         { paddingHorizontal: 16, paddingBottom: 24, paddingTop: 8 },
      sectionTitle: { fontSize: 11, fontWeight: '700' as const, color: colors.textMuted, letterSpacing: 1, textTransform: 'uppercase' as const, marginTop: 16, marginBottom: 8 },
      emptyCenter:  { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
      emptyBodyTxt: { fontSize: 14, color: colors.textMuted, textAlign: 'center', paddingHorizontal: 32 },
    }),
  }), [colors]);

  const [history, setHistory]           = useState<GameHistoryItem[]>([]);
  const [filtersOpen, setFiltersOpen]   = useState(false);
  const [filters, setFilters]           = useState<Filtres>({ jeu: null, mois: null, annee: null });
  const [confirmVisible, setConfirmVisible] = useState(false);

  const load = useCallback(() => { getHistory().then(setHistory); }, []);
  useFocusEffect(load);

  const hasFilters = filters.jeu !== null || filters.mois !== null || filters.annee !== null;

  const handleClearHistory = useCallback(async () => {
    await clearHistory();
    setHistory([]);
    setFilters({ jeu: null, mois: null, annee: null });
    setConfirmVisible(false);
  }, []);

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
      if (filters.jeu && item.gameName !== filters.jeu) return false;
      const d = new Date(item.date);
      if (filters.mois !== null && d.getMonth() !== filters.mois) return false;
      if (filters.annee !== null && d.getFullYear() !== filters.annee) return false;
      return true;
    });
  }, [history, filters]);

  const sections = useMemo(() => groupByMonth(filtered), [filtered]);

  return (
    <View style={styles.container}>
      {sections.length === 0 ? (
        <View style={styles.emptyCenter}>
          <IllustrationCartes colors={colors} />
          <Text style={styles.emptyTitle}>{t.noGameFound}</Text>
          <Text style={styles.emptyBodyTxt}>
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
            <Text style={styles.sectionTitle}>{title}</Text>
          )}
          renderItem={({ item }) => <GameCard item={item} colors={colors} isDark={isDark} t={t} />}
        />
      )}

      <ModalFilters
        visible={filtersOpen}
        filtres={filters}
        historique={history}
        onApply={setFilters}
        onClose={() => setFiltersOpen(false)}
        colors={colors}
        t={t}
        language={language}
      />

      <ModalConfirmClear
        visible={confirmVisible}
        onConfirm={clearHistory}
        onCancel={() => setConfirmVisible(false)}
        colors={colors}
        t={t}
      />
    </View>
  );
}
