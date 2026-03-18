import 'react-native-gesture-handler';
import 'react-native-get-random-values';

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import { colors } from './src/theme/colors';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from './src/screens/HomeScreen';
import NewGameScreen from './src/screens/NewGameScreen';
import ScoreboardScreen from './src/screens/ScoreboardScreen';
import HistoryScreen from './src/screens/HistoryScreen';

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
      <Drawer.Screen
        name="Accueil"
        component={HomeScreen}
      />
      <Drawer.Screen
        name="Historique"
        component={HistoryScreen}
      />
    </Drawer.Navigator>
  );
}

/* ---------------- APP ROOT ---------------- */

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>

        {/* Partie Drawer */}
        <Stack.Screen
          name="Main"
          component={MainDrawer}
          options={{
            headerShown: false,
          }}
        />

        {/* Nouvelle Partie */}
        <Stack.Screen
          name="NewGame"
          component={NewGameScreen}
          options={({ route, navigation }) => ({
            title: 'Nouvelle partie',

            headerBackVisible: false, // ❌ supprime le back natif
            headerLeft: () => (
              <CustomBackButton navigation={navigation} />
            ),
          })}
        />

        {/* Scoreboard plein écran */}
        <Stack.Screen
          name="Scoreboard"
          component={ScoreboardScreen}
          options={({ navigation }) => ({
            title: 'Tableau des scores',
            headerBackVisible: false, // supprime le back natif
            headerLeft: () => (
              <CustomBackButton navigation={navigation} />
            ),
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}