import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  Animated,
  Dimensions,
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { useTranslation } from '../i18n';
import { makeNewGameStyles } from '../theme/styles';
import { RootStackParamList } from '../types/navigations';
import { DiceType } from '../components/DiceShape';
import DiceShape from '../components/DiceShape';

type DiceRollerRoute = RouteProp<RootStackParamList, 'DiceRoller'>;

const DICE_COLORS: Record<DiceType, string> = {
  D4:  '#6B46C1',
  D6:  '#6B46C1',
  D8:  '#6B46C1',
  D10: '#6B46C1',
  D12: '#6B46C1',
  D20: '#6B46C1',
};

const SCREEN_W = Dimensions.get('window').width;

function rollValue(type: DiceType): number {
  return Math.floor(Math.random() * parseInt(type.slice(1), 10)) + 1;
}

function getDiceSize(count: number): number {
  if (count === 1) return 150;
  if (count === 2) return 128;
  return 108;
}

// ── Single die ────────────────────────────────────────────────────────────────

interface SingleDiceProps {
  type: DiceType;
  value: number | null;
  size: number;
  color: string;
  onPress: () => void;
  rollHint: string;
}

function SingleDice({ type, value, size, color, onPress, rollHint }: SingleDiceProps) {
  const [display, setDisplay] = useState<number | null>(value);
  const prevRef = useRef<number | null>(value);

  const rotAnim   = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const shake = useCallback(() => {
    rotAnim.setValue(0);
    scaleAnim.setValue(1);
    Animated.parallel([
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 1.18, duration: 110, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 0.94, duration: 80,  useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 1.06, duration: 80,  useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 1,    duration: 100, useNativeDriver: true }),
      ]),
      Animated.sequence([
        Animated.timing(rotAnim, { toValue:  1,   duration: 90,  useNativeDriver: true }),
        Animated.timing(rotAnim, { toValue: -1,   duration: 90,  useNativeDriver: true }),
        Animated.timing(rotAnim, { toValue:  0.5, duration: 80,  useNativeDriver: true }),
        Animated.timing(rotAnim, { toValue:  0,   duration: 110, useNativeDriver: true }),
      ]),
    ]).start();
  }, [rotAnim, scaleAnim]);

  // Animate whenever value changes from outside (roll all)
  useEffect(() => {
    if (value !== prevRef.current) {
      prevRef.current = value;
      if (value !== null) {
        shake();
        const t = setTimeout(() => setDisplay(value), 150);
        return () => clearTimeout(t);
      } else {
        setDisplay(null);
      }
    }
  }, [value, shake]);

  const rotation = rotAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-22deg', '0deg', '22deg'],
  });

  return (
    <Pressable
      onPress={onPress}
      style={{ padding: 6 }}
      accessibilityRole="button"
      accessibilityLabel={`${type}${value !== null ? ` : ${value}` : ''}`}
      accessibilityHint={rollHint}
    >
      {({ pressed }) => (
        <Animated.View
          style={{
            transform: [
              { rotate: rotation },
              { scale: pressed ? 0.91 : scaleAnim },
            ],
          }}
        >
          <DiceShape type={type} value={display} size={size} color={color} textColor="#FFFFFF" />
        </Animated.View>
      )}
    </Pressable>
  );
}

// ── Screen ────────────────────────────────────────────────────────────────────

export default function DiceRollerScreen() {
  const route = useRoute<DiceRollerRoute>();
  const { diceCount, diceType } = route.params;
  const { colors, language } = useTheme();
  const t = useTranslation(language);
  const styles = useMemo(() => makeNewGameStyles(colors), [colors]);

  const [values, setValues] = useState<(number | null)[]>(Array(diceCount).fill(null));

  const color = DICE_COLORS[diceType];
  const size  = getDiceSize(diceCount);

  const allRolled = values.every(v => v !== null);
  const anyRolled = values.some(v => v !== null);
  const total = useMemo(() => {
    if (diceCount <= 1) return null;
    if (!anyRolled) return null;
    return values.reduce<number>((a, b) => a + (b ?? 0), 0);
  }, [values, diceCount, anyRolled]);

  const rollSingle = useCallback((i: number) => {
    setValues(prev => {
      const next = [...prev];
      next[i] = rollValue(diceType);
      return next;
    });
  }, [diceType]);

  const rollAll = useCallback(() => {
    setValues(Array.from({ length: diceCount }, () => rollValue(diceType)));
  }, [diceCount, diceType]);

  const gridStyle = useMemo(() => ({
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    gap: diceCount > 2 ? 8 : 12,
    maxWidth: SCREEN_W - 40,
  }), [diceCount]);

  return (
    <View style={[styles.container, { flex: 1 }]}>

      {/* Info chips */}
      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 10, paddingTop: 14, paddingHorizontal: 20 }}>
        <View style={[chipStyle(colors), { borderColor: color + '55', backgroundColor: color + '18' }]}>
          <Text style={[styles.muted, { color, fontWeight: '700' }]}>{diceType}</Text>
        </View>
        <View style={chipStyle(colors)}>
          <Ionicons name="dice-outline" size={13} color={colors.textSecondary} />
          <Text style={styles.muted}>{diceCount} dé{diceCount > 1 ? 's' : ''}</Text>
        </View>
      </View>

      {/* Dice grid — centré verticalement */}
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 }}>
        <View style={gridStyle}>
          {values.map((val, i) => (
            <SingleDice
              key={i}
              type={diceType}
              value={val}
              size={size}
              color={color}
              onPress={() => rollSingle(i)}
              rollHint={t.rollSingle}
            />
          ))}
        </View>

        {/* Hint (avant le premier lancer) */}
          <Text style={[styles.muted, { marginTop: 20, fontStyle: 'italic' }]}>
            {t.diceHint}
          </Text>

        {/* Total (multi-dés, toujours affiché) */}
        {diceCount > 1 && (
          <View style={[styles.card, { marginTop: 24, paddingHorizontal: 40, alignItems: 'center', marginBottom: 0 }]}>
            <Text style={styles.sectionLabel}>TOTAL</Text>
            <Text style={[styles.itemTitle, { fontSize: 38, fontWeight: '900', color: total !== null ? color : colors.textSecondary }]}>
              {total !== null ? total : '—'}
            </Text>
          </View>
        )}
      </View>

      {/* Footer — bouton lancer */}
      <View style={{ paddingHorizontal: 20, paddingBottom: 32, paddingTop: 12 }}>
        <Pressable accessibilityRole="button"
          style={({ pressed }) => [
            styles.btnPrimary,
            styles.btnPrimaryBig,
            styles.startButtonLayout,
            pressed && styles.pressed,
          ]}
          onPress={rollAll}
        >
          <Text style={styles.btnPrimaryText}>
            {diceCount === 1 ? 'Lancer le dé' : 'Lancer tous les dés'}
          </Text>
        </Pressable>
      </View>

    </View>
  );
}

function chipStyle(colors: any) {
  return {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  };
}
