import 'react-native-gesture-handler';
import 'react-native-get-random-values';

import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import SplashScreen from './src/screens/SplashScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import { colors } from './src/theme/colors';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from './src/screens/HomeScreen';
import NewGameScreen from './src/screens/NewGameScreen';
import ScoreboardScreen from './src/screens/ScoreboardScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import AboutScreen from './src/screens/AboutScreen';
import CustomDrawer from './src/components/CustomDrawer';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

/* ---------------- FLÈCHE CUSTOM ---------------- */

function CustomBackButton({ navigation }: any) {
  return (
    <Pressable onPress={() => navigation.goBack()}>
      <Ionicons name="chevron-back" size={26} color={colors.text} />
    </Pressable>
  );
}

/* ---------------- LOGO HEADER ---------------- */

function HeaderLogo() {
  return (
    <View style={logoStyles.row}>
      <View style={logoStyles.iconBox}>
        <Text style={logoStyles.iconLetter}>S</Text>
      </View>
      <Text style={logoStyles.label}>Scorio</Text>
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
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLetter: {
    color: colors.card,
    fontWeight: '800',
    fontSize: 16,
  },
  label: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
});

/* ---------------- DRAWER ---------------- */

function MainDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={({ navigation }) => ({
        headerTitle: () => <HeaderLogo />,
        headerTitleAlign: 'center',
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

/* ---------------- APP ROOT ---------------- */

export default function App() {
  const [splashDone, setSplashDone] = useState(false);

  if (!splashDone) {
    return <SplashScreen onFinish={() => setSplashDone(true)} />;
  }

  return (
    <NavigationContainer>
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
