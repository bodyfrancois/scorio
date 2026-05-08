import React, { useMemo, useLayoutEffect } from 'react';
import { View, Text, Switch, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeContext';
import { useTranslation } from '../i18n';
import { lightColors } from '../theme/colors';
import { makeSharedStyles } from '../theme/styles';

const makeStyles = (c: typeof lightColors) => ({
  ...makeSharedStyles(c),
});

export default function SettingsScreen() {
  const { colors, isDark, toggleDark, language, setLanguage } = useTheme();
  const t = useTranslation(language);
  const styles = useMemo(() => makeStyles(colors), [colors]);
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
        <View style={styles.cardList}>

          <Pressable
            style={({ pressed }) => [styles.listRow, pressed && styles.pressed]}
            onPress={() => setLanguage('fr')}
          >
            <View style={styles.listRowIcon}>
              <Text style={{ fontSize: 18 }}>🇫🇷</Text>
            </View>
            <Text style={[styles.listRowLabel, language === 'fr' && { color: colors.primary, fontWeight: '600' }]}>
              {t.french}
            </Text>
            {language === 'fr' && (
              <Ionicons name="checkmark" size={18} color={colors.primary} style={{ marginLeft: 8 }} />
            )}
          </Pressable>

          <View style={styles.listRowDivider} />

          <Pressable
            style={({ pressed }) => [styles.listRow, pressed && styles.pressed]}
            onPress={() => setLanguage('en')}
          >
            <View style={styles.listRowIcon}>
              <Text style={{ fontSize: 18 }}>🇬🇧</Text>
            </View>
            <Text style={[styles.listRowLabel, language === 'en' && { color: colors.primary, fontWeight: '600' }]}>
              {t.english}
            </Text>
            {language === 'en' && (
              <Ionicons name="checkmark" size={18} color={colors.primary} style={{ marginLeft: 8 }} />
            )}
          </Pressable>

        </View>

        {/* ── APPARENCE ── */}
        <Text style={styles.sectionLabel}>{t.appearance}</Text>
        <View style={styles.cardList}>
          <View style={styles.listRow}>
            <View style={styles.listRowIcon}>
              <Ionicons
                name={isDark ? 'moon' : 'sunny-outline'}
                size={18}
                color={colors.textSecondary}
              />
            </View>
            <Text style={styles.listRowLabel}>{t.darkMode}</Text>
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
