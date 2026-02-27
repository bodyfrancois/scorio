import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TextInput,
  Image,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { getAvailableGames } from '../core/gameEngine';

/**
 * HomeScreen
 *
 * Affiche :
 * - Le titre de l’application
 * - Une barre de recherche
 * - La liste dynamique des jeux
 *
 * Chaque jeu provient du moteur central (core/gameEngine)
 * → Aucun jeu n’est hardcodé ici
 */
export default function HomeScreen() {
  const navigation = useNavigation();

  // Récupération dynamique des jeux disponibles
  const games = getAvailableGames();

  // État de la recherche
  const [searchQuery, setSearchQuery] = useState('');

  /**
   * Filtrage dynamique des jeux
   * - Insensible à la casse
   * - Optimisé avec useMemo
   */
  const filteredGames = useMemo(() => {
    return games.filter((game) =>
      game.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, games]);

  /**
   * Navigation vers l'écran NewGame
   */
  const handleStartGame = (gameName: string) => {
    navigation.navigate(
      'NewGame' as never,
      { gameName } as never
    );
  };

  return (
    <View style={styles.container}>
      {/* Titre */}

      {/* Barre de recherche */}
      <TextInput
        style={styles.searchInput}
        placeholder="Rechercher un jeu..."
        placeholderTextColor="#9CA3AF"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* Liste des jeux */}
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {filteredGames.length === 0 && (
          <Text style={styles.noResult}>
            Aucun jeu trouvé
          </Text>
        )}

        {filteredGames.map((game) => (
          <Pressable
            key={game.name}
            style={styles.card}
            onPress={() =>
              handleStartGame(game.name)
            }
          >
            <View style={styles.cardRow}>

              {/* Image 70x70 */}
              {game.image && (
                <Image
                  source={game.image}
                  style={styles.gameImage}
                  resizeMode="cover"
                />
              )}

              {/* Contenu texte */}
              <View style={styles.cardContent}>
                {/* Nom du jeu */}
                <Text style={styles.gameTitle}>
                  {game.name}
                </Text>

                {/* Ligne infos */}
                <View style={styles.infoRow}>

                  {/* Nombre de joueurs */}
                  <View style={styles.infoBlock}>
                    <Ionicons
                      name="people-outline"
                      size={16}
                      color="#6B7280"
                    />
                    <Text style={styles.infoText}>
                      {game.minPlayers} - {game.maxPlayers}
                    </Text>
                  </View>

                  {/* Durée estimée */}
                  {game.estimatedDuration && (
                    <View style={styles.infoBlock}>
                      <Ionicons
                        name="time-outline"
                        size={16}
                        color="#6B7280"
                      />
                      <Text style={styles.infoText}>
                        {game.estimatedDuration} min
                      </Text>
                    </View>
                  )}
                </View>
                
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  searchInput: {
    backgroundColor: 'white',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 20,
    fontSize: 16,
  },
  scrollContainer: {
    paddingBottom: 40,
  },
  card: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gameImage: {
    width: 70,
    height: 70,
    borderRadius: 12,
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  gameTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  infoRow: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 16,
  },
  infoBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#6B7280',
  },
  description: {
    marginTop: 8,
    fontSize: 13,
    color: '#6B7280',
  },
  noResult: {
    textAlign: 'center',
    marginTop: 20,
    color: '#6B7280',
  },
});