import { useMemo, useLayoutEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
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
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* App info */}
      <View style={[styles.card,{ alignItems: 'center' }]}>
        <View style={styles.iconBox}>
          <Text style={styles.iconLetter}>S</Text>
        </View>
        <Text style={styles.appName}>ScorUp</Text>
        <Text style={[styles.bodySecondary, { textAlign: 'center', lineHeight: 22 }]}>{t.aboutBio}</Text>
      </View>

      {/* Politique de confidentialité */}
      <View style={styles.card}>
        <Text style={[styles.itemTitle, { fontSize: 18, marginBottom: 4 }]}>{t.privacyPolicyTitle}</Text>
        <Text style={[styles.caption, { marginBottom: 12 }]}>{t.privacyPolicyUpdated}</Text>
        <Text style={[styles.bodySecondary, { lineHeight: 22 }]}>{t.privacyPolicyBody}</Text>
      </View>

    </ScrollView>
  );
}
