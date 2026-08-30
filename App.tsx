import 'react-native-gesture-handler';

import React, { useState } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import SplashScreen from './src/screens/SplashScreen';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

// Hauteur de la zone titre/boutons du header, SOUS la status bar.
// La hauteur totale du header vaut insets.top + cette valeur : jamais de valeur
// en dur, sinon la zone de contenu rétrécit sur les appareils à grande encoche
// (Dynamic Island : inset 59-62 pt contre 47 pt sur iPhone 13) et le titre est rogné.
const HEADER_CONTENT_HEIGHT = 64;

const HEADER_GRADIENT_COLORS: [string, string, string] = ['#5B2D9E', '#7B3FBE', '#A855F7'];
const HEADER_GRADIENT_START = { x: 0.15, y: 0 };
const HEADER_GRADIENT_END = { x: 0.85, y: 1 };

function HeaderGradient() {
  return (
    <LinearGradient
      colors={HEADER_GRADIENT_COLORS}
      start={HEADER_GRADIENT_START}
      end={HEADER_GRADIENT_END}
      style={StyleSheet.absoluteFill}
    />
  );
}

import HomeScreen from './src/screens/HomeScreen';
import NewGameScreen from './src/screens/NewGameScreen';
import ScoreboardScreen from './src/screens/ScoreboardScreen';
import DiceSetupScreen from './src/screens/DiceSetupScreen';
import DiceRollerScreen from './src/screens/DiceRollerScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import PlayersScreen from './src/screens/PlayersScreen';
import StatsScreen from './src/screens/StatsScreen';
import PlayerDetailScreen from './src/screens/PlayerDetailScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import AboutScreen from './src/screens/AboutScreen';
import SupportScreen from './src/screens/SupportScreen';
import CoinTossScreen from './src/screens/CoinTossScreen';
import TimerScreen from './src/screens/TimerScreen';
import WheelScreen from './src/screens/WheelScreen';
import BuzzerScreen from './src/screens/BuzzerScreen';
import CustomDrawer from './src/components/CustomDrawer';
import { ThemeProvider, useTheme } from './src/theme/ThemeContext';
import { useTranslation } from './src/i18n';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

/* ---------------- FLÈCHE CUSTOM ---------------- */

function CustomBackButton({ navigation }: any) {
  const { language } = useTheme();
  const t = useTranslation(language);
  return (
    <Pressable
      onPress={() => navigation.goBack()}
      style={{ marginLeft: 16, width: 34, height: 34, borderRadius: 100, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' }}
      accessibilityRole="button"
      accessibilityLabel={t.back}
    >
      <Ionicons name="chevron-back" size={22} color="#fff" />
    </Pressable>
  );
}

/* ---------------- LOGO HEADER ---------------- */

function HeaderLogo() {
  return (
    <View style={logoStyles.row}>
      <View style={[logoStyles.iconBox, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
        <Text style={[logoStyles.iconLetter, { color: '#fff' }]}>S</Text>
      </View>
      <Text style={[logoStyles.label, { color: '#fff' }]}>ScorUp</Text>
    </View>
  );
}

const logoStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBox: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLetter: {
    fontWeight: '800',
    fontSize: 16,
  },
  label: {
    fontSize: 18,
    fontWeight: '700',
  },
});

/* ---------------- DRAWER ---------------- */

function MainDrawer() {
  const insets = useSafeAreaInsets();
  const { colors, language } = useTheme();
  const t = useTranslation(language);
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={({ navigation }) => ({
        headerTitle: () => <HeaderLogo />,
        headerTitleAlign: 'center',
        headerBackground: () => <HeaderGradient />,
        headerTintColor: '#fff',
        headerTitleStyle: { color: '#fff' },
        headerShadowVisible: false,
        headerStyle: { height: insets.top + HEADER_CONTENT_HEIGHT },
        headerLeft: () => (
          <Pressable
            onPress={() => navigation.openDrawer()}
            style={{ paddingHorizontal: 16 }}
            accessibilityRole="button"
            accessibilityLabel={t.openMenu}
          >
            <Ionicons name="menu-outline" size={24} color="#fff" />
          </Pressable>
        ),
      })}
    >
      <Drawer.Screen name="Accueil"      component={HomeScreen} />
      <Drawer.Screen name="Historique"   component={HistoryScreen} />
      <Drawer.Screen name="Joueurs"      component={PlayersScreen} />
      <Drawer.Screen name="Statistiques" component={StatsScreen} />
      <Drawer.Screen name="Paramètres"   component={SettingsScreen} />
      <Drawer.Screen name="A propos"     component={AboutScreen} />
    </Drawer.Navigator>
  );
}

/* ---------------- APP INNER (needs ThemeContext) ---------------- */

function AppInner() {
  const insets = useSafeAreaInsets();
  const { isDark, colors } = useTheme();
  const [splashDone, setSplashDone] = useState(false);

  if (!splashDone) {
    return <SplashScreen onFinish={() => setSplashDone(true)} />;
  }

  const navTheme = isDark
    ? { ...DarkTheme, colors: { ...DarkTheme.colors, background: colors.background, card: colors.card, text: colors.text, border: colors.border, primary: colors.primary, notification: colors.primary } }
    : { ...DefaultTheme, colors: { ...DefaultTheme.colors, background: colors.background, card: colors.card, text: colors.text, border: colors.border, primary: colors.primary, notification: colors.primary } };

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator>

        {/* Partie Drawer */}
        <Stack.Screen
          name="Main"
          component={MainDrawer}
          options={{ headerShown: false }}
        />

        {/* Nouvelle Partie */}
        <Stack.Screen
          name="NewGame"
          component={NewGameScreen}
          options={({ navigation }: any) => ({
            title: 'Nouvelle partie',
            headerBackground: () => <HeaderGradient />,
            headerTintColor: '#fff',
            headerTitleStyle: { color: '#fff' },
            headerStyle: { height: insets.top + HEADER_CONTENT_HEIGHT, elevation: 0, shadowOpacity: 0, borderBottomWidth: 0 },
            headerLeft: () => <CustomBackButton navigation={navigation} />,
          })}
        />

        {/* Détail joueur */}
        <Stack.Screen
          name="PlayerDetail"
          component={PlayerDetailScreen}
          options={({ navigation }: any) => ({
            headerTitle: () => <HeaderLogo />,
            headerTitleAlign: 'center',
            headerBackground: () => <HeaderGradient />,
            headerTintColor: '#fff',
            headerStyle: { height: insets.top + HEADER_CONTENT_HEIGHT, elevation: 0, shadowOpacity: 0, borderBottomWidth: 0 },
            headerLeft: () => <CustomBackButton navigation={navigation} />,
          })}
        />

        {/* Scoreboard plein écran */}
        <Stack.Screen
          name="Scoreboard"
          component={ScoreboardScreen}
          options={({ navigation }: any) => ({
            title: 'Tableau des scores',
            headerBackground: () => <HeaderGradient />,
            headerTintColor: '#fff',
            headerTitleStyle: { color: '#fff' },
            headerStyle: { height: insets.top + HEADER_CONTENT_HEIGHT, elevation: 0, shadowOpacity: 0, borderBottomWidth: 0 },
            headerLeft: () => <CustomBackButton navigation={navigation} />,
          })}
        />

        {/* Lanceur de dés — paramètres */}
        <Stack.Screen
          name="DiceSetup"
          component={DiceSetupScreen}
          options={({ navigation }: any) => ({
            title: 'Lanceur de dés',
            headerBackground: () => <HeaderGradient />,
            headerTintColor: '#fff',
            headerTitleStyle: { color: '#fff' },
            headerStyle: { height: insets.top + HEADER_CONTENT_HEIGHT, elevation: 0, shadowOpacity: 0, borderBottomWidth: 0 },
            headerLeft: () => <CustomBackButton navigation={navigation} />,
          })}
        />

        {/* Lanceur de dés — jeu */}
        <Stack.Screen
          name="DiceRoller"
          component={DiceRollerScreen}
          options={({ navigation }: any) => ({
            title: 'Lancer les dés',
            headerBackground: () => <HeaderGradient />,
            headerTintColor: '#fff',
            headerTitleStyle: { color: '#fff' },
            headerStyle: { height: insets.top + HEADER_CONTENT_HEIGHT, elevation: 0, shadowOpacity: 0, borderBottomWidth: 0 },
            headerLeft: () => <CustomBackButton navigation={navigation} />,
          })}
        />

        {/* Mini-jeu — Pile ou Face */}
        <Stack.Screen
          name="CoinToss"
          component={CoinTossScreen}
          options={({ navigation }: any) => ({
            title: 'Pile ou Face',
            headerBackground: () => <HeaderGradient />,
            headerTintColor: '#fff',
            headerTitleStyle: { color: '#fff' },
            headerStyle: { height: insets.top + HEADER_CONTENT_HEIGHT, elevation: 0, shadowOpacity: 0, borderBottomWidth: 0 },
            headerLeft: () => <CustomBackButton navigation={navigation} />,
          })}
        />

        {/* Mini-jeu — Chrono & minuteur */}
        <Stack.Screen
          name="Timer"
          component={TimerScreen}
          options={({ navigation }: any) => ({
            title: 'Chrono & minuteur',
            headerBackground: () => <HeaderGradient />,
            headerTintColor: '#fff',
            headerTitleStyle: { color: '#fff' },
            headerStyle: { height: insets.top + HEADER_CONTENT_HEIGHT, elevation: 0, shadowOpacity: 0, borderBottomWidth: 0 },
            headerLeft: () => <CustomBackButton navigation={navigation} />,
          })}
        />

        {/* Mini-jeu — Roue */}
        <Stack.Screen
          name="Wheel"
          component={WheelScreen}
          options={({ navigation }: any) => ({
            title: 'Roue',
            headerBackground: () => <HeaderGradient />,
            headerTintColor: '#fff',
            headerTitleStyle: { color: '#fff' },
            headerStyle: { height: insets.top + HEADER_CONTENT_HEIGHT, elevation: 0, shadowOpacity: 0, borderBottomWidth: 0 },
            headerLeft: () => <CustomBackButton navigation={navigation} />,
          })}
        />

        {/* Mini-jeu — Buzzer */}
        <Stack.Screen
          name="Buzzer"
          component={BuzzerScreen}
          options={({ navigation }: any) => ({
            title: 'Buzzer',
            headerBackground: () => <HeaderGradient />,
            headerTintColor: '#fff',
            headerTitleStyle: { color: '#fff' },
            headerStyle: { height: insets.top + HEADER_CONTENT_HEIGHT, elevation: 0, shadowOpacity: 0, borderBottomWidth: 0 },
            headerLeft: () => <CustomBackButton navigation={navigation} />,
          })}
        />

        {/* Contact */}
        <Stack.Screen
          name="Support"
          component={SupportScreen}
          options={({ navigation }: any) => ({
            title: 'Contact',
            headerBackground: () => <HeaderGradient />,
            headerTintColor: '#fff',
            headerTitleStyle: { color: '#fff' },
            headerStyle: { height: insets.top + HEADER_CONTENT_HEIGHT, elevation: 0, shadowOpacity: 0, borderBottomWidth: 0 },
            headerLeft: () => <CustomBackButton navigation={navigation} />,
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

/* ---------------- APP ROOT ---------------- */

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppInner />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
