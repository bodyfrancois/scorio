import React, { useMemo, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, Switch, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeContext';
import { useTranslation } from '../i18n';
import { lightColors } from '../theme/colors';
import { makeSharedStyles } from '../theme/styles';

const makeStyles = (c: typeof lightColors) => ({
  ...makeSharedStyles(c),
  ...StyleSheet.create({
    scroll: {
      paddingHorizontal: 20,
      paddingTop: 28,
      paddingBottom: 48,
    },
    sectionLabel: {
      fontSize: 11,
      fontWeight: '700',
      color: c.textMuted,
      letterSpacing: 1,
      marginBottom: 10,
    },
    card2: {
      backgroundColor: c.card,
      borderRadius: 24,
      padding: 8,
      marginBottom: 32,
      shadowColor: c.shadowCard,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.05,
      shadowRadius: 0,
      elevation: 3,
      borderWidth: 2,
      borderColor: c.borderSubtle,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 14,
      paddingHorizontal: 16,
    },
    rowDivider: {
      height: 1,
      backgroundColor: c.border,
      marginHorizontal: 16,
    },
    rowIcon: {
      width: 34,
      height: 34,
      borderRadius: 8,
      backgroundColor: c.iconBackground,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    rowLabel: {
      flex: 1,
      fontSize: 15,
      color: c.text,
    },
    optionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 14,
      paddingHorizontal: 16,
    },
    optionLabel: {
      flex: 1,
      fontSize: 15,
      color: c.text,
    },
    optionLabelActive: {
      color: c.primary,
      fontWeight: '600',
    },
    checkIcon: {
      marginLeft: 8,
    },
  }),
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
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* ── LANGUE ── */}
        <Text style={styles.sectionLabel}>{t.language}</Text>
        <View style={styles.card2}>

          <Pressable
            style={({ pressed }) => [styles.optionRow, pressed && styles.pressed]}
            onPress={() => setLanguage('fr')}
          >
            <View style={styles.rowIcon}>
              <Text style={{ fontSize: 18 }}>🇫🇷</Text>
            </View>
            <Text style={[styles.optionLabel, language === 'fr' && styles.optionLabelActive]}>
              {t.french}
            </Text>
            {language === 'fr' && (
              <Ionicons name="checkmark" size={18} color={colors.primary} style={styles.checkIcon} />
            )}
          </Pressable>

          <View style={styles.rowDivider} />

          <Pressable
            style={({ pressed }) => [styles.optionRow, pressed && styles.pressed]}
            onPress={() => setLanguage('en')}
          >
            <View style={styles.rowIcon}>
              <Text style={{ fontSize: 18 }}>🇬🇧</Text>
            </View>
            <Text style={[styles.optionLabel, language === 'en' && styles.optionLabelActive]}>
              {t.english}
            </Text>
            {language === 'en' && (
              <Ionicons name="checkmark" size={18} color={colors.primary} style={styles.checkIcon} />
            )}
          </Pressable>

        </View>

        {/* ── APPARENCE ── */}
        <Text style={styles.sectionLabel}>{t.appearance}</Text>
        <View style={styles.card2}>
          <View style={styles.row}>
            <View style={styles.rowIcon}>
              <Ionicons
                name={isDark ? 'moon' : 'sunny-outline'}
                size={18}
                color={colors.textSecondary}
              />
            </View>
            <Text style={styles.rowLabel}>{t.darkMode}</Text>
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
