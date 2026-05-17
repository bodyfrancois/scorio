import React, {
  useState,
  useMemo,
  useCallback,
  useLayoutEffect,
} from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
} from 'react-native';
import Svg, { Path, Text as SvgText } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeContext';
import { useTranslation } from '../i18n';
import { makeStatsStyles } from '../theme/styles';
import { getHistory, GameHistoryItem } from '../storage/historyStorage';
import {
  computeStats,
  DonutSlice,
  DateFilter,
} from '../utils/statsEngine';
import PlayerCard from '../components/PlayerCard';
import EmptyState from '../components/EmptyState';
import FilterModal, { FilterState } from '../components/FilterModal';
import InfoRow from '../components/InfoRow';

// ─── Constantes ───────────────────────────────────────────────────────────────

const DONUT_PALETTE = ['#4d2983', '#0a9396', '#94d2bd', '#ee9b00', '#bb3e03'];
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
        <SvgText x={cx} y={cy + 24} textAnchor="middle" fontSize={16} fontWeight="400" fill={textColor}>
          {t.statsParties}
        </SvgText>
      </Svg>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginTop: 4 }}>
        {segments.map((seg) => (
          <View key={seg.gameName} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <View style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: seg.color }} />
            <Text style={{ fontSize: 13, fontWeight: '700', color: textColor }}>
              {seg.gameName} : {seg.count}
            </Text>
            <Text style={{ fontSize: 13, fontWeight: '400', color: textColor }}>
              ({seg.percentage}%)
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

// ─── Écran principal ──────────────────────────────────────────────────────────

export default function StatsScreen({ navigation }: any) {
  const { colors, isDark, language } = useTheme();
  const t = useTranslation(language);
  const styles = useMemo(() => makeStatsStyles(colors), [colors]);

  const [history, setHistory]           = useState<GameHistoryItem[]>([]);
  const [filter, setFilter]             = useState<FilterState>({ game: null, month: null, year: null });
  const [filterVisible, setFilterVisible] = useState(false);

  useFocusEffect(useCallback(() => {
    getHistory().then(setHistory);
  }, []));

  const isFiltered = filter.game !== null || filter.month !== null || filter.year !== null;

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

  const dateFilter: DateFilter = { mois: filter.month, annee: filter.year };
  const stats = useMemo(
    () => computeStats(history, filter.game ?? undefined, dateFilter),
    [history, filter]
  );

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {!stats ? (
          <EmptyState
            iconName="bar-chart"
            heading={t.statsNoHistory}
            description={t.statsNoHistoryHint}
          />
        ) : (
          <>
            {/* Carte KPI */}
            <View style={[styles.card, { marginBottom: 32 }]}>

              {/* Donut */}
              {!filter.game && stats.donutData.length > 0 && (
                <View style={styles.donutWrap}>
                  <DonutChart data={stats.donutData} total={stats.totalGames} isDark={isDark} t={t} />
                </View>
              )}

              {/* KPI côte à côte : total parties + meilleur joueur */}
              <View style={styles.kpiRow}>
                <View style={styles.kpiBlock}>
                  <View style={[styles.iconBoxPrimary, { backgroundColor: colors.primarySubtle }]}>
                    <Ionicons name="game-controller" size={16} color={colors.primary} />
                  </View>
                  <Text style={styles.kpiValue}>{stats.totalGames}</Text>
                  <Text style={styles.body}>{t.statsTotalGames}</Text>
                </View>
                <View style={styles.kpiBlock}>
                  <View style={[styles.iconBoxPrimary, { backgroundColor: colors.primarySubtle }]}>
                    <Ionicons name="trophy" size={16} color={colors.primary} />
                  </View>
                  <Text style={styles.kpiValue} numberOfLines={1} adjustsFontSizeToFit>
                    {stats.players[0]?.name ?? '—'}
                  </Text>
                  <Text style={styles.body}>{t.statsMostActive}</Text>
                </View>
              </View>
              {/*!filter.game && (
                <InfoRow
                  iconName="star"
                  iconBg={colors.primarySubtle}
                  iconColor={colors.primary}
                  label={t.statsMostPlayed}
                  value={stats.mostPlayedGame ?? '—'}
                  showDivider
                />
              )*/}
            </View>

            {/* Classement joueurs */}
            {stats.players.length > 0 && (
              <>
                <Text style={styles.sectionLabel}>{t.statsPlayerRanking}</Text>
                <View style={[styles.card, { marginBottom: 32 }]}>
                  {stats.players.map((player, i) => (
                    <PlayerCard
                      key={player.name}
                      variant="stats"
                      player={player}
                      rank={i}
                      onPress={() => navigation.navigate('PlayerDetail', { player })}
                    />
                  ))}
                </View>
              </>
            )}
          </>
        )}
      </ScrollView>

      <FilterModal
        visible={filterVisible}
        value={filter}
        gameOptions={gameNames.length > 1 ? gameNames : []}
        availableYears={availableYears}
        onApply={setFilter}
        onClose={() => setFilterVisible(false)}
      />
    </>
  );
}
