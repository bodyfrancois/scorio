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
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

import { getHistory, clearHistory, GameHistoryItem } from '../storage/historyStorage';
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

function cléMois(iso: string) {
  const d = new Date(iso);
  return `${MOIS_FR[d.getMonth()].toUpperCase()} ${d.getFullYear()}`;
}

function groupParMois(items: GameHistoryItem[]) {
  const map: Record<string, GameHistoryItem[]> = {};
  items.forEach((item) => {
    const key = cléMois(item.date);
    if (!map[key]) map[key] = [];
    map[key].push(item);
  });
  return Object.entries(map).map(([title, data]) => ({ title, data }));
}

/* ─── Badge classement ────────────────────────────────────── */

function BadgeRang({ rang, colors }: { rang: number; colors: typeof lightColors }) {
  const premier = rang === 1;
  const badgeStyle = {
    wrap: {
      width: 22, height: 22, borderRadius: 11,
      backgroundColor: premier ? colors.gold : colors.surfaceAlt,
      alignItems: 'center' as const, justifyContent: 'center' as const,
    },
    texte: {
      fontSize: 11, fontWeight: '600' as const,
      color: premier ? colors.white : colors.textSecondary,
    },
  };
  return (
    <View style={badgeStyle.wrap}>
      <Text style={badgeStyle.texte}>{rang}</Text>
    </View>
  );
}

/* ─── Carte de partie ─────────────────────────────────────── */

function CartePartie({ item, colors }: { item: GameHistoryItem; colors: typeof lightColors }) {
  const config = getGameConfig(item.gameName);

  const s = useMemo(() => StyleSheet.create({
    wrap:         { backgroundColor: colors.card, borderRadius: 16, padding: 16, marginBottom: 12 },
    entête:       { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
    logo:         { width: 48, height: 48, borderRadius: 12 },
    logoFallback: { width: 48, height: 48, borderRadius: 12, backgroundColor: colors.primarySubtle, alignItems: 'center', justifyContent: 'center' },
    logoLettre:   { fontSize: 20, fontWeight: '800', color: colors.primary },
    nomJeu:       { fontSize: 16, fontWeight: '700', color: colors.text },
    date:         { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
    joueurs:      { gap: 8 },
    ligneJoueur:  { flexDirection: 'row', alignItems: 'center', gap: 10 },
    nomJoueur:    { flex: 1, fontSize: 14, color: colors.textSecondary },
    nomGagnant:   { fontWeight: '700', color: colors.text },
    score:        { fontSize: 14, color: colors.textSecondary },
    scoreGagnant: { fontWeight: '800', color: colors.text },
    unité:        { fontSize: 11, fontWeight: '400', color: colors.textMuted },
  }), [colors]);

  return (
    <View style={s.wrap}>
      <View style={s.entête}>
        {config?.image ? (
          <Image source={config.image} style={s.logo} />
        ) : (
          <View style={s.logoFallback}>
            <Text style={s.logoLettre}>{item.gameName[0]}</Text>
          </View>
        )}
        <View>
          <Text style={s.nomJeu}>{item.gameName}</Text>
          <Text style={s.date}>{formatDate(item.date)}</Text>
        </View>
      </View>

      <View style={s.joueurs}>
        {item.ranking.map((joueur, i) => (
          <View key={joueur.name} style={s.ligneJoueur}>
            <BadgeRang rang={i + 1} colors={colors} />
            <Text style={[s.nomJoueur, i === 0 && s.nomGagnant]}>
              {joueur.name}
            </Text>
            <Text style={[s.score, i === 0 && s.scoreGagnant]}>
              {joueur.score}
              <Text style={s.unité}> PTS</Text>
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

/* ─── Dropdown jeu ────────────────────────────────────────── */

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
  const [ouvert, setOuvert] = useState(false);
  const nomsJeux = ALL_GAMES.map((g) => g.name);

  const s = useMemo(() => StyleSheet.create({
    input:              { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.inputBackground, borderRadius: 12, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 14, paddingVertical: 12 },
    inputOuvert:        { borderColor: colors.primary, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 },
    placeholder:        { fontSize: 14, color: colors.textMuted, flex: 1 },
    valeurRow:          { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
    valeurTexte:        { fontSize: 14, color: colors.text, fontWeight: '500' },
    logoSmall:          { width: 24, height: 24, borderRadius: 6 },
    liste:              { backgroundColor: colors.card, borderWidth: 1, borderTopWidth: 0, borderColor: colors.primary, borderBottomLeftRadius: 12, borderBottomRightRadius: 12, overflow: 'hidden' },
    option:             { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 14, paddingVertical: 12, borderTopWidth: 1, borderTopColor: colors.border },
    optionSurbrillance: { backgroundColor: colors.primarySubtle },
    optionTexte:        { fontSize: 14, color: colors.text },
    optionActif:        { color: colors.primary, fontWeight: '600' },
  }), [colors]);

  return (
    <>
      <Pressable
        style={[s.input, ouvert && s.inputOuvert]}
        onPress={() => setOuvert((o) => !o)}
      >
        {valeur ? (
          <View style={s.valeurRow}>
            {getGameConfig(valeur)?.image && (
              <Image source={getGameConfig(valeur)!.image} style={s.logoSmall} />
            )}
            <Text style={s.valeurTexte}>{valeur}</Text>
          </View>
        ) : (
          <Text style={s.placeholder}>{labelAllGames}</Text>
        )}
        <Ionicons
          name={ouvert ? 'chevron-up' : 'chevron-down'}
          size={16}
          color={colors.textSecondary}
        />
      </Pressable>

      {ouvert && (
        <View style={s.liste}>
          <Pressable
            style={s.option}
            onPress={() => { onChange(null); setOuvert(false); }}
          >
            <Text style={[s.optionTexte, !valeur && s.optionActif]}>{labelAllGames}</Text>
            {!valeur && <Ionicons name="checkmark" size={16} color={colors.primary} />}
          </Pressable>
          {nomsJeux.map((nom) => {
            const config = getGameConfig(nom);
            const actif  = valeur === nom;
            return (
              <Pressable
                key={nom}
                style={[s.option, actif && s.optionSurbrillance]}
                onPress={() => { onChange(nom); setOuvert(false); }}
              >
                <View style={s.valeurRow}>
                  {config?.image && <Image source={config.image} style={s.logoSmall} />}
                  <Text style={[s.optionTexte, actif && s.optionActif]}>{nom}</Text>
                </View>
                {actif && <Ionicons name="checkmark" size={16} color={colors.primary} />}
              </Pressable>
            );
          })}
        </View>
      )}
    </>
  );
}

/* ─── Filtres ─────────────────────────────────────────────── */

type Filtres = {
  jeu:  string | null;
  date: Date | null;
};

function ModalFiltres({
  visible,
  filtres,
  onAppliquer,
  onFermer,
  colors,
  t,
}: {
  visible:     boolean;
  filtres:     Filtres;
  onAppliquer: (f: Filtres) => void;
  onFermer:    () => void;
  colors:      typeof lightColors;
  t:           ReturnType<typeof useTranslation>;
}) {
  const [local, setLocal] = useState<Filtres>(filtres);
  useEffect(() => { setLocal(filtres); }, [filtres, visible]);

  const s = useMemo(() => StyleSheet.create({
    fond:         { flex: 1, backgroundColor: colors.overlay },
    feuille:      { backgroundColor: colors.card, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
    poignée:      { width: 36, height: 4, borderRadius: 2, backgroundColor: colors.border, alignSelf: 'center', marginBottom: 16 },
    titreFeuille: { fontSize: 17, fontWeight: '700', color: colors.text, marginBottom: 20 },
    sectionTitre: { fontSize: 11, fontWeight: '700', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10, marginTop: 16 },
    dateLigne:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    effacerDate:  { fontSize: 13, color: colors.primary, fontWeight: '600' },
    datePicker:   { width: '100%', height: 180 },
    actions:      { flexDirection: 'row', gap: 12, marginTop: 16 },
    btnRéinit:    { flex: 1, paddingVertical: 13, borderRadius: 12, borderWidth: 1, borderColor: colors.border, alignItems: 'center' },
    txtRéinit:    { fontSize: 14, fontWeight: '600', color: colors.textSecondary },
    btnAppliquer: { flex: 1, paddingVertical: 13, borderRadius: 12, backgroundColor: colors.primary, alignItems: 'center' },
    txtAppliquer: { fontSize: 14, fontWeight: '600', color: colors.white },
  }), [colors]);

  const réinitialiser = () => {
    const vide: Filtres = { jeu: null, date: null };
    onAppliquer(vide);
    onFermer();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onFermer}>
      <Pressable style={s.fond} onPress={onFermer} />
      <View style={s.feuille}>
        <View style={s.poignée} />
        <Text style={s.titreFeuille}>{t.filterGames}</Text>

        <Text style={s.sectionTitre}>{t.game}</Text>
        <DropdownJeu
          valeur={local.jeu}
          onChange={(v) => setLocal((f) => ({ ...f, jeu: v }))}
          colors={colors}
          labelAllGames={t.allGames}
        />

        <View style={s.dateLigne}>
          <Text style={s.sectionTitre}>{t.date}</Text>
          {local.date && (
            <Pressable onPress={() => setLocal((f) => ({ ...f, date: null }))}>
              <Text style={s.effacerDate}>{t.clearDate}</Text>
            </Pressable>
          )}
        </View>
        <DateTimePicker
          value={local.date ?? new Date()}
          mode="date"
          display="spinner"
          locale="fr-FR"
          maximumDate={new Date()}
          onChange={(_, d) => { if (d) setLocal((f) => ({ ...f, date: d })); }}
          style={s.datePicker}
        />

        <View style={s.actions}>
          <Pressable style={s.btnRéinit} onPress={réinitialiser}>
            <Text style={s.txtRéinit}>{t.reset}</Text>
          </Pressable>
          <Pressable style={s.btnAppliquer} onPress={() => { onAppliquer(local); onFermer(); }}>
            <Text style={s.txtAppliquer}>{t.apply}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

/* ─── Écran principal ─────────────────────────────────────── */

export default function HistoryScreen({ navigation }: any) {
  const { colors, language } = useTheme();
  const t = useTranslation(language);

  const styles = useMemo(() => StyleSheet.create({
    conteneur:     { flex: 1, backgroundColor: colors.background },
    liste:         { paddingHorizontal: 16, paddingBottom: 24, paddingTop: 8 },
    entêteSection: { fontSize: 11, fontWeight: '700', color: colors.textMuted, letterSpacing: 1, textTransform: 'uppercase', marginTop: 16, marginBottom: 8 },
    vide:          { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
    videIcone:     { fontSize: 40 },
    videTitre:     { fontSize: 17, fontWeight: '700', color: colors.text },
    videSous:      { fontSize: 14, color: colors.textMuted, textAlign: 'center', paddingHorizontal: 32 },
    hdrBtn:        { width: 34, height: 34, borderRadius: 100, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
    hdrPoint:      { position: 'absolute', top: 5, right: 5, width: 7, height: 7, borderRadius: 4, backgroundColor: '#fff' },
  }), [colors]);

  const [historique, setHistorique]    = useState<GameHistoryItem[]>([]);
  const [filtresOuverts, setFiltresOuverts] = useState(false);
  const [filtres, setFiltres]          = useState<Filtres>({ jeu: null, date: null });

  const charger = useCallback(() => { getHistory().then(setHistorique); }, []);
  useFocusEffect(charger);

  const aDesFiltres = filtres.jeu !== null || filtres.date !== null;

  const confirmerEffacement = useCallback(() => {
    Alert.alert(
      t.clearHistory,
      t.clearHistoryMsg,
      [
        { text: t.cancel, style: 'cancel' },
        {
          text: t.clear,
          style: 'destructive',
          onPress: async () => {
            await clearHistory();
            setHistorique([]);
            setFiltres({ jeu: null, date: null });
          },
        },
      ],
    );
  }, [t]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: t.history,
      headerRight: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingRight: 16 }}>
          <Pressable onPress={confirmerEffacement} style={styles.hdrBtn} hitSlop={8}>
            <Ionicons name="trash-outline" size={20} color="#fff" />
          </Pressable>
          <Pressable onPress={() => setFiltresOuverts(true)} style={styles.hdrBtn} hitSlop={8}>
            <Ionicons name="filter-outline" size={20} color="#fff" />
            {aDesFiltres && <View style={styles.hdrPoint} />}
          </Pressable>
        </View>
      ),
    });
  }, [navigation, aDesFiltres, filtresOuverts, colors, styles, t, confirmerEffacement]);

  const filtré = useMemo(() => {
    return historique.filter((item) => {
      if (filtres.jeu && item.gameName !== filtres.jeu) return false;
      if (filtres.date) {
        const d = new Date(item.date);
        const f = filtres.date;
        if (d.getMonth() !== f.getMonth() || d.getFullYear() !== f.getFullYear()) return false;
      }
      return true;
    });
  }, [historique, filtres]);

  const sections = useMemo(() => groupParMois(filtré), [filtré]);

  return (
    <View style={styles.conteneur}>
      {sections.length === 0 ? (
        <View style={styles.vide}>
          <Text style={styles.videIcone}>🎲</Text>
          <Text style={styles.videTitre}>{t.noGameFound}</Text>
          <Text style={styles.videSous}>
            {aDesFiltres ? t.adjustFilters : t.startFirst}
          </Text>
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.liste}
          stickySectionHeadersEnabled={false}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.entêteSection}>{title}</Text>
          )}
          renderItem={({ item }) => <CartePartie item={item} colors={colors} />}
        />
      )}

      <ModalFiltres
        visible={filtresOuverts}
        filtres={filtres}
        onAppliquer={setFiltres}
        onFermer={() => setFiltresOuverts(false)}
        colors={colors}
        t={t}
      />
    </View>
  );
}
