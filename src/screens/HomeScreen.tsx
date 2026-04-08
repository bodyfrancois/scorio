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
import { useTheme } from '../theme/ThemeContext';
import { useTranslation } from '../i18n';
import { getAvailableGames } from '../core/gameEngine';
import { RootStackParamList } from '../types/navigations';
import { lightColors } from '../theme/colors';
import { makeSharedStyles } from '../theme/styles';
import { IllustrationCartes } from './HistoryScreen';

const makeStyles = (c: typeof lightColors) => ({
  ...makeSharedStyles(c),
  ...StyleSheet.create({
    searchWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: c.searchBackground,
      borderRadius: 16,
      paddingHorizontal: 12,
      paddingVertical: 10,
      gap: 8,
      marginBottom: 28,
      height: 50,
    },
    searchInput: {
      flex: 1,
      fontSize: 15,
      color: c.text,
      padding: 0,
    },
    cardPressed: {
      opacity: 0.85,
    },
    gameImage: {
      width: 72,
      height: 72,
      borderRadius: 12,
      marginRight: 14,
      borderWidth: 1,
      borderColor: c.border,
    },
    cardContent: {
      flex: 1,
    },
    gameTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: c.text,
      marginBottom: 6,
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    infoText: {
      fontSize: 13,
      color: c.textSecondary,
    },
    bullet: {
      fontSize: 13,
      color: c.iconMuted,
    },
    noResult: {
      textAlign: 'center',
      marginTop: 32,
      color: c.textMuted,
      fontSize: 14,
    },
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
      backgroundColor: c.primaryLight,
      alignItems: 'center',
      justifyContent: 'center',
    },
    footerLogoLetter: {
      color: c.card,
      fontWeight: '800',
      fontSize: 14,
    },
    footerLogoText: {
      fontSize: 15,
      fontWeight: '700',
      color: c.textMuted,
    },
    footerTagline: {
      fontSize: 12,
      color: c.textMuted,
      textAlign: 'center',
      lineHeight: 18,
    },
    footerLink: {
      fontSize: 12,
      color: c.textMuted,
      textDecorationLine: 'underline',
    },
  }),
});

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { colors, language } = useTheme();
  const t = useTranslation(language);
  const styles = useMemo(() => makeStyles(colors), [colors]);

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
          <Text style={styles.noResult}>{t.noResult}</Text>
        </View>
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
          {game.image && (
            <Image
              source={game.image}
              style={styles.gameImage}
              resizeMode="cover"
            />
          )}

          <View style={styles.cardContent}>
            <Text style={styles.gameTitle}>{game.name}</Text>

            <View style={styles.infoRow}>
              <Ionicons name="people-outline" size={13} color={colors.textSecondary} />
              <Text style={styles.infoText}>
                {game.minPlayers === game.maxPlayers
                  ? game.minPlayers
                  : `${game.minPlayers}-${game.maxPlayers}`}
              </Text>

              {game.estimatedDuration && (
                <>
                  <Text style={styles.bullet}>·</Text>
                  <Ionicons name="time-outline" size={13} color={colors.textSecondary} />
                  <Text style={styles.infoText}>
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
