import { useState, useEffect, useMemo } from 'react';
import { View, Text, Pressable, Modal } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { useTranslation } from '../i18n';
import { makeSharedStyles } from '../theme/styles';
import { DropdownSelect, DropdownGame } from './Dropdown';

export type FilterState = {
  game: string | null;
  month: number | null;
  year: number | null;
};

const MONTH_LABELS_FR = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
const MONTH_LABELS_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

type Props = {
  visible: boolean;
  value: FilterState;
  gameOptions: string[];
  availableYears: number[];
  onApply: (f: FilterState) => void;
  onClose: () => void;
};

export default function FilterModal({ visible, value, gameOptions, availableYears, onApply, onClose }: Props) {
  const { colors, language } = useTheme();
  const t = useTranslation(language);
  const s = useMemo(() => makeSharedStyles(colors), [colors]);

  const [local, setLocal] = useState<FilterState>(value);
  useEffect(() => { if (visible) setLocal(value); }, [visible, value]);

  const monthLabels = language === 'fr' ? MONTH_LABELS_FR : MONTH_LABELS_EN;
  const monthOptions = monthLabels.map((label, i) => ({ label, value: i }));
  const yearOptions = availableYears.map((y) => ({ label: String(y), value: y }));

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={s.overlay} onPress={onClose} />
      <View style={s.sheet}>
        <View style={s.sheetHandle} />
        <Text style={[s.subheading, { marginBottom: 20 }]}>{t.filterGames}</Text>

        {gameOptions.length > 0 && (
          <>
            <Text style={s.sheetSectionTitle}>{t.game}</Text>
            <DropdownGame
              value={local.game}
              options={gameOptions}
              placeholder={t.allGames}
              onChange={(v) => setLocal((f) => ({ ...f, game: v }))}
            />
          </>
        )}

        <Text style={s.sheetSectionTitle}>{t.date}</Text>
        <View style={s.sheetDateRow}>
          <View style={s.sheetDateCol}>
            <DropdownSelect
              value={local.month}
              options={monthOptions}
              placeholder={t.month}
              onChange={(v) => setLocal((f) => ({ ...f, month: v }))}
            />
          </View>
          <View style={s.sheetDateCol}>
            <DropdownSelect
              value={local.year}
              options={yearOptions}
              placeholder={t.year}
              onChange={(v) => setLocal((f) => ({ ...f, year: v }))}
            />
          </View>
        </View>

        <View style={s.sheetActions}>
          <Pressable
            style={({ pressed }) => [s.btn, s.btnSecondary, pressed && s.pressed]}
            onPress={() => { onApply({ game: null, month: null, year: null }); onClose(); }}
          >
            <Text style={s.btnSecondaryText}>{t.reset}</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [s.btn, s.btnPrimary, pressed && s.pressed]}
            onPress={() => { onApply(local); onClose(); }}
          >
            <Text style={s.btnPrimaryText}>{t.apply}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
