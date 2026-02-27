import 'react-native-gesture-handler';
import 'react-native-get-random-values';

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Pressable, Text } from 'react-native';

import HomeScreen from './src/screens/HomeScreen';
import NewGameScreen from './src/screens/NewGameScreen';
import ScoreboardScreen from './src/screens/ScoreboardScreen';
import HistoryScreen from './src/screens/HistoryScreen';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

/* ---------------- FLÈCHE CUSTOM ---------------- */

function CustomBackButton({ navigation }: any) {
  return (
    <Pressable
      onPress={() => navigation.goBack()}
      style={{ paddingHorizontal: 10 }}
    >
      <Text style={{ fontSize: 22 }}>‹</Text>
    </Pressable>
  );
}

/* ---------------- DRAWER ---------------- */

function MainDrawer() {
  return (
    <Drawer.Navigator>
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
            title: route?.params?.gameName
              ? `Nouvelle partie – ${route.params.gameName}`
              : 'Nouvelle partie',

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