import { useState, useMemo } from 'react';
import {
  View,
  Text,
  Pressable,
  Modal,
  Animated,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { useTranslation } from '../i18n';
import { makeSharedStyles } from '../theme/styles';
import { useSheetAnimation } from '../hooks/useSheetAnimation';
import { importAllData, ImportMode, ImportResult } from '../storage/importData';

type Props = {
  visible: boolean;
  fileName: string;
  fileContent: string;
  onClose: () => void;
  onImported: (result: ImportResult, mode: ImportMode) => void;
};

type RadioRowProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
  accentColor: string;
  borderColor: string;
  textColor: string;
};

function RadioRow({ label, selected, onPress, accentColor, borderColor, textColor }: RadioRowProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      style={({ pressed }) => [{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10 }, pressed && { opacity: 0.7 }]}
    >
      <View
        style={{
          width: 20,
          height: 20,
          borderRadius: 10,
          borderWidth: 2,
          borderColor: selected ? accentColor : borderColor,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 12,
        }}
      >
        {selected && <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: accentColor }} />}
      </View>
      <Text style={{ flex: 1, fontSize: 16, color: textColor }}>{label}</Text>
    </Pressable>
  );
}

export default function ImportDataModal({ visible, fileName, fileContent, onClose, onImported }: Props) {
  const { colors, language } = useTheme();
  const t = useTranslation(language);
  const styles = useMemo(() => makeSharedStyles(colors), [colors]);
  const { rendered, overlayStyle, sheetStyle } = useSheetAnimation(visible);

  const [mode, setMode] = useState<ImportMode>('merge');
  const [importing, setImporting] = useState(false);

  const close = () => {
    if (importing) return;
    setMode('merge');
    onClose();
  };

  const runImport = async () => {
    setImporting(true);
    try {
      const result = await importAllData(fileContent, mode);
      const importedMode = mode;
      setMode('merge');
      onClose();
      onImported(result, importedMode);
    } catch {
      Alert.alert(t.importErrorTitle, t.importErrorMessage);
    } finally {
      setImporting(false);
    }
  };

  const handleImportPress = () => {
    if (importing) return;
    if (mode === 'replace') {
      Alert.alert(
        t.importReplaceConfirmTitle,
        t.importReplaceConfirmMessage,
        [
          { text: t.cancel, style: 'cancel' },
          { text: t.importReplaceConfirmAction, style: 'destructive', onPress: runImport },
        ]
      );
    } else {
      runImport();
    }
  };

  return (
    <Modal visible={rendered} transparent animationType="none" onRequestClose={close}>
      <Animated.View style={[styles.overlay, StyleSheet.absoluteFillObject, overlayStyle]} />
      <View style={{ flex: 1, justifyContent: 'flex-end' }} pointerEvents="box-none">
        <Animated.View style={[styles.sheet, sheetStyle, { maxHeight: '92%', paddingBottom: 0 }]}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 48 }}>
            <View style={styles.sheetHandle} />
            <Text style={[styles.subheading, { marginBottom: 6 }]} accessibilityRole="header">{t.importData}</Text>
            <Text style={[styles.bodySecondary, { marginBottom: 16, lineHeight: 20 }]}>{t.importDataHint}</Text>

            <View style={[styles.card, styles.cardRow]}>
              <View style={styles.iconBoxSm}>
                <Ionicons name="document-text" size={18} color={colors.primary} />
              </View>
              <Text style={[styles.body, { flex: 1 }]} numberOfLines={1}>{fileName}</Text>
              <Ionicons name="checkmark-circle" size={18} color={colors.primary} />
            </View>

            <Text style={[styles.sheetSectionTitle, { marginTop: 20 }]}>{t.importModeLabel}</Text>
            <RadioRow
              label={t.importModeMerge}
              selected={mode === 'merge'}
              onPress={() => setMode('merge')}
              accentColor={colors.primary}
              borderColor={colors.border}
              textColor={colors.text}
            />
            <RadioRow
              label={t.importModeReplace}
              selected={mode === 'replace'}
              onPress={() => setMode('replace')}
              accentColor={colors.danger}
              borderColor={colors.border}
              textColor={colors.text}
            />

            <View style={[styles.buttons, { marginTop: 30 }]}>
              <Pressable accessibilityRole="button"
                style={({ pressed }) => [styles.btn, styles.btnPrimary, importing && styles.btnDisabled, pressed && !importing && styles.pressed]}
                onPress={handleImportPress}
                disabled={importing}
              >
                <Text style={styles.btnPrimaryText}>{importing ? t.importing : t.importAction}</Text>
              </Pressable>
              <Pressable accessibilityRole="button" style={({ pressed }) => [styles.btn, styles.btnSecondary, pressed && styles.pressed]} onPress={close}>
                <Text style={styles.btnSecondaryText}>{t.cancel}</Text>
              </Pressable>
            </View>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}
