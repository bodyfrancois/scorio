import React, { useMemo, useLayoutEffect, useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Linking,
  TextInput,
  Modal,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Constants from 'expo-constants';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { useTranslation } from '../i18n';
import { makeAboutStyles } from '../theme/styles';

const version = Constants.expoConfig?.version ?? '1.0.0';
const buildNumber = Constants.expoConfig?.ios?.buildNumber ?? '1';

const DONATION_URL = 'https://ko-fi.com/misterbuddy';

type FeedbackStatus = 'idle' | 'sending' | 'success' | 'error';

export default function AboutScreen({ route }: any) {
  const { colors, language } = useTheme();
  const t = useTranslation(language);
  const styles = useMemo(() => makeAboutStyles(colors), [colors]);
  const navigation = useNavigation();
  const scrollRef = useRef<ScrollView>(null);
  const feedbackY = useRef<number>(0);

  useFocusEffect(useCallback(() => {
    if (route?.params?.scrollToFeedback) {
      setTimeout(() => {
        scrollRef.current?.scrollTo({ y: feedbackY.current, animated: true });
      }, 300);
    }
  }, [route?.params?.scrollToFeedback]));

  useLayoutEffect(() => {
    navigation.setOptions({ headerTitle: t.about });
  }, [navigation, t.about]);

  const [feedbackCategory, setFeedbackCategory] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [categoryPickerVisible, setCategoryPickerVisible] = useState(false);
  const [feedbackStatus, setFeedbackStatus] = useState<FeedbackStatus>('idle');
  const [feedbackErrors, setFeedbackErrors] = useState<{ category?: boolean; text?: boolean }>({});

  const categories = [t.feedbackCatNewGame, t.feedbackCatBug, t.feedbackCatOther];

  const handleSend = () => {
    const errors: { category?: boolean; text?: boolean } = {};
    if (!feedbackCategory) errors.category = true;
    if (feedbackText.trim().length < 10) errors.text = true;
    setFeedbackErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setFeedbackStatus('sending');
    setTimeout(() => {
      setFeedbackStatus('success');
      setFeedbackCategory(null);
      setFeedbackText('');
      setTimeout(() => setFeedbackStatus('idle'), 4000);
    }, 1500);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >

        {/* App info */}
        <View style={[styles.card,{ alignItems: 'center' }]}>
          <View style={styles.iconBox}>
            <Text style={styles.iconLetter}>S</Text>
          </View>
          <Text style={styles.appName}>Scorio</Text>
          <Text style={[styles.bodySecondary, { textAlign: 'center', lineHeight: 22 }]}>{t.aboutBio}</Text>
        </View>

        {/* Donate */}
        <View style={[styles.card, styles.cardAbout, { alignItems: 'center', marginBottom: 40 }]}>
            <Ionicons name="heart" size={48} color={colors.white} style={{ marginBottom: 10 }} />
            <Text style={[styles.itemTitle, { color: colors.white, marginBottom: 20 }]}>{t.aboutDonate}</Text>
            <Text style={[styles.body, { color: colors.white, textAlign: 'center', lineHeight: 20, marginBottom: 20 }]}>{t.aboutDonateHint}</Text>
            <Pressable
            style={({ pressed }) => [styles.btnPrimary, { alignSelf: 'stretch' }, pressed && styles.pressed]}
            onPress={() => Linking.openURL(DONATION_URL)}
          >
            <Text style={styles.btnPrimaryText}>{t.aboutDonateCTA}</Text>
          </Pressable>
        </View>

        {/* Feedback */}
        <Text
          style={styles.sectionLabel}
          onLayout={(e) => { feedbackY.current = e.nativeEvent.layout.y; }}
        >
          {t.feedbackTitle}
        </Text>
        <View style={[styles.card, { gap: 12 }]}>
          <Text style={styles.caption}>{t.feedbackSubtitle}</Text>

          <Pressable
            style={[styles.feedbackPicker, feedbackErrors.category && styles.feedbackPickerError]}
            onPress={() => setCategoryPickerVisible(true)}
          >
            <Text style={feedbackCategory ? styles.feedbackPickerText : styles.feedbackPickerPlaceholder}>
              {feedbackCategory ?? t.feedbackCategoryPlaceholder}
            </Text>
            <Ionicons name="chevron-down" size={16} color={colors.textMuted} />
          </Pressable>
          {feedbackErrors.category && (
            <Text style={styles.feedbackErrorText}>{t.feedbackErrorCategory}</Text>
          )}

          <TextInput
            style={[styles.feedbackTextArea, feedbackErrors.text && styles.feedbackTextAreaError]}
            placeholder={t.feedbackTextPlaceholder}
            placeholderTextColor={colors.textMuted}
            value={feedbackText}
            onChangeText={(v) => {
              setFeedbackText(v);
              if (feedbackErrors.text && v.trim().length >= 10) {
                setFeedbackErrors((prev) => ({ ...prev, text: undefined }));
              }
            }}
            multiline
            numberOfLines={4}
          />
          {feedbackErrors.text && (
            <Text style={styles.feedbackErrorText}>{t.feedbackErrorText}</Text>
          )}

          {feedbackStatus === 'success' && (
            <View style={[styles.feedbackStatusBox, { backgroundColor: colors.primarySubtle }]}>
              <Ionicons name="checkmark-circle" size={18} color={colors.primary} />
              <Text style={[styles.feedbackStatusText, { color: colors.primary }]}>{t.feedbackSuccess}</Text>
            </View>
          )}
          {feedbackStatus === 'error' && (
            <View style={[styles.feedbackStatusBox, { borderWidth: 1, borderColor: colors.danger }]}>
              <Ionicons name="alert-circle" size={18} color={colors.danger} />
              <Text style={[styles.feedbackStatusText, { color: colors.danger }]}>{t.feedbackErrorGeneral}</Text>
            </View>
          )}

          <Pressable
            style={({ pressed }) => [
              styles.btnPrimary,
              feedbackStatus === 'sending' && styles.btnDisabled,
              pressed && feedbackStatus !== 'sending' && styles.pressed,
            ]}
            onPress={handleSend}
            disabled={feedbackStatus === 'sending'}
          >
            {feedbackStatus === 'sending' ? (
              <ActivityIndicator color={colors.white} size="small" />
            ) : (
              <Text style={styles.btnPrimaryText}>{t.feedbackSend}</Text>
            )}
          </Pressable>
        </View>

        <Text style={[styles.muted, { textAlign: 'center' }]}>by @MisterBuddy</Text>
      </ScrollView>

      <Modal visible={categoryPickerVisible} transparent animationType="slide">
        <Pressable style={styles.overlay} onPress={() => setCategoryPickerVisible(false)}>
          <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
            <Text style={[styles.labelPrimary, { marginBottom: 4 }]}>{t.feedbackCategory}</Text>
            {categories.map((cat, i) => (
              <Pressable
                key={cat}
                style={[
                  styles.dropdownOption,
                  i === categories.length - 1 && styles.dropdownOptionLast,
                ]}
                onPress={() => {
                  setFeedbackCategory(cat);
                  setFeedbackErrors((prev) => ({ ...prev, category: undefined }));
                  setCategoryPickerVisible(false);
                }}
              >
                <Text style={[
                  styles.dropdownOptionText,
                  feedbackCategory === cat && styles.dropdownOptionTextSelected,
                ]}>
                  {cat}
                </Text>
                {feedbackCategory === cat && (
                  <Ionicons name="checkmark" size={18} color={colors.primary} />
                )}
              </Pressable>
            ))}
          </Pressable>
        </Pressable>
      </Modal>
    </KeyboardAvoidingView>
  );
}
