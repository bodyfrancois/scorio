import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../theme/ThemeContext';

interface Props {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: Props) {
  const { colors } = useTheme();

  // Stable refs — ne se réinitialisent pas entre les renders
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // On est déjà visible dès le montage (opacity: 1).
    // iOS a géré la transition depuis l'icône → pas de zoom supplémentaire.
    // Après le délai, simple fondu sortant.
    const timer = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true,
      }).start(() => onFinish());
    }, 1600);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View style={[styles.wrapper, { opacity }]}>
      <LinearGradient
        colors={['#5B2D9E', '#7B3FBE', '#A855F7', '#EC4899', '#F97316']}
        locations={[0, 0.25, 0.55, 0.80, 1]}
        start={{ x: 0.15, y: 0 }}
        end={{ x: 0.85, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.content}>
        <View style={styles.row}>
          <View style={[styles.iconBox, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
            <Text style={[styles.iconLetter, { color: colors.white }]}>S</Text>
          </View>
          <Text style={[styles.appName, { color: colors.white }]}>Scorio</Text>
        </View>
      </View>

      <Text style={[styles.credit, { color: colors.textOnDark }]}>
        by @MisterBuddy
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconBox: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLetter: {
    fontWeight: '800',
    fontSize: 34,
  },
  appName: {
    fontSize: 42,
    fontWeight: '800',
    letterSpacing: -1,
  },
  credit: {
    position: 'absolute',
    bottom: 48,
    fontSize: 13,
    letterSpacing: 0.3,
  },
});
