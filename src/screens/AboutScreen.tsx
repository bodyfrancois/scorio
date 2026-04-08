import React, { useMemo, useLayoutEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeContext';
import { useTranslation } from '../i18n';
import { lightColors } from '../theme/colors';
import { makeSharedStyles } from '../theme/styles';

const version = Constants.expoConfig?.version ?? '1.0.0';
const buildNumber = Constants.expoConfig?.ios?.buildNumber ?? '1';

const makeStyles = (c: typeof lightColors) => ({
  ...makeSharedStyles(c),
  ...StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: c.background,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      paddingHorizontal: 32,
    },
    iconBox: {
      width: 72,
      height: 72,
      borderRadius: 18,
      backgroundColor: c.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
    },
    iconLetter: {
      color: c.white,
      fontWeight: '800',
      fontSize: 38,
    },
    appName: {
      fontSize: 28,
      fontWeight: '800',
      color: c.text,
    },
    version: {
      fontSize: 13,
      color: c.textMuted,
      marginTop: 4,
    },
    divider: {
      width: 40,
      height: 2,
      backgroundColor: c.border,
      borderRadius: 2,
      marginVertical: 24,
    },
    description: {
      fontSize: 15,
      color: c.textSecondary,
      textAlign: 'center',
      lineHeight: 22,
    },
    credit: {
      position: 'absolute',
      bottom: 48,
      fontSize: 13,
      color: c.textMuted,
    },
  }),
});

export default function AboutScreen() {
  const { colors, language } = useTheme();
  const t = useTranslation(language);
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ headerTitle: t.about });
  }, [navigation, t.about]);

  return (
    <View style={styles.container}>
      <View style={styles.iconBox}>
        <Text style={styles.iconLetter}>S</Text>
      </View>
      <Text style={styles.appName}>Scorio</Text>
      <Text style={styles.version}>Version {version} (Build {buildNumber})</Text>

      <View style={styles.divider} />

      <Text style={styles.description}>{t.description}</Text>

      <Text style={styles.credit}>by @MisterBuddy</Text>
    </View>
  );
}
