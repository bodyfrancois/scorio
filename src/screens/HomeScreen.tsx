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

import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { getAvailableGames } from '../core/gameEngine';
import { RootStackParamList } from '../types/navigations';

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const games = getAvailableGames();

  const [searchQuery, setSearchQuery] = useState('');

  const filteredGames = useMemo(() => {
    return games.filter((game) =>
      game.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, games]);

  const handleStartGame = (gameName: string) => {
    navigation.navigate('NewGame', { gameName });
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Barre de recherche */}
      <View style={styles.searchWrapper}>
        <Ionicons name="search-outline" size={18} color={colors.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher un jeu..."
          placeholderTextColor={colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Section label */}
      <Text style={styles.sectionLabel}>LISTE DE JEUX</Text>

      {/* Liste des jeux */}
      {filteredGames.length === 0 && (
        <Text style={styles.noResult}>Aucun jeu trouvé</Text>
      )}

      {filteredGames.map((game) => (
        <Pressable
          key={game.name}
          style={({ pressed }) => [
            styles.card,
            pressed && styles.cardPressed,
          ]}
          onPress={() => handleStartGame(game.name)}
        >
          {/* Image */}
          {game.image && (
            <Image
              source={game.image}
              style={styles.gameImage}
              resizeMode="cover"
            />
          )}

          {/* Contenu */}
          <View style={styles.cardContent}>
            <Text style={styles.gameTitle}>{game.name}</Text>

            <View style={styles.infoRow}>
              <Ionicons name="people-outline" size={13} color={colors.textMuted} />
              <Text style={styles.infoText}>
                {game.minPlayers === game.maxPlayers
                  ? game.minPlayers
                  : `${game.minPlayers}-${game.maxPlayers}`}
              </Text>

              {game.estimatedDuration && (
                <>
                  <Text style={styles.bullet}>·</Text>
                  <Ionicons name="time-outline" size={13} color={colors.textMuted} />
                  <Text style={styles.infoText}>
                    {game.estimatedDuration} min
                  </Text>
                </>
              )}
            </View>
          </View>

          {/* Chevron */}
          <Ionicons name="chevron-forward" size={18} color={colors.iconMuted} />
        </Pressable>
      ))}

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerLogo}>
          <View style={styles.footerLogoIcon}>
            <Text style={styles.footerLogoLetter}>S</Text>
          </View>
          <Text style={styles.footerLogoText}>Scorio</Text>
        </View>

        <Text style={styles.footerTagline}>
          Scorio est une application gratuite et sans pub.{'\n'}
          Si vous aimez cette application
        </Text>

        <Pressable>
          <Text style={styles.footerLink}>Soutenez moi</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 48,
  },

  /* Recherche */
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.searchBackground,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    marginBottom: 28,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
    padding: 0,
  },

  /* Section */
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 1,
    marginBottom: 12,
  },
  /* Carte jeu */
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
  },
  cardPressed: {
    opacity: 0.85,
  },
  gameImage: {
    width: 64,
    height: 64,
    borderRadius: 12,
    marginRight: 14,
  },
  cardContent: {
    flex: 1,
  },
  gameTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    fontSize: 13,
    color: colors.textMuted,
  },
  bullet: {
    fontSize: 13,
    color: colors.iconMuted,
  },

  noResult: {
    textAlign: 'center',
    marginTop: 32,
    color: colors.textMuted,
    fontSize: 14,
  },

  /* Footer */
  footer: {
    marginTop: 40,
    alignItems: 'center',
    gap: 8,
  },
  footerLogo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  footerLogoIcon: {
    width: 26,
    height: 26,
    borderRadius: 6,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerLogoLetter: {
    color: colors.card,
    fontWeight: '800',
    fontSize: 14,
  },
  footerLogoText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textMuted,
  },
  footerTagline: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
  footerLink: {
    fontSize: 12,
    color: colors.textMuted,
    textDecorationLine: 'underline',
  },
});
