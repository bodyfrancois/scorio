import React, { useMemo, useLayoutEffect } from 'react';
import { View, Text } from 'react-native';
import Constants from 'expo-constants';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeContext';
import { useTranslation } from '../i18n';
import { makeAboutStyles } from '../theme/styles';

const version = Constants.expoConfig?.version ?? '1.0.0';
const buildNumber = Constants.expoConfig?.ios?.buildNumber ?? '1';

export default function AboutScreen() {
  const { colors, language } = useTheme();
  const t = useTranslation(language);
  const styles = useMemo(() => makeAboutStyles(colors), [colors]);
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
      <Text style={[styles.muted, { marginTop: 4 }]}>Version {version} (Build {buildNumber})</Text>

      <View style={styles.divider} />

      <Text style={[styles.bodySecondary, { textAlign: 'center', lineHeight: 22 }]}>{t.description}</Text>

      <Text style={[styles.muted, { position: 'absolute', bottom: 48 }]}>by @MisterBuddy</Text>
    </View>
  );
}
