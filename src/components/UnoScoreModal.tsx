import { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Modal,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { colors } from '../theme/colors';

type Props = {
  visible: boolean;
  playerName: string;
  onClose: () => void;
  onValidate: (value: number) => void;
};

export default function UnoScoreModal({
  visible,
  playerName,
  onClose,
  onValidate,
}: Props) {
  const [manualScore, setManualScore] = useState('');

  const presetValues = [20, 50, 100];

  const validate = (value: number) => {
    onValidate(value);
    setManualScore('');
    Keyboard.dismiss();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
    >
      {/* 🔑 LE KeyboardAvoidingView DOIT ÊTRE LE PLUS HAUT */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
      >
        {/* Permet de fermer le clavier en tapant autour */}
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.overlay}>

            {/* MODAL */}
            <View style={styles.modal}>
              <Text style={styles.title}>
                Score pour {playerName}
              </Text>

              {/* Boutons rapides */}
              <View style={styles.presets}>
                {presetValues.map((value) => (
                  <Pressable
                    key={value}
                    style={styles.presetButton}
                    onPress={() => validate(value)}
                  >
                    <Text style={styles.presetText}>+{value}</Text>
                  </Pressable>
                ))}
              </View>

              {/* Champ manuel */}
              <TextInput
                placeholder="Score personnalisé"
                keyboardType="number-pad"
                value={manualScore}
                onChangeText={setManualScore}
                style={styles.input}
                placeholderTextColor="#9CA3AF"
                onSubmitEditing={() => {
                  if (manualScore) {
                    validate(parseInt(manualScore, 10));
                  }
                }}
              />

              {/* Valider */}
              <Pressable
                style={styles.validateButton}
                onPress={() => {
                  if (manualScore) {
                    validate(parseInt(manualScore, 10));
                  }
                }}
              >
                <Text style={styles.validateText}>
                  Valider
                </Text>
              </Pressable>

              {/* Annuler */}
              <Pressable onPress={onClose}>
                <Text style={styles.cancelText}>
                  Annuler
                </Text>
              </Pressable>
            </View>

          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
}


const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    color: colors.text,
  },
  presets: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  presetButton: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  presetText: {
    color: 'white',
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
    color: colors.text,
  },
  validateButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  validateText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  cancelText: {
    textAlign: 'center',
    color: '#6B7280',
  },
});
