import React, { useMemo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { useTheme } from '../theme/ThemeContext';
import { useTranslation } from '../i18n';
import { makeCustomDrawerStyles } from '../theme/styles';
import IconHome from './icons/IconHome';
import IconHistory from './icons/IconHistory';
import IconPlayers from './icons/IconPlayers';
import IconStats from './icons/IconStats';
import IconSettings from './icons/IconSettings';
import IconAbout from './icons/IconAbout';

const version = Constants.expoConfig?.version ?? '1.0.0';
const buildNumber = Constants.expoConfig?.ios?.buildNumber ?? '1';

export default function CustomDrawer(props: DrawerContentComponentProps) {
  const { colors, language } = useTheme();
  const t = useTranslation(language);
  const styles = useMemo(() => makeCustomDrawerStyles(colors), [colors]);

  const currentRoute = props.state.routes[props.state.index].name;

  const ITEMS = [
    { name: 'Accueil',       label: t.home,        Icon: IconHome },
    { name: 'Historique',    label: t.history,     Icon: IconHistory },
    { name: 'Joueurs',       label: t.playersMenu, Icon: IconPlayers },
    { name: 'Statistiques',  label: t.statistics,  Icon: IconStats },
    { name: 'Paramètres',    label: t.settings,    Icon: IconSettings },
    { name: 'A propos',      label: t.about,       Icon: IconAbout },
  ];

  return (
    <View style={styles.drawerContainer}>
      {/* Header */}
      <View style={styles.drawerHeader}>
        <View style={styles.logoRow}>
          <View style={styles.iconBoxBrand}>
            <Text style={styles.iconLetter}>S</Text>
          </View>
          <Text style={styles.subheading}>Scorio</Text>
        </View>
        <Pressable onPress={() => props.navigation.closeDrawer()} hitSlop={10}>
          <Ionicons name="close" size={22} color={colors.textSecondary} />
        </Pressable>
      </View>

      <View style={styles.drawerDivider} />

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
              <Text style={[styles.bodyMedium, active && styles.labelActive]}>
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Footer */}
      <Text style={[styles.muted, { position: 'absolute', bottom: 36, alignSelf: 'center' }]}>
        Version {version} (Build {buildNumber})
      </Text>
    </View>
  );
}
