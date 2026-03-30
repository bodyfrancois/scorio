import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../theme/ThemeContext';

interface Props {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: Props) {
  const { colors } = useTheme();

  const opacity = new Animated.Value(0);
  const scale = new Animated.Value(0.85);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start(() => onFinish());
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient
      colors={['#5B2D9E', '#7B3FBE', '#A855F7', '#EC4899', '#F97316']}
      locations={[0, 0.25, 0.55, 0.80, 1]}
      start={{ x: 0.15, y: 0 }}
      end={{ x: 0.85, y: 1 }}
      style={styles.container}
    >
      <Animated.View style={[styles.content, { opacity, transform: [{ scale }] }]}>
        <View style={styles.row}>
          <View style={[styles.iconBox, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
            <Text style={[styles.iconLetter, { color: colors.white }]}>S</Text>
          </View>
          <Text style={[styles.appName, { color: colors.white }]}>Scorio</Text>
        </View>
      </Animated.View>

      <Animated.Text style={[styles.credit, { opacity, color: colors.textOnDark }]}>
        by @MisterBuddy
      </Animated.Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
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
