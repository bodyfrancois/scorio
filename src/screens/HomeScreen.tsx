import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  TextInput,
  Image,
} from 'react-native';

import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { useTranslation } from '../i18n';
import { getAvailableGames } from '../core/gameEngine';
import { RootStackParamList } from '../types/navigations';
import { makeHomeStyles } from '../theme/styles';
import { IllustrationCartes } from './HistoryScreen';

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { colors, language } = useTheme();
  const t = useTranslation(language);
  const styles = useMemo(() => makeHomeStyles(colors), [colors]);

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
          placeholder={t.searchPlaceholder}
          placeholderTextColor={colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Section label */}
      <Text style={styles.sectionLabel}>{t.gameList}</Text>

      {/* Liste des jeux — état vide */}
      {filteredGames.length === 0 && (
        <View style={{ alignItems: 'center', marginTop: 32 }}>
          <IllustrationCartes colors={colors} />
          <Text style={styles.muted}>{t.noResult}</Text>
        </View>
      )}

      {filteredGames.map((game) => (
        <Pressable
          key={game.name}
          style={({ pressed }) => [
            [styles.card, styles.cardRow],
            pressed && styles.cardPressed,
          ]}
          onPress={() => handleStartGame(game.name)}
        >
          {game.image && (
            <Image
              source={game.image}
              style={styles.gameImage}
              resizeMode="cover"
            />
          )}

          <View style={styles.cardContent}>
            <Text style={[styles.itemTitle, { marginBottom: 6 }]}>{game.name}</Text>

            <View style={styles.gameInfoRow}>
              <Ionicons name="people-outline" size={13} color={colors.textSecondary} />
              <Text style={styles.caption}>
                {game.minPlayers === game.maxPlayers
                  ? game.minPlayers
                  : `${game.minPlayers}-${game.maxPlayers}`}
              </Text>

              {game.estimatedDuration && (
                <>
                  <Text style={styles.muted}>·</Text>
                  <Ionicons name="time-outline" size={13} color={colors.textSecondary} />
                  <Text style={styles.caption}>
                    {game.estimatedDuration} min
                  </Text>
                </>
              )}
            </View>
          </View>

          <View style={[styles.btnPrimary]}>
            <Text style={styles.btnPrimaryTextSmall}>{t.play}</Text>
          </View>
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

        <Text style={styles.footerTagline}>{t.freeApp}</Text>

        <Pressable>
          <Text style={styles.footerLink}>{t.supportMe}</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
