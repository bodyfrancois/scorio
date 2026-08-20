import React, { useMemo, useLayoutEffect, useState } from 'react';
import { View, Text, Switch, ScrollView, Pressable, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { File } from 'expo-file-system';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeContext';
import { useTranslation } from '../i18n';
import { makeSharedStyles } from '../theme/styles';
import SelectableRow from '../components/SelectableRow';
import ImportDataModal from '../components/ImportDataModal';
import { exportAllData } from '../storage/exportData';
import { ImportMode, ImportResult } from '../storage/importData';

export default function SettingsScreen() {
  const { colors, isDark, toggleDark, language, setLanguage } = useTheme();
  const t = useTranslation(language);
  const styles = useMemo(() => makeSharedStyles(colors), [colors]);
  const navigation = useNavigation();
  const [exporting, setExporting] = useState(false);
  const [picking, setPicking] = useState(false);
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [pickedFileName, setPickedFileName] = useState('');
  const [pickedFileContent, setPickedFileContent] = useState('');

  useLayoutEffect(() => {
    navigation.setOptions({ headerTitle: t.settings });
  }, [navigation, t.settings]);

  const handleExport = async () => {
    if (exporting) return;
    setExporting(true);
    try {
      await exportAllData(t.exportData);
    } catch {
      Alert.alert(t.exportErrorTitle, t.exportErrorMessage);
    } finally {
      setExporting(false);
    }
  };

  // Le sélecteur de fichier natif est ouvert ICI, avant toute modale custom —
  // le présenter alors qu'une <Modal> RN est déjà affichée bloque l'app sur iOS.
  const handlePickImportFile = async () => {
    if (picking) return;
    setPicking(true);
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/json',
        copyToCacheDirectory: true,
      });
      if (result.canceled) return;
      const asset = result.assets[0];
      const content = await new File(asset.uri).text();
      setPickedFileName(asset.name);
      setPickedFileContent(content);
      setImportModalVisible(true);
    } catch {
      Alert.alert(t.importErrorTitle, t.importErrorMessage);
    } finally {
      setPicking(false);
    }
  };

  const handleImported = (result: ImportResult, mode: ImportMode) => {
    const prefix = mode === 'replace' ? t.importSuccessReplaced : t.importSuccessAdded;
    Alert.alert(
      t.importSuccessTitle,
      `${prefix} ${result.addedGames} ${t.importGamesUnit} ${t.importAnd} ${result.addedFavorites} ${t.importFavoritesUnit}.`
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingTop: 28 }]}
        showsVerticalScrollIndicator={false}
      >

        {/* ── LANGUE ── */}
        <Text style={styles.sectionLabel}>{t.language}</Text>
        <View style={styles.card}>
          <SelectableRow
            icon={<Text style={{ fontSize: 18 }}>🇫🇷</Text>}
            label={t.french}
            selected={language === 'fr'}
            onPress={() => setLanguage('fr')}
          />
          <View style={styles.listRowDivider} />
          <SelectableRow
            icon={<Text style={{ fontSize: 18 }}>🇬🇧</Text>}
            label={t.english}
            selected={language === 'en'}
            onPress={() => setLanguage('en')}
          />
        </View>

        {/* ── APPARENCE ── */}
        <Text style={[styles.sectionLabel, { marginTop: 10 }]}>{t.appearance}</Text>
        <View style={styles.card}>
          <View style={styles.listRow}>
            <View style={[styles.iconBoxSm, { marginRight: 12 }]}>
              <Ionicons
                name={isDark ? 'moon' : 'sunny-outline'}
                size={18}
                color={colors.textSecondary}
              />
            </View>
            <Text style={[styles.body, { flex: 1 }]}>{t.darkMode}</Text>
            <Switch
              value={isDark}
              onValueChange={toggleDark}
              trackColor={{ false: colors.searchBackground, true: colors.primaryLight }}
              thumbColor={isDark ? colors.primary : colors.textMuted}
              ios_backgroundColor={colors.searchBackground}
            />
          </View>
        </View>

        {/* ── EXPORT ── */}
        <Text style={[styles.sectionLabel, { marginTop: 10 }]}>{t.export}</Text>
        <Pressable
          accessibilityRole="button"
          style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
          onPress={handleExport}
          disabled={exporting}
        >
          <View style={styles.listRow}>
            <View style={[styles.iconBoxSm, { marginRight: 12 }]}>
              <Ionicons name="share-outline" size={18} color={colors.textSecondary} />
            </View>
            <Text style={[styles.body, { flex: 1 }]}>{t.exportData}</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.iconMuted} />
          </View>
          <Text style={[styles.caption, { marginTop: 0, paddingLeft: 46, lineHeight: 18 }]}>{t.exportDataHint}</Text>
        </Pressable>

        {/* ── IMPORT ── */}
        <Pressable
          accessibilityRole="button"
          style={({ pressed }) => [styles.card, { marginTop: 0 }, pressed && styles.cardPressed]}
          onPress={handlePickImportFile}
          disabled={picking}
        >
          <View style={styles.listRow}>
            <View style={[styles.iconBoxSm, { marginRight: 12 }]}>
              <Ionicons name="download-outline" size={18} color={colors.textSecondary} />
            </View>
            <Text style={[styles.body, { flex: 1 }]}>{picking ? t.importPicking : t.importData}</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.iconMuted} />
          </View>
          <Text style={[styles.caption, { marginTop: 0, paddingLeft: 46, lineHeight: 18 }]}>{t.importDataHint}</Text>
        </Pressable>

      </ScrollView>

      <ImportDataModal
        visible={importModalVisible}
        fileName={pickedFileName}
        fileContent={pickedFileContent}
        onClose={() => setImportModalVisible(false)}
        onImported={handleImported}
      />
    </View>
  );
}
