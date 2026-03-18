import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { colors } from '../theme/colors';

interface Props {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: Props) {
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
    <View style={styles.container}>
      <Animated.View style={[styles.content, { opacity, transform: [{ scale }] }]}>
        <View style={styles.row}>
          <View style={styles.iconBox}>
            <Text style={styles.iconLetter}>S</Text>
          </View>
          <Text style={styles.appName}>Scorio</Text>
        </View>
      </Animated.View>

      <Animated.Text style={[styles.credit, { opacity }]}>
        by @MisterBuddy
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.splashBg,
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
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLetter: {
    color: colors.white,
    fontWeight: '800',
    fontSize: 34,
  },
  appName: {
    fontSize: 42,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -1,
  },
  credit: {
    position: 'absolute',
    bottom: 48,
    fontSize: 13,
    color: colors.textOnDark,
    letterSpacing: 0.3,
  },
});
