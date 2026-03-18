import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.placeholder}>Paramètres</Text>
      <Text style={styles.sub}>Bientôt disponible</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholder: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  sub: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 6,
  },
});
