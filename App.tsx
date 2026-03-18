import 'react-native-gesture-handler';
import 'react-native-get-random-values';

import React, { useState } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import SplashScreen from './src/screens/SplashScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from './src/screens/HomeScreen';
import NewGameScreen from './src/screens/NewGameScreen';
import ScoreboardScreen from './src/screens/ScoreboardScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import AboutScreen from './src/screens/AboutScreen';
import CustomDrawer from './src/components/CustomDrawer';
import { ThemeProvider, useTheme } from './src/theme/ThemeContext';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

/* ---------------- FLÈCHE CUSTOM ---------------- */

function CustomBackButton({ navigation }: any) {
  const { colors } = useTheme();
  return (
    <Pressable onPress={() => navigation.goBack()}>
      <Ionicons name="chevron-back" size={26} color={colors.text} />
    </Pressable>
  );
}

/* ---------------- LOGO HEADER ---------------- */

function HeaderLogo() {
  const { colors } = useTheme();
  return (
    <View style={logoStyles.row}>
      <View style={[logoStyles.iconBox, { backgroundColor: colors.primary }]}>
        <Text style={[logoStyles.iconLetter, { color: colors.white }]}>S</Text>
      </View>
      <Text style={[logoStyles.label, { color: colors.text }]}>Scorio</Text>
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
        headerStyle: { backgroundColor: colors.card },
        headerShadowVisible: false,
        headerLeft: () => (
          <Pressable
            onPress={() => navigation.openDrawer()}
            style={{ paddingHorizontal: 16 }}
          >
            <Ionicons name="menu-outline" size={24} color={colors.text} />
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
          options={({ navigation }) => ({
            title: 'Nouvelle partie',
            headerBackVisible: false,
            headerLeft: () => <CustomBackButton navigation={navigation} />,
          })}
        />

        {/* Scoreboard plein écran */}
        <Stack.Screen
          name="Scoreboard"
          component={ScoreboardScreen}
          options={({ navigation }) => ({
            title: 'Tableau des scores',
            headerBackVisible: false,
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
