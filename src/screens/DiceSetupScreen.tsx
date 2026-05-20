import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { useTranslation } from '../i18n';
import { RootStackParamList } from '../types/navigations';
import { makeNewGameStyles } from '../theme/styles';
import { DiceType } from '../components/DiceShape';

const DICE_TYPES: DiceType[] = ['D4', 'D6', 'D8', 'D10', 'D12', 'D20'];
const DICE_COLORS: Record<DiceType, string> = {
  D4:  '#7C48CA',
  D6:  '#7C48CA',
  D8:  '#7C48CA',
  D10: '#7C48CA',
  D12: '#7C48CA',
  D20: '#7C48CA',
};

export default function DiceSetupScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { colors, language } = useTheme();
  const t = useTranslation(language);
  const styles = useMemo(() => makeNewGameStyles(colors), [colors]);

  const [diceCount, setDiceCount] = useState(2);
  const [diceType, setDiceType] = useState<DiceType>('D6');

  const handlePlay = () => {
    navigation.navigate('DiceRoller', { diceCount, diceType });
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Nombre de dés */}
      <Text style={[styles.sectionLabel]}>{t.diceCount}</Text>

      <View style={[styles.card, styles.cardRow]}>
        <View style={styles.iconBoxSm}>
          <Ionicons name="dice-outline" size={18} color={colors.textSecondary} />
        </View>
        <Text style={[styles.body, { flex: 1 }]}>Nombre de dés</Text>
        <View style={styles.stepper}>
          <Pressable
            style={[styles.stepBtn, diceCount <= 1 && { opacity: 0.3 }]}
            onPress={() => setDiceCount(c => Math.max(1, c - 1))}
            disabled={diceCount <= 1}
          >
            <Ionicons name="remove" size={16} color={colors.text} />
          </Pressable>
          <Text style={[styles.itemTitle, { minWidth: 24, textAlign: 'center' }]}>{diceCount}</Text>
          <Pressable
            style={[styles.stepBtn, diceCount >= 6 && { opacity: 0.3 }]}
            onPress={() => setDiceCount(c => Math.min(6, c + 1))}
            disabled={diceCount >= 6}
          >
            <Ionicons name="add" size={16} color={colors.text} />
          </Pressable>
        </View>
      </View>

      {/* Type de dé */}
      <Text style={[styles.sectionLabel, styles.sectionLabelTop]}>{t.diceType}</Text>

      <View style={styles.card}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          {DICE_TYPES.map((type) => {
            const isSelected = diceType === type;
            return (
              <Pressable
                key={type}
                style={({ pressed }) => [
                  styles.radioOption,
                  {minWidth: 72, minHeight: 72, alignItems: 'center', gap: 8 },
                  isSelected && styles.radioOptionSelected,
                  isSelected && { borderColor: DICE_COLORS[type] + '88', backgroundColor: DICE_COLORS[type] + '18' },
                  pressed && styles.pressed,
                ]}
                onPress={() => setDiceType(type)}
              >
                <View style={[
                  styles.radioCircle,
                  isSelected && styles.radioCircleSelected,
                  isSelected && { borderColor: DICE_COLORS[type] },
                ]} />
                <Text style={[styles.bodyStrong, isSelected && { color: DICE_COLORS[type]}]}>
                  {type.slice(1)}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Bouton jouer */}
      <Pressable
        style={({ pressed }) => [
          styles.btnPrimary,
          styles.btnPrimaryBig,
          styles.startButtonLayout,
          pressed && styles.pressed,
        ]}
        onPress={handlePlay}
      >
        <Text style={styles.btnPrimaryText}>{t.play}</Text>
      </Pressable>

    </ScrollView>
  );
}
