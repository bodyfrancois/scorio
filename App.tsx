import 'react-native-gesture-handler';
import 'react-native-get-random-values';

import React, { useState } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import SplashScreen from './src/screens/SplashScreen';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

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
import HistoryScreen from './src/screens/HistoryScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import AboutScreen from './src/screens/AboutScreen';
import CustomDrawer from './src/components/CustomDrawer';
import { ThemeProvider, useTheme } from './src/theme/ThemeContext';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

/* ---------------- FLÈCHE CUSTOM ---------------- */

function CustomBackButton({ navigation }: any) {
  return (
    <Pressable
      onPress={() => navigation.goBack()}
      style={{ marginLeft: 16, width: 34, height: 34, borderRadius: 100, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' }}
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
      <Text style={[logoStyles.label, { color: '#fff' }]}>Scorio</Text>
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
  const { colors } = useTheme();
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
        headerStyle: { height: 110 },
        headerTitleContainerStyle: { paddingBottom: 20, paddingTop: 20  },
        headerLeftContainerStyle: { paddingBottom: 20, paddingTop: 20  },
        headerRightContainerStyle: { paddingBottom: 20, paddingTop: 20  },
        headerLeft: () => (
          <Pressable
            onPress={() => navigation.openDrawer()}
            style={{ paddingHorizontal: 16 }}
          >
            <Ionicons name="menu-outline" size={24} color="#fff" />
          </Pressable>
        ),
      })}
    >
      <Drawer.Screen name="Accueil"    component={HomeScreen} />
      <Drawer.Screen name="Historique" component={HistoryScreen} />
      <Drawer.Screen name="Paramètres" component={SettingsScreen} />
      <Drawer.Screen name="A propos"   component={AboutScreen} />
    </Drawer.Navigator>
  );
}

/* ---------------- APP INNER (needs ThemeContext) ---------------- */

function AppInner() {
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
            headerStyle: { height: 110, elevation: 0, shadowOpacity: 0, borderBottomWidth: 0 },
            headerTitleContainerStyle: { paddingBottom: 20, paddingTop: 20 },
            headerRightContainerStyle: { paddingBottom: 20, paddingTop: 20 },
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
            headerStyle: { height: 110, elevation: 0, shadowOpacity: 0, borderBottomWidth: 0 },
            headerTitleContainerStyle: { paddingBottom: 20, paddingTop: 20 },
            headerRightContainerStyle: { paddingBottom: 20, paddingTop: 20 },
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
    <ThemeProvider>
      <AppInner />
    </ThemeProvider>
  );
}
