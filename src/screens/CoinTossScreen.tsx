import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, Pressable, Animated, Easing, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { useTheme } from '../theme/ThemeContext';
import { useTranslation } from '../i18n';
import CoinDisc from '../components/CoinDisc';
import { fontSize as FS, fontWeight as FW, letterSpacing as LS, radius as R, spacing as S } from '../theme/tokens';

type CoinSide = 'heads' | 'tails';

const COIN = 190;
const FLIP_MS = 1500;
/** Tours complets avant l'arrêt — assez pour brouiller le résultat à l'œil. */
const FULL_TURNS = 5;

/** Le côté visible dépend de la rotation : 0° montre face, 180° montre pile. */
const ANGLE_FOR_SIDE: Record<CoinSide, number> = { heads: 0, tails: 180 };

const COIN_INK = '#B5730F';

/**
 * La rotation est simulée par un écrasement vertical (`scaleY`), pas par un
 * `rotateX` 3D : sur iOS, une vue en transformation 3D avec `backfaceVisibility`
 * ne projette pas correctement un contenu SVG — la moitié de la pièce était
 * rognée en plein tour. Ici, aucune 3D n'est en jeu.
 *
 * `scaleY` suit une onde triangulaire : 1 à plat, 0 sur la tranche. Les deux
 * faces sont superposées et leur opacité bascule pile au moment où la pièce est
 * sur la tranche (scaleY = 0), donc le changement de face est invisible.
 *
 * Les paliers sont pré-calculés jusqu'à MAX_DEG. La rotation est ramenée modulo
 * 360° à la fin de chaque lancer, ce qui garantit de rester sous ce plafond.
 */
const MAX_DEG = 3600;

const SCALE_INPUT: number[] = [];
const SCALE_OUTPUT: number[] = [];
for (let angle = 0; angle <= MAX_DEG; angle += 90) {
  SCALE_INPUT.push(angle);
  SCALE_OUTPUT.push((angle / 90) % 2 === 0 ? 1 : 0);
}

const FACE_INPUT: number[] = [0];
const FRONT_OPACITY: number[] = [1];
for (let edge = 90; edge <= MAX_DEG; edge += 180) {
  const current = FRONT_OPACITY[FRONT_OPACITY.length - 1];
  FACE_INPUT.push(edge - 0.1, edge + 0.1);
  FRONT_OPACITY.push(current, current === 1 ? 0 : 1);
}
FACE_INPUT.push(MAX_DEG);
FRONT_OPACITY.push(FRONT_OPACITY[FRONT_OPACITY.length - 1]);
const BACK_OPACITY = FRONT_OPACITY.map((value) => 1 - value);

export default function CoinTossScreen() {
  const navigation = useNavigation();
  const { colors, language } = useTheme();
  const t = useTranslation(language);
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const [result, setResult] = useState<CoinSide | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);

  /**
   * Rotation cumulée en degrés. On ne remet jamais à zéro : chaque lancer
   * ajoute des tours à la valeur courante, ce qui évite un retour brutal à 0
   * entre deux lancers.
   */
  const rotation = useRef(new Animated.Value(0)).current;
  const totalDegrees = useRef(0);

  useEffect(() => {
    navigation.setOptions({ headerTitle: t.coinToss });
  }, [navigation, t.coinToss]);

  const flip = () => {
    if (isFlipping) return;

    const outcome: CoinSide = Math.random() < 0.5 ? 'heads' : 'tails';

    // Angle à ajouter pour s'arrêter sur la bonne face, en partant de
    // l'orientation actuelle, plus les tours complets.
    const currentAngle = totalDegrees.current % 360;
    const delta = (ANGLE_FOR_SIDE[outcome] - currentAngle + 360) % 360;
    totalDegrees.current += FULL_TURNS * 360 + delta;

    setResult(outcome);
    setIsFlipping(true);

    Animated.timing(rotation, {
      toValue: totalDegrees.current,
      duration: FLIP_MS,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (!finished) return;
      // Ramène la rotation sous MAX_DEG sans changer la face visible.
      totalDegrees.current %= 360;
      rotation.setValue(totalDegrees.current);
      setIsFlipping(false);
    });
  };

  const scaleY = rotation.interpolate({
    inputRange: SCALE_INPUT,
    outputRange: SCALE_OUTPUT,
    extrapolate: 'clamp',
  });
  const frontOpacity = rotation.interpolate({
    inputRange: FACE_INPUT,
    outputRange: FRONT_OPACITY,
    extrapolate: 'clamp',
  });
  const backOpacity = rotation.interpolate({
    inputRange: FACE_INPUT,
    outputRange: BACK_OPACITY,
    extrapolate: 'clamp',
  });

  const resultLabel = result === 'heads' ? t.coinHeads : t.coinTails;

  return (
    <View style={styles.container}>
      <View style={styles.coinArea}>
        <Animated.View
          style={[styles.coinFace, { opacity: frontOpacity, transform: [{ scaleY }] }]}
        >
          <CoinFace label={t.coinHeads} />
        </Animated.View>

        <Animated.View
          style={[styles.coinFace, { opacity: backOpacity, transform: [{ scaleY }] }]}
        >
          <CoinFace label={t.coinTails} />
        </Animated.View>
      </View>

      <View style={styles.resultZone} accessibilityLiveRegion="polite">
        {result && !isFlipping ? (
          <Text style={styles.resultText}>{resultLabel}</Text>
        ) : (
          <Text style={styles.resultHint}>{isFlipping ? t.coinFlipping : t.coinIdleHint}</Text>
        )}
      </View>

      <Pressable
        onPress={flip}
        disabled={isFlipping}
        accessibilityRole="button"
        accessibilityLabel={t.coinFlipButton}
        accessibilityState={{ disabled: isFlipping }}
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
          isFlipping && styles.buttonDisabled,
        ]}
      >
        <Text style={styles.buttonText}>{t.coinFlipButton}</Text>
      </Pressable>
    </View>
  );
}

/** Une face de la pièce : le disque doré, surmonté du mot du côté. */
function CoinFace({ label }: { label: string }) {
  return (
    <View style={faceStyles.face}>
      <CoinDisc size={COIN} />
      <View style={faceStyles.labelLayer} pointerEvents="none">
        <Text style={faceStyles.label} numberOfLines={1} adjustsFontSizeToFit>
          {label}
        </Text>
      </View>
    </View>
  );
}

const faceStyles = StyleSheet.create({
  face: {
    width: COIN,
    height: COIN,
  },
  labelLayer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: S.xl,
  },
  label: {
    fontSize: FS['2xl'],
    fontWeight: FW.extrabold,
    letterSpacing: LS.widest,
    textTransform: 'uppercase',
    color: COIN_INK,
  },
});

function makeStyles(c: ReturnType<typeof useTheme>['colors']) {
  return StyleSheet.create({
    /**
     * Bloc centré : pièce, puis 32 pt jusqu'au résultat, puis 64 pt jusqu'au
     * bouton. Le bouton suit le contenu au lieu d'être collé au bas de l'écran.
     */
    container: {
      flex: 1,
      backgroundColor: c.background,
      paddingHorizontal: S.lg,
      alignItems: 'center',
      justifyContent: 'center',
    },
    coinArea: {
      width: COIN,
      height: COIN,
      alignItems: 'center',
      justifyContent: 'center',
    },
    coinFace: {
      position: 'absolute',
    },
    resultZone: {
      marginTop: 32,
      minHeight: 44,
      alignItems: 'center',
      justifyContent: 'center',
    },
    resultText: {
      fontSize: FS['3xl'],
      fontWeight: FW.extrabold,
      color: c.text,
      letterSpacing: LS.wider,
      textTransform: 'uppercase',
    },
    resultHint: {
      fontSize: FS.sm,
      color: c.textMuted,
    },
    button: {
      marginTop: 32,
      // Plafonné : pleine largeur sur téléphone, jamais démesuré sur tablette.
      width: '100%',
      maxWidth: 400,
      alignSelf: 'center',
      backgroundColor: c.primary,
      borderRadius: R.lg,
      paddingVertical: S.base,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonPressed: {
      opacity: 0.85,
      transform: [{ scale: 0.98 }],
    },
    buttonDisabled: {
      opacity: 0.5,
    },
    buttonText: {
      color: c.white,
      fontSize: FS.base,
      fontWeight: FW.bold,
      letterSpacing: LS.wide,
    },
  });
}
