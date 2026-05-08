import React, {
  useState,
  useMemo,
  useCallback,
  useLayoutEffect,
  useEffect,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  Modal,
} from 'react-native';
import Svg, { Path, Text as SvgText } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeContext';
import { useTranslation } from '../i18n';
import { lightColors } from '../theme/colors';
import { makeSharedStyles } from '../theme/styles';
import { getHistory, GameHistoryItem } from '../storage/historyStorage';
import { getGameConfig } from '../games/registry';
import {
  computeStats,
  PlayerStats,
  GameStats,
  DonutSlice,
  DateFilter,
} from '../utils/statsEngine';


// ─── Constantes ───────────────────────────────────────────────────────────────

const MOIS_LABELS_FR = ['Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc'];
const MOIS_LABELS_EN = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const MEDAL_COLORS   = ['#F59E0B', '#94A3B8', '#CD7F32'];
const MEDAL_BG_LIGHT = ['#FEF3C7', '#F1F5F9', '#FDF0E6'];
const MEDAL_BG_DARK  = ['#3B2A00', '#1E293B', '#2A1500'];

const DONUT_PALETTE = ['#4d2983', '#7C48CA', '#C05177', '#b791df', '#d2c0ef'];
const DONUT_OTHER_COLOR = '#d8d8d8';
const MAX_DONUT_SLICES  = 5;

// ─── Helpers donut ────────────────────────────────────────────────────────────

function pt(cx: number, cy: number, radius: number, deg: number) {
  const a = (deg - 90) * Math.PI / 180;
  return { x: cx + radius * Math.cos(a), y: cy + radius * Math.sin(a) };
}

function f(n: number) { return n.toFixed(4); }

function roundedDonutPath(
  cx: number, cy: number,
  R: number, r: number,
  startDeg: number, endDeg: number,
  cornerR: number,
): string {
  const maxC = Math.min(
    (R - r) / 2 - 0.5,
    r * Math.abs(endDeg - startDeg) * Math.PI / 360 - 0.5,
  );
  const c = Math.max(0, Math.min(cornerR, maxC));

  if (c < 0.5) {
    const s = pt(cx, cy, R, startDeg), e = pt(cx, cy, R, endDeg);
    const si = pt(cx, cy, r, endDeg), ei = pt(cx, cy, r, startDeg);
    const lg = endDeg - startDeg > 180 ? 1 : 0;
    return `M${f(s.x)} ${f(s.y)} A${R} ${R} 0 ${lg} 1 ${f(e.x)} ${f(e.y)} L${f(si.x)} ${f(si.y)} A${r} ${r} 0 ${lg} 0 ${f(ei.x)} ${f(ei.y)} Z`;
  }

  const outerAdj = Math.asin(c / (R - c)) * 180 / Math.PI;
  const innerAdj = Math.asin(c / (r + c)) * 180 / Math.PI;
  const outerRadT = Math.sqrt((R - c) ** 2 - c ** 2);
  const innerRadT = Math.sqrt((r + c) ** 2 - c ** 2);

  const oS = startDeg + outerAdj, oE = endDeg - outerAdj;
  const iS = startDeg + innerAdj, iE = endDeg - innerAdj;
  const lgO = oE - oS > 180 ? 1 : 0;
  const lgI = iE - iS > 180 ? 1 : 0;

  const pOS  = pt(cx, cy, R,         oS);
  const pOE  = pt(cx, cy, R,         oE);
  const pOER = pt(cx, cy, outerRadT, endDeg);
  const pIER = pt(cx, cy, innerRadT, endDeg);
  const pIE  = pt(cx, cy, r,         iE);
  const pIS  = pt(cx, cy, r,         iS);
  const pISR = pt(cx, cy, innerRadT, startDeg);
  const pOSR = pt(cx, cy, outerRadT, startDeg);

  return [
    `M${f(pOS.x)} ${f(pOS.y)}`,
    `A${R} ${R} 0 ${lgO} 1 ${f(pOE.x)} ${f(pOE.y)}`,
    `A${f(c)} ${f(c)} 0 0 1 ${f(pOER.x)} ${f(pOER.y)}`,
    `L${f(pIER.x)} ${f(pIER.y)}`,
    `A${f(c)} ${f(c)} 0 0 1 ${f(pIE.x)} ${f(pIE.y)}`,
    `A${r} ${r} 0 ${lgI} 0 ${f(pIS.x)} ${f(pIS.y)}`,
    `A${f(c)} ${f(c)} 0 0 1 ${f(pISR.x)} ${f(pISR.y)}`,
    `L${f(pOSR.x)} ${f(pOSR.y)}`,
    `A${f(c)} ${f(c)} 0 0 1 ${f(pOS.x)} ${f(pOS.y)}`,
    'Z',
  ].join(' ');
}


// ─── Styles ───────────────────────────────────────────────────────────────────

const makeStyles = (c: typeof lightColors, _isDark: boolean) => ({
  ...makeSharedStyles(c),
  ...StyleSheet.create({

    // Donut
    donutWrap: {
      marginBottom: 24,
    },

    // Player cards (classement)
    playerCard: {
      marginBottom: 10,
      overflow: 'hidden',
      borderColor: c.borderSubtle,
      borderBottomWidth: 1,
    },
    playerCardMain: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingBottom: 24,
      gap: 10,
    },
    rankBadge: {
      width: 34, height: 34, borderRadius: 10,
      alignItems: 'center', justifyContent: 'center',
    },
    rankText: { fontSize: 13, fontWeight: '800' },
    playerNameBlock: { flex: 1 },
    playerName: { fontSize: 15, fontWeight: '700', color: c.text },
    playerStats: { fontSize: 12, color: c.textMuted, marginTop: 2 },
    streakBadge: {
      flexDirection: 'row', alignItems: 'center', gap: 3,
      paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12,
      backgroundColor: c.goldSubtle,
    },
    streakText: { fontSize: 12, fontWeight: '700', color: c.goldText },

    // Game cards (par jeu)
    gameCard: {
      backgroundColor: c.card,
      borderRadius: 20,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: c.borderSubtle,
      shadowColor: c.shadowCard,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.05,
      shadowRadius: 0,
      elevation: 2,
    },
    gameCardHeader: {
      flexDirection: 'row', alignItems: 'center',
      gap: 14, padding: 14, paddingBottom: 12,
    },
    gameImage: {
      width: 52, height: 52, borderRadius: 12,
      borderWidth: 1, borderColor: c.border,
    },
    gameImagePlaceholder: {
      width: 52, height: 52, borderRadius: 12,
      backgroundColor: c.primarySubtle,
      alignItems: 'center', justifyContent: 'center',
    },
    gameHeaderInfo: { flex: 1 },
    gameName: {
      fontSize: 15, fontWeight: '700', color: c.text, marginBottom: 4,
    },
    gameCountBadge: {
      alignSelf: 'flex-start',
      paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10,
      backgroundColor: c.primarySubtle,
    },
    gameCountText: { fontSize: 12, fontWeight: '700', color: c.primary },
    gameDivider: { height: 1, backgroundColor: c.borderSubtle, marginHorizontal: 14 },
    gameHighlights: {
      flexDirection: 'row', padding: 14, paddingTop: 12, gap: 8,
    },
    highlightCard: {
      flex: 1, backgroundColor: c.background,
      borderRadius: 14, padding: 10, alignItems: 'center',
    },
    highlightIcon: {
      width: 28, height: 28, borderRadius: 8,
      alignItems: 'center', justifyContent: 'center', marginBottom: 6,
    },
    highlightLabel: {
      fontSize: 10, fontWeight: '700', color: c.textMuted,
      textTransform: 'uppercase', letterSpacing: 0.5,
      marginBottom: 4, textAlign: 'center',
    },
    highlightValue: {
      fontSize: 14, fontWeight: '800', color: c.text, textAlign: 'center',
    },
    highlightSub: {
      fontSize: 11, color: c.textMuted, marginTop: 2, textAlign: 'center',
    },
    gameRankingSection: {
      paddingHorizontal: 14, paddingBottom: 14,
    },
    gameRankingLabel: {
      fontSize: 11, fontWeight: '700', color: c.textMuted,
      textTransform: 'uppercase', letterSpacing: 1,
      marginBottom: 8, marginTop: 12,
    },
    gameRankRow: {
      flexDirection: 'row', alignItems: 'center',
      paddingVertical: 8,
      borderTopWidth: 1, borderTopColor: c.borderSubtle,
      gap: 10,
    },
    gameRankNum: { fontSize: 13, fontWeight: '700', color: c.textMuted, width: 18, textAlign: 'center' },
    gameRankName: { flex: 1, fontSize: 14, fontWeight: '500', color: c.text },
    gameRankStats: { fontSize: 12, color: c.textMuted },
    gameRankBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
    gameRankBadgeText: { fontSize: 11, fontWeight: '700' },
  }),
});

// ─── Dropdown (styles partagés) ───────────────────────────────────────────────

function useDropdownStyles(c: typeof lightColors) {
  return useMemo(() => makeSharedStyles(c), [c]);
}

// ─── Dropdown dates ───────────────────────────────────────────────────────────

function Dropdown({
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
  const s = useDropdownStyles(colors);
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
            <Pressable style={s.ddOption} onPress={() => { onChange(null); setOpen(false); }}>
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

// ─── Dropdown jeu ─────────────────────────────────────────────────────────────

function DropdownJeu({
  valeur,
  options,
  placeholder,
  onChange,
  colors,
}: {
  valeur: string | undefined;
  options: string[];
  placeholder: string;
  onChange: (v: string | undefined) => void;
  colors: typeof lightColors;
}) {
  const [open, setOpen] = useState(false);
  const s = useDropdownStyles(colors);

  return (
    <>
      <Pressable
        style={[s.ddInput, open && s.ddInputOpen]}
        onPress={() => setOpen((o) => !o)}
      >
        {valeur !== undefined ? (
          <View style={s.ddValueRow}>
            {getGameConfig(valeur)?.image && (
              <Image source={getGameConfig(valeur)!.image} style={s.ddLogoSmall} />
            )}
            <Text style={s.ddValueText}>{valeur}</Text>
          </View>
        ) : (
          <Text style={s.ddPlaceholder}>{placeholder}</Text>
        )}
        <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={16} color={colors.textSecondary} />
      </Pressable>
      {open && (
        <View style={s.ddList}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Pressable style={s.ddOption} onPress={() => { onChange(undefined); setOpen(false); }}>
              <Text style={[s.ddOptionText, valeur === undefined && s.ddOptionTextActive]}>{placeholder}</Text>
              {valeur === undefined && <Ionicons name="checkmark" size={16} color={colors.primary} />}
            </Pressable>
            {options.map((opt) => {
              const config = getGameConfig(opt);
              const actif  = valeur === opt;
              return (
                <Pressable
                  key={opt}
                  style={[s.ddOption, actif && s.ddOptionActive]}
                  onPress={() => { onChange(opt); setOpen(false); }}
                >
                  <View style={s.ddValueRow}>
                    {config?.image && <Image source={config.image} style={s.ddLogoSmall} />}
                    <Text style={[s.ddOptionText, actif && s.ddOptionTextActive]}>{opt}</Text>
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

// ─── Modal filtre ─────────────────────────────────────────────────────────────

function ModalFiltres({
  visible,
  filtres,
  filterGame,
  gameNames,
  availableYears,
  onApply,
  onClose,
  colors,
  t,
  language,
}: {
  visible: boolean;
  filtres: DateFilter;
  filterGame: string | undefined;
  gameNames: string[];
  availableYears: number[];
  onApply: (date: DateFilter, game: string | undefined) => void;
  onClose: () => void;
  colors: typeof lightColors;
  t: any;
  language: string;
}) {
  const [local, setLocal] = useState<DateFilter>(filtres);
  const [localGame, setLocalGame] = useState<string | undefined>(filterGame);
  useEffect(() => {
    if (visible) { setLocal(filtres); setLocalGame(filterGame); }
  }, [visible, filtres, filterGame]);

  const moisLabels = language === 'fr' ? MOIS_LABELS_FR : MOIS_LABELS_EN;
  const moisOptions = moisLabels.map((l, i) => ({ label: l, value: i }));
  const anneeOptions = availableYears.map((y) => ({ label: String(y), value: y }));

  const s = useMemo(() => makeSharedStyles(colors), [colors]);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={s.overlay} onPress={onClose} />
      <View style={s.sheet}>
        <View style={s.sheetHandle} />
        <Text style={s.sheetTitle}>{t.filterGames}</Text>

        {gameNames.length > 1 && (
          <>
            <Text style={s.sheetSectionTitle}>{t.game}</Text>
            <DropdownJeu
              valeur={localGame}
              options={gameNames}
              placeholder={t.allGames}
              onChange={setLocalGame}
              colors={colors}
            />
          </>
        )}

        <Text style={s.sheetSectionTitle}>{t.date}</Text>
        <View style={s.sheetDateRow}>
          <View style={s.sheetDateCol}>
            <Dropdown
              valeur={local.mois}
              options={moisOptions}
              placeholder={t.month}
              onChange={(v) => setLocal((f) => ({ ...f, mois: v }))}
              colors={colors}
            />
          </View>
          <View style={s.sheetDateCol}>
            <Dropdown
              valeur={local.annee}
              options={anneeOptions}
              placeholder={t.year}
              onChange={(v) => setLocal((f) => ({ ...f, annee: v }))}
              colors={colors}
            />
          </View>
        </View>

        <View style={s.sheetActions}>
          <Pressable
            style={({ pressed }) => [s.btn, s.btnSecondary, pressed && s.pressed]}
            onPress={() => { onApply({ mois: null, annee: null }, undefined); onClose(); }}
          >
            <Text style={s.btnSecondaryText}>{t.reset}</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [s.btn, s.btnPrimary, pressed && s.pressed]}
            onPress={() => { onApply(local, localGame); onClose(); }}
          >
            <Text style={s.btnPrimaryText}>{t.apply}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

// ─── Donut chart ──────────────────────────────────────────────────────────────

function DonutChart({
  data,
  total,
  isDark,
  t,
}: {
  data: DonutSlice[];
  total: number;
  isDark: boolean;
  t: any;
}) {
  const SIZE   = 250;
  const cx = SIZE / 2, cy = SIZE / 2;
  const outerR = 105, innerR = 63;
  const cornerR = 8;
  const GAP    = data.length > 1 ? 4 : 0;

  const top  = data.slice(0, MAX_DONUT_SLICES);
  const rest = data.slice(MAX_DONUT_SLICES);
  const slices: DonutSlice[] = rest.length > 0
    ? [
        ...top,
        {
          gameName: t.statsOther,
          count: rest.reduce((s, d) => s + d.count, 0),
          percentage: rest.reduce((s, d) => s + d.percentage, 0),
        },
      ]
    : top;

  const segColors = [
    ...top.map((_, i) => DONUT_PALETTE[i % DONUT_PALETTE.length]),
    ...(rest.length > 0 ? [DONUT_OTHER_COLOR] : []),
  ];

  let cumAngle = 0;
  const segments = slices.map((d, i) => {
    const sweep = (d.count / total) * 360;
    const startDeg = cumAngle + GAP / 2;
    const endDeg   = cumAngle + sweep - GAP / 2;
    cumAngle += sweep;
    return { ...d, path: roundedDonutPath(cx, cy, outerR, innerR, startDeg, endDeg, cornerR), color: segColors[i] };
  });

  const textColor  = isDark ? '#F1F5F9' : '#1E293B';
  const mutedColor = isDark ? '#64748B' : '#94A3B8';

  return (
    <View style={{ alignItems: 'center' }}>
      <Svg width={SIZE} height={SIZE}>
        {segments.map((seg, i) => (
          <Path key={i} d={seg.path} fill={seg.color} />
        ))}
        <SvgText x={cx} y={cy + 2} textAnchor="middle" fontSize={40} fontWeight="bold" fill={textColor}>
          {total}
        </SvgText>
        <SvgText x={cx} y={cy + 20} textAnchor="middle" fontSize={13} fontWeight="600" fill={mutedColor}>
          {t.statsParties}
        </SvgText>
      </Svg>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginTop: 4 }}>
        {segments.map((seg) => (
          <View key={seg.gameName} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <View style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: seg.color }} />
            <Text style={{ fontSize: 13, fontWeight: '500', color: textColor }}>
              {seg.gameName}
            </Text>
            <Text style={{ fontSize: 13, fontWeight: '700', color: mutedColor }}>
              {seg.count} ({seg.percentage}%)
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

// ─── Carte joueur ─────────────────────────────────────────────────────────────

function PlayerCard({
  player, rank, styles, colors, isDark, t, onPress,
}: {
  player: PlayerStats; rank: number;
  styles: ReturnType<typeof makeStyles>;
  colors: typeof lightColors; isDark: boolean; t: any;
  onPress: () => void;
}) {
  const medalColor = MEDAL_COLORS[rank] ?? colors.textMuted;
  const medalBg    = (isDark ? MEDAL_BG_DARK : MEDAL_BG_LIGHT)[rank] ?? colors.background;

  return (
    <Pressable
      style={({ pressed }) => [styles.playerCard, pressed && { opacity: 0.72 }]}
      onPress={onPress}
    >
      <View style={styles.playerCardMain}>
        <View style={[styles.rankBadge, { backgroundColor: medalBg }]}>
          <Text style={[styles.rankText, { color: medalColor }]}>{rank + 1}</Text>
        </View>
        <View style={styles.playerNameBlock}>
          <Text style={styles.playerName}>{player.name}</Text>
          <Text style={styles.playerStats}>
            {player.wins} {t.statsVictories} / {player.games} {t.statsParties}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
      </View>
    </Pressable>
  );
}

// ─── Carte jeu ────────────────────────────────────────────────────────────────

function GameCard({
  game, styles, colors, isDark, t,
}: {
  game: GameStats;
  styles: ReturnType<typeof makeStyles>;
  colors: typeof lightColors; isDark: boolean; t: any;
}) {
  const image = (() => { try { return getGameConfig(game.name)?.image ?? null; } catch { return null; } })();

  return (
    <View style={styles.gameCard}>
      <View style={styles.gameCardHeader}>
        {image ? (
          <Image source={image} style={styles.gameImage} resizeMode="cover" />
        ) : (
          <View style={styles.gameImagePlaceholder}>
            <Ionicons name="game-controller" size={22} color={colors.primary} />
          </View>
        )}
        <View style={styles.gameHeaderInfo}>
          <Text style={styles.gameName}>{game.name}</Text>
          <View style={styles.gameCountBadge}>
            <Text style={styles.gameCountText}>{game.count} {t.statsParties}</Text>
          </View>
        </View>
      </View>

      <View style={styles.gameDivider} />

      <View style={styles.gameHighlights}>
        <View style={styles.highlightCard}>
          <View style={[styles.highlightIcon, { backgroundColor: colors.goldSubtle }]}>
            <Ionicons name="trophy" size={14} color={colors.goldText} />
          </View>
          <Text style={styles.highlightLabel}>{t.statsTopPlayer}</Text>
          <Text style={styles.highlightValue} numberOfLines={1}>{game.bestPlayer}</Text>
          <Text style={styles.highlightSub}>{game.bestPlayerWins} {t.statsVictories}</Text>
        </View>

        {game.bestScoreEntry && (
          <View style={styles.highlightCard}>
            <View style={[styles.highlightIcon, { backgroundColor: colors.primarySubtle }]}>
              <Ionicons name="star" size={14} color={colors.primary} />
            </View>
            <Text style={styles.highlightLabel}>{t.statsBestScore}</Text>
            <Text style={styles.highlightValue}>{game.bestScoreEntry.score} pts</Text>
            <Text style={styles.highlightSub} numberOfLines={1}>{game.bestScoreEntry.player}</Text>
          </View>
        )}
      </View>

      <View style={styles.gameDivider} />

      <View style={styles.gameRankingSection}>
        <Text style={styles.gameRankingLabel}>{t.statsPlayerRanking}</Text>
        {game.playerRanking.map((p, i) => {
          const medalColor = MEDAL_COLORS[i] ?? colors.textMuted;
          const medalBg    = (isDark ? MEDAL_BG_DARK : MEDAL_BG_LIGHT)[i] ?? colors.background;
          return (
            <View key={p.name} style={styles.gameRankRow}>
              <Text style={[styles.gameRankNum, i < 3 && { color: medalColor }]}>{i + 1}</Text>
              <Text style={styles.gameRankName} numberOfLines={1}>{p.name}</Text>
              <Text style={styles.gameRankStats}>ø {p.avgScore} pts</Text>
              {p.wins > 0 && (
                <View style={[styles.gameRankBadge, { backgroundColor: medalBg }]}>
                  <Text style={[styles.gameRankBadgeText, { color: medalColor }]}>{p.wins}V</Text>
                </View>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
}

// ─── Écran principal ──────────────────────────────────────────────────────────

export default function StatsScreen({ navigation }: any) {
  const { colors, isDark, language } = useTheme();
  const t = useTranslation(language);
  const styles = useMemo(() => makeStyles(colors, isDark), [colors, isDark]);

  const [history, setHistory]           = useState<GameHistoryItem[]>([]);
  const [filtres, setFiltres]           = useState<DateFilter>({ mois: null, annee: null });
  const [filterGame, setFilterGame]     = useState<string | undefined>(undefined);
  const [filterVisible, setFilterVisible] = useState(false);

  useFocusEffect(useCallback(() => {
    getHistory().then(setHistory);
  }, []));

  const isFiltered = filtres.mois !== null || filtres.annee !== null || filterGame !== undefined;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: t.statistics,
      headerRight: () => (
        <Pressable
          onPress={() => setFilterVisible(true)}
          style={({ pressed }) => [styles.hdrBtn, { marginRight: 16 }, pressed && { opacity: 0.72 }]}
          hitSlop={8}
        >
          <Ionicons name="filter-outline" size={20} color="#fff" />
          {isFiltered && <View style={styles.hdrPoint} />}
        </Pressable>
      ),
    });
  }, [navigation, isFiltered, styles, t.statistics]);

  const availableYears = useMemo(
    () => [...new Set(history.map((h) => new Date(h.date).getFullYear()))].sort().reverse(),
    [history]
  );

  const gameNames = useMemo(
    () => [...new Set(history.map((h) => h.gameName))].sort(),
    [history]
  );

  const stats = useMemo(
    () => computeStats(history, filterGame, filtres),
    [history, filterGame, filtres]
  );

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {!stats ? (
          <View style={styles.emptyWrap}>
            <View style={styles.emptyIconBox}>
              <Ionicons name="bar-chart" size={36} color={colors.primary} />
            </View>
            <Text style={styles.emptyTitle}>{t.statsNoHistory}</Text>
            <Text style={styles.emptySubtitle}>{t.statsNoHistoryHint}</Text>
          </View>
        ) : (
          <>
            {/* Carte KPI */}
            <View style={[styles.cardMd, { marginBottom: 32 }]}>

              {/* Donut */}
              {!filterGame && stats.donutData.length > 0 && (
                <View style={styles.donutWrap}>
                  <DonutChart data={stats.donutData} total={stats.totalGames} isDark={isDark} t={t} />
                </View>
              )}

              <View style={styles.infoRow}>
                <View style={styles.iconBoxPrimary}>
                  <Ionicons name="game-controller" size={16} color={colors.primary} />
                </View>
                <Text style={styles.infoLabel}>{t.statsTotalGames}</Text>
                <Text style={styles.infoValue}>{stats.totalGames}</Text>
              </View>
              <View style={styles.infoRowDivider} />
              <View style={styles.infoRow}>
                <View style={styles.iconBoxPrimary}>
                  <Ionicons name="trophy" size={16} color={colors.primary} />
                </View>
                <Text style={styles.infoLabel}>{t.statsMostActive}</Text>
                <Text style={styles.infoValue} numberOfLines={1}>{stats.players[0]?.name ?? '—'}</Text>
              </View>
              {!filterGame && (
                <>
                  <View style={styles.infoRowDivider} />
                  <View style={styles.infoRow}>
                    <View style={styles.iconBoxPrimary}>
                      <Ionicons name="star" size={16} color={colors.primary} />
                    </View>
                    <Text style={styles.infoLabel}>{t.statsMostPlayed}</Text>
                    <Text style={styles.infoValue} numberOfLines={1}>{stats.mostPlayedGame ?? '—'}</Text>
                  </View>
                </>
              )}
            </View>

            {/* Classement joueurs */}
            {stats.players.length > 0 && (
              <>
                <Text style={styles.sectionLabel}>{t.statsPlayerRanking}</Text>
                <View style={[styles.cardMd, { marginBottom: 32 }]}>
                  {stats.players.map((player, i) => (
                    <PlayerCard
                      key={player.name}
                      player={player}
                      rank={i}
                      styles={styles}
                      colors={colors}
                      isDark={isDark}
                      t={t}
                      onPress={() => navigation.navigate('PlayerDetail', { player })}
                    />
                  ))}
                </View>
              </>
            )}
          </>
        )}
      </ScrollView>

      <ModalFiltres
        visible={filterVisible}
        filtres={filtres}
        filterGame={filterGame}
        gameNames={gameNames}
        availableYears={availableYears}
        onApply={(date, game) => { setFiltres(date); setFilterGame(game); }}
        onClose={() => setFilterVisible(false)}
        colors={colors}
        t={t}
        language={language}
      />
    </>
  );
}
