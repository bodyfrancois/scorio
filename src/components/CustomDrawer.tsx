import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { useTheme } from '../theme/ThemeContext';
import { useTranslation } from '../i18n';
import { lightColors } from '../theme/colors';
import IconHome from './icons/IconHome';
import IconHistory from './icons/IconHistory';
import IconSettings from './icons/IconSettings';
import IconAbout from './icons/IconAbout';

const version = Constants.expoConfig?.version ?? '1.0.0';
const buildNumber = Constants.expoConfig?.ios?.buildNumber ?? '1';

const makeStyles = (c: typeof lightColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: c.card,
      paddingTop: 56,
      paddingHorizontal: 16,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    logoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    iconBox: {
      width: 34,
      height: 34,
      borderRadius: 9,
      backgroundColor: c.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    iconLetter: {
      color: c.white,
      fontWeight: '800',
      fontSize: 18,
    },
    appName: {
      fontSize: 20,
      fontWeight: '700',
      color: c.text,
    },
    divider: {
      height: 1,
      backgroundColor: c.border,
      marginBottom: 12,
    },
    menu: {
      gap: 4,
    },
    item: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
      paddingVertical: 13,
      paddingHorizontal: 12,
      borderRadius: 12,
    },
    itemActive: {
      backgroundColor: c.primarySubtle,
    },
    label: {
      fontSize: 15,
      fontWeight: '500',
      color: c.text,
    },
    labelActive: {
      color: c.primary,
      fontWeight: '600',
    },
    version: {
      position: 'absolute',
      bottom: 36,
      alignSelf: 'center',
      fontSize: 12,
      color: c.textMuted,
    },
  });

export default function CustomDrawer(props: DrawerContentComponentProps) {
  const { colors, language } = useTheme();
  const t = useTranslation(language);
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const currentRoute = props.state.routes[props.state.index].name;

  const ITEMS = [
    { name: 'Accueil',    label: t.home,    Icon: IconHome },
    { name: 'Historique', label: t.history, Icon: IconHistory },
    { name: 'Paramètres', label: t.settings, Icon: IconSettings },
    { name: 'A propos',   label: t.about,   Icon: IconAbout },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoRow}>
          <View style={styles.iconBox}>
            <Text style={styles.iconLetter}>S</Text>
          </View>
          <Text style={styles.appName}>Scorio</Text>
        </View>
        <Pressable onPress={() => props.navigation.closeDrawer()} hitSlop={10}>
          <Ionicons name="close" size={22} color={colors.textSecondary} />
        </Pressable>
      </View>

      <View style={styles.divider} />

      {/* Menu items */}
      <View style={styles.menu}>
        {ITEMS.map(({ name, label, Icon }) => {
          const active = currentRoute === name;
          return (
            <Pressable
              key={name}
              style={[styles.item, active && styles.itemActive]}
              onPress={() => props.navigation.navigate(name)}
            >
              <Icon size={22} color={active ? colors.primary : colors.text} />
              <Text style={[styles.label, active && styles.labelActive]}>
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Footer */}
      <Text style={styles.version}>
        Version {version} (Build {buildNumber})
      </Text>
    </View>
  );
}
