import React, { useMemo, useLayoutEffect } from 'react';
import { View, Text, Switch, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeContext';
import { useTranslation } from '../i18n';
import { makeSharedStyles } from '../theme/styles';
import SelectableRow from '../components/SelectableRow';

export default function SettingsScreen() {
  const { colors, isDark, toggleDark, language, setLanguage } = useTheme();
  const t = useTranslation(language);
  const styles = useMemo(() => makeSharedStyles(colors), [colors]);
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ headerTitle: t.settings });
  }, [navigation, t.settings]);

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
        <Text style={styles.sectionLabel}>{t.appearance}</Text>
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

      </ScrollView>
    </View>
  );
}
