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

      {/* Carte arrière gauche — gris neutre, légèrement inclinée */}
      <View style={[card, {
        backgroundColor: colors.surfaceAlt,
        transform: [{ rotate: '-14deg' }, { translateX: -36 }, { translateY: 10 }],
        shadowColor: colors.shadowCard, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 6, elevation: 2,
      }]}>
        <Text style={{ fontSize: 26, color: colors.iconMuted }}>♣</Text>
      </View>

      {/* Carte milieu droite — gris plus clair, légèrement inclinée */}
      <View style={[card, {
        backgroundColor: colors.searchBackground,
        transform: [{ rotate: '10deg' }, { translateX: 34 }, { translateY: 8 }],
        shadowColor: colors.shadowCard, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 6, elevation: 2,
      }]}>
        <Text style={{ fontSize: 26, color: colors.border }}>♦</Text>
      </View>

      {/* Carte centrale — blanche avec le pique en primary */}
      <View style={[card, {
        backgroundColor: colors.card,
        zIndex: 3,
        shadowColor: colors.shadowCard, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.12, shadowRadius: 10, elevation: 4,
      }]}>
        {/* Coin haut-gauche */}
        <Text style={{ position: 'absolute', top: 5, left: 7, fontSize: 11, fontWeight: '700', color: colors.primary }}>A</Text>
        {/* Symbole central */}
        <Text style={{ fontSize: 30, color: colors.primary }}>♠</Text>
        {/* Coin bas-droit (retourné) */}
        <Text style={{ position: 'absolute', bottom: 5, right: 7, fontSize: 11, fontWeight: '700', color: colors.primary, transform: [{ rotate: '180deg' }] }}>A</Text>
      </View>

      {/* Petit dot accent primary — étoile */}
      <View style={{ position: 'absolute', top: 4, right: 22, width: 9, height: 9, borderRadius: 5,
        backgroundColor: colors.primary, opacity: 0.7, zIndex: 5 }} />
      <View style={{ position: 'absolute', bottom: 6, left: 20, width: 6, height: 6, borderRadius: 3,
        backgroundColor: colors.primary, opacity: 0.45, zIndex: 5 }} />
    </View>
  );
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

const MAX_VISIBLE = 3;

function CartePartie({ item, colors, t }: { item: GameHistoryItem; colors: typeof lightColors; t: ReturnType<typeof useTranslation> }) {
  const config = getGameConfig(item.gameName);
  const [expanded, setExpanded] = useState(false);
  const hasMore = item.ranking.length > MAX_VISIBLE;
  const visible = expanded ? item.ranking : item.ranking.slice(0, MAX_VISIBLE);

  const s = useMemo(() => StyleSheet.create({
    wrap:         { backgroundColor: colors.card, borderRadius: 16, padding: 16, marginBottom: 16,
      shadowColor: colors.shadowCard, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.05,
      shadowRadius: 0, elevation: 3, borderWidth: 2, borderColor: colors.borderSubtle },
    entête:       { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
    logo:         { width: 48, height: 48, borderRadius: 12, borderWidth: 1,borderColor: colors.border,},
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
    voirPlus:     { marginTop: 10, alignItems: 'center' },
    voirPlusTxt:  { fontSize: 13, color: colors.primary, fontWeight: '600' },
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
        {visible.map((joueur, i) => (
          <View key={`${joueur.name}-${i}`} style={s.ligneJoueur}>
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

      {hasMore && (
        <Pressable style={({ pressed }) => [s.voirPlus, pressed && { opacity: 0.72 }]} onPress={() => setExpanded(!expanded)}>
          <Text style={s.voirPlusTxt}>
            {expanded ? t.seeLess : `${t.seeMore} (${item.ranking.length - MAX_VISIBLE})`}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

/* ─── Styles partagés dropdowns ───────────────────────────── */

function useDropdownStyles(colors: typeof lightColors) {
  return useMemo(() => StyleSheet.create({
    input:              { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.inputBackground, borderRadius: 12, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 14, paddingVertical: 12 },
    inputOuvert:        { borderColor: colors.primary, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 },
    placeholder:        { fontSize: 14, color: colors.textMuted, flex: 1 },
    valeurRow:          { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
    valeurTexte:        { fontSize: 14, color: colors.text, fontWeight: '500', flex: 1 },
    logoSmall:          { width: 24, height: 24, borderRadius: 6 },
    liste:              { backgroundColor: colors.card, borderWidth: 1, borderTopWidth: 0, borderColor: colors.primary, borderBottomLeftRadius: 12, borderBottomRightRadius: 12, overflow: 'hidden', maxHeight: 220 },
    option:             { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 14, paddingVertical: 12, borderTopWidth: 1, borderTopColor: colors.border },
    optionSurbrillance: { backgroundColor: colors.primarySubtle },
    optionTexte:        { fontSize: 14, color: colors.text },
    optionActif:        { color: colors.primary, fontWeight: '600' },
  }), [colors]);
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
  const s = useDropdownStyles(colors);

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
        <Ionicons name={ouvert ? 'chevron-up' : 'chevron-down'} size={16} color={colors.textSecondary} />
      </Pressable>

      {ouvert && (
        <View style={s.liste}>
          <ScrollView showsVerticalScrollIndicator={false}>
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
          </ScrollView>
        </View>
      )}
    </>
  );
}

/* ─── Dropdown générique mois / année ────────────────────── */

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
  const [ouvert, setOuvert] = useState(false);
  const s = useDropdownStyles(colors);
  const label = options.find((o) => o.value === valeur)?.label ?? null;

  return (
    <>
      <Pressable
        style={[s.input, ouvert && s.inputOuvert]}
        onPress={() => setOuvert((o) => !o)}
      >
        <Text style={[s.placeholder, label !== null && { color: colors.text, fontWeight: '500' }]}>
          {label ?? placeholder}
        </Text>
        <Ionicons name={ouvert ? 'chevron-up' : 'chevron-down'} size={16} color={colors.textSecondary} />
      </Pressable>

      {ouvert && (
        <View style={s.liste}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Pressable
              style={s.option}
              onPress={() => { onChange(null); setOuvert(false); }}
            >
              <Text style={[s.optionTexte, valeur === null && s.optionActif]}>{placeholder}</Text>
              {valeur === null && <Ionicons name="checkmark" size={16} color={colors.primary} />}
            </Pressable>
            {options.map((opt) => {
              const actif = valeur === opt.value;
              return (
                <Pressable
                  key={opt.value}
                  style={[s.option, actif && s.optionSurbrillance]}
                  onPress={() => { onChange(opt.value); setOuvert(false); }}
                >
                  <Text style={[s.optionTexte, actif && s.optionActif]}>{opt.label}</Text>
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

/* ─── Filtres ─────────────────────────────────────────────── */

type Filtres = {
  jeu:   string | null;
  mois:  number | null; // 0-11
  annee: number | null;
};

const MOIS_LABELS_FR = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
const MOIS_LABELS_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function ModalFiltres({
  visible,
  filtres,
  historique,
  onAppliquer,
  onFermer,
  colors,
  t,
  language,
}: {
  visible:     boolean;
  filtres:     Filtres;
  historique:  GameHistoryItem[];
  onAppliquer: (f: Filtres) => void;
  onFermer:    () => void;
  colors:      typeof lightColors;
  t:           ReturnType<typeof useTranslation>;
  language:    string;
}) {
  const [local, setLocal] = useState<Filtres>(filtres);
  useEffect(() => { setLocal(filtres); }, [filtres, visible]);

  const moisLabels = language === 'fr' ? MOIS_LABELS_FR : MOIS_LABELS_EN;

  const anneesDispos = useMemo(() => {
    const set = new Set<number>();
    historique.forEach(item => set.add(new Date(item.date).getFullYear()));
    return Array.from(set).sort((a, b) => b - a);
  }, [historique]);

  const moisOptions = moisLabels.map((label, i) => ({ label, value: i }));
  const anneeOptions = anneesDispos.map((a) => ({ label: String(a), value: a }));

  const s = useMemo(() => ({
    ...makeSharedStyles(colors),
    ...StyleSheet.create({
      fond:         { flex: 1, backgroundColor: colors.overlay },
      feuille:      { backgroundColor: colors.card, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
      poignée:      { width: 36, height: 4, borderRadius: 2, backgroundColor: colors.border, alignSelf: 'center', marginBottom: 16 },
      titreFeuille: { fontSize: 17, fontWeight: '700', color: colors.text, marginBottom: 20 },
      sectionTitre: { fontSize: 14, fontWeight: '700', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10, marginTop: 16 },
      dateRow:      { flexDirection: 'row', gap: 12 },
      dateCol:      { flex: 1 },
      actions:      { flexDirection: 'row', gap: 12, marginTop: 40 },
    }),
  }), [colors]);

  const réinitialiser = () => {
    const vide: Filtres = { jeu: null, mois: null, annee: null };
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

        <Text style={s.sectionTitre}>{t.date}</Text>
        <View style={s.dateRow}>
          <View style={s.dateCol}>
            <DropdownSelect
              valeur={local.mois}
              options={moisOptions}
              placeholder={t.month}
              onChange={(v) => setLocal((f) => ({ ...f, mois: v }))}
              colors={colors}
            />
          </View>
          <View style={s.dateCol}>
            <DropdownSelect
              valeur={local.annee}
              options={anneeOptions}
              placeholder={t.year}
              onChange={(v) => setLocal((f) => ({ ...f, annee: v }))}
              colors={colors}
            />
          </View>
        </View>

        <View style={s.actions}>
          <Pressable style={({ pressed }) => [s.btn, s.btnSecondary, pressed && s.pressed]} onPress={réinitialiser}>
            <Text style={s.btnSecondaryText}>{t.reset}</Text>
          </Pressable>
          <Pressable style={({ pressed }) => [s.btn, s.btnPrimary, pressed && s.pressed]} onPress={() => { onAppliquer(local); onFermer(); }}>
            <Text style={s.btnPrimaryText}>{t.apply}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

/* ─── Modale confirmation effacement ─────────────────────── */

function ModalConfirmEffacement({
  visible,
  onConfirmer,
  onAnnuler,
  colors,
  t,
}: {
  visible:    boolean;
  onConfirmer: () => void;
  onAnnuler:   () => void;
  colors:     typeof lightColors;
  t:          ReturnType<typeof useTranslation>;
}) {
  const s = useMemo(() => ({
    ...makeSharedStyles(colors),
    ...StyleSheet.create({
      overlay: { flex: 1, backgroundColor: colors.overlay, justifyContent: 'center' as const, paddingHorizontal: 24 },
      carte:   { backgroundColor: colors.card, borderRadius: 20, paddingHorizontal: 24, paddingTop: 24, paddingBottom: 20 },
      titre:   { fontSize: 17, fontWeight: '700' as const, color: colors.text, marginBottom: 8 },
      sous:    { fontSize: 14, color: colors.textSecondary, marginBottom: 24, lineHeight: 20 },
      btnDanger: { backgroundColor: colors.danger, shadowColor: colors.danger, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 0, elevation: 8 },
    }),
  }), [colors]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onAnnuler}>
      <Pressable style={s.overlay} onPress={onAnnuler}>
        <Pressable onPress={(e) => e.stopPropagation()}>
          <View style={s.carte}>
            <Text style={s.titre}>{t.clearHistory}</Text>
            <Text style={s.sous}>{t.clearHistoryMsg}</Text>
            <View style={s.buttons}>
              <Pressable
                style={({ pressed }) => [s.btn, s.btnSecondary, pressed && s.pressed]}
                onPress={onAnnuler}
              >
                <Text style={s.btnSecondaryText}>{t.cancel}</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [s.btn, s.btnDanger, pressed && s.pressed]}
                onPress={onConfirmer}
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

  const styles = useMemo(() => StyleSheet.create({
    conteneur:     { flex: 1, backgroundColor: colors.background },
    liste:         { paddingHorizontal: 16, paddingBottom: 24, paddingTop: 8 },
    entêteSection: { fontSize: 11, fontWeight: '700', color: colors.textMuted, letterSpacing: 1, textTransform: 'uppercase', marginTop: 16, marginBottom: 8 },
    vide:          { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
    videTitre:     { fontSize: 17, fontWeight: '700', color: colors.text },
    videSous:      { fontSize: 14, color: colors.textMuted, textAlign: 'center', paddingHorizontal: 32 },
    hdrBtn:        { width: 34, height: 34, borderRadius: 100, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
    hdrPoint:      { position: 'absolute', top: 5, right: 5, width: 7, height: 7, borderRadius: 4, backgroundColor: '#fff' },
  }), [colors]);

  const [historique, setHistorique]        = useState<GameHistoryItem[]>([]);
  const [filtresOuverts, setFiltresOuverts] = useState(false);
  const [filtres, setFiltres]              = useState<Filtres>({ jeu: null, mois: null, annee: null });
  const [confirmVisible, setConfirmVisible] = useState(false);

  const charger = useCallback(() => { getHistory().then(setHistorique); }, []);
  useFocusEffect(charger);

  const aDesFiltres = filtres.jeu !== null || filtres.mois !== null || filtres.annee !== null;

  const effacerHistorique = useCallback(async () => {
    await clearHistory();
    setHistorique([]);
    setFiltres({ jeu: null, mois: null, annee: null });
    setConfirmVisible(false);
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: t.history,
      headerRight: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingRight: 16 }}>
          <Pressable onPress={() => setConfirmVisible(true)} style={({ pressed }) => [styles.hdrBtn, pressed && { opacity: 0.72 }]} hitSlop={8}>
            <Ionicons name="trash-outline" size={20} color="#fff" />
          </Pressable>
          <Pressable onPress={() => setFiltresOuverts(true)} style={({ pressed }) => [styles.hdrBtn, pressed && { opacity: 0.72 }]} hitSlop={8}>
            <Ionicons name="filter-outline" size={20} color="#fff" />
            {aDesFiltres && <View style={styles.hdrPoint} />}
          </Pressable>
        </View>
      ),
    });
  }, [navigation, aDesFiltres, filtresOuverts, colors, styles, t]);

  const filtré = useMemo(() => {
    return historique.filter((item) => {
      if (filtres.jeu && item.gameName !== filtres.jeu) return false;
      const d = new Date(item.date);
      if (filtres.mois !== null && d.getMonth() !== filtres.mois) return false;
      if (filtres.annee !== null && d.getFullYear() !== filtres.annee) return false;
      return true;
    });
  }, [historique, filtres]);

  const sections = useMemo(() => groupParMois(filtré), [filtré]);

  return (
    <View style={styles.conteneur}>
      {sections.length === 0 ? (
        <View style={styles.vide}>
          <IllustrationCartes colors={colors} />
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
          renderItem={({ item }) => <CartePartie item={item} colors={colors} t={t} />}
        />
      )}

      <ModalFiltres
        visible={filtresOuverts}
        filtres={filtres}
        historique={historique}
        onAppliquer={setFiltres}
        onFermer={() => setFiltresOuverts(false)}
        colors={colors}
        t={t}
        language={language}
      />

      <ModalConfirmEffacement
        visible={confirmVisible}
        onConfirmer={effacerHistorique}
        onAnnuler={() => setConfirmVisible(false)}
        colors={colors}
        t={t}
      />
    </View>
  );
}
