import { useEffect, useRef } from 'react';
import { Animated, Dimensions, Easing } from 'react-native';

const SCREEN_HEIGHT = Dimensions.get('window').height;

/**
 * Anime indépendamment l'overlay (fondu) et le sheet (glissement depuis le bas) d'une modale.
 * `rendered` doit piloter la prop `visible` du <Modal animationType="none">.
 *
 * La fermeture est instantanée (pas d'animation de sortie retardant le démontage) :
 * un <Modal> natif React Native reste "présenté" côté iOS tant qu'il est monté, donc
 * garder le Modal monté quelques centaines de ms après que `visible` soit passé à false
 * entre en conflit avec toute autre modale ouverte dans la foulée (ex. EditScoreModal qui
 * se ferme pendant que EndGameModal s'ouvre en même temps en fin de partie) — la seconde
 * modale peut alors ne jamais s'afficher. D'où `rendered = visible`, sans délai.
 *
 * Usage attendu dans le JSX (overlay en position absolue, derrière, sheet poussé en bas
 * par un wrapper flex séparé) :
 *
 *   <Modal visible={rendered} transparent animationType="none" onRequestClose={...}>
 *     <Animated.View style={[styles.overlay, StyleSheet.absoluteFillObject, overlayStyle]} />
 *     <View style={{ flex: 1, justifyContent: 'flex-end' }} pointerEvents="box-none">
 *       <Animated.View style={[styles.sheet, sheetStyle]}>...</Animated.View>
 *     </View>
 *   </Modal>
 */
export function useSheetAnimation(visible: boolean) {
  const overlayOpacity = useRef(new Animated.Value(visible ? 1 : 0)).current;
  const sheetTranslateY = useRef(new Animated.Value(visible ? 0 : SCREEN_HEIGHT)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 220,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(sheetTranslateY, {
          toValue: 0,
          duration: 260,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      overlayOpacity.stopAnimation();
      sheetTranslateY.stopAnimation();
      overlayOpacity.setValue(0);
      sheetTranslateY.setValue(SCREEN_HEIGHT);
    }
  }, [visible]);

  return {
    rendered: visible,
    overlayStyle: { opacity: overlayOpacity },
    sheetStyle: { transform: [{ translateY: sheetTranslateY }] },
  };
}
