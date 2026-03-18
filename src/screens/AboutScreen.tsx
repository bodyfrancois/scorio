import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import Constants from 'expo-constants';

const version = Constants.expoConfig?.version ?? '1.0.0';
const buildNumber = Constants.expoConfig?.ios?.buildNumber ?? '1';

export default function AboutScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.iconBox}>
        <Text style={styles.iconLetter}>S</Text>
      </View>
      <Text style={styles.appName}>Scorio</Text>
      <Text style={styles.version}>Version {version} (Build {buildNumber})</Text>

      <View style={styles.divider} />

      <Text style={styles.description}>
        Scorio est une application de gestion de scores pour vos jeux de société préférés.
      </Text>

      <Text style={styles.credit}>by @MisterBuddy</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  iconBox: {
    width: 72,
    height: 72,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  iconLetter: {
    color: colors.white,
    fontWeight: '800',
    fontSize: 38,
  },
  appName: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
  },
  version: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 4,
  },
  divider: {
    width: 40,
    height: 2,
    backgroundColor: colors.border,
    borderRadius: 2,
    marginVertical: 24,
  },
  description: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  credit: {
    position: 'absolute',
    bottom: 48,
    fontSize: 13,
    color: colors.textMuted,
  },
});
