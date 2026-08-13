import { useMemo, useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Linking,
  TextInput,
  Modal,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Constants from 'expo-constants';
import { useTheme } from '../theme/ThemeContext';
import { useTranslation } from '../i18n';
import { makeAboutStyles } from '../theme/styles';

const DONATION_URL = 'https://ko-fi.com/misterbuddy';
const FEEDBACK_EMAIL = 'scorup.support@gmail.com';
const APP_VERSION = Constants.expoConfig?.version ?? '1.0.0';
const APP_BUILD = Platform.OS === 'ios'
  ? Constants.expoConfig?.ios?.buildNumber ?? '1'
  : Constants.expoConfig?.android?.versionCode?.toString() ?? '1';

type FeedbackStatus = 'idle' | 'sending' | 'success' | 'error';

export default function SupportScreen({ route }: any) {
  const { colors, language } = useTheme();
  const t = useTranslation(language);
  const styles = useMemo(() => makeAboutStyles(colors), [colors]);
  const scrollRef = useRef<ScrollView>(null);
  const feedbackY = useRef<number>(0);

  useFocusEffect(useCallback(() => {
    if (route?.params?.scrollToFeedback) {
      setTimeout(() => {
        scrollRef.current?.scrollTo({ y: feedbackY.current, animated: true });
      }, 300);
    }
  }, [route?.params?.scrollToFeedback]));

  const [feedbackCategory, setFeedbackCategory] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [categoryPickerVisible, setCategoryPickerVisible] = useState(false);
  const [feedbackStatus, setFeedbackStatus] = useState<FeedbackStatus>('idle');
  const [feedbackErrors, setFeedbackErrors] = useState<{ category?: boolean; text?: boolean }>({});

  const categories = [t.feedbackCatNewGame, t.feedbackCatBug, t.feedbackCatOther];

  const handleSend = async () => {
    const errors: { category?: boolean; text?: boolean } = {};
    if (!feedbackCategory) errors.category = true;
    if (feedbackText.trim().length < 10) errors.text = true;
    setFeedbackErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setFeedbackStatus('sending');
    const subject = encodeURIComponent(`Scorup — ${feedbackCategory}`);
    const debugInfo = [
      '—',
      `Scorup v${APP_VERSION} (build ${APP_BUILD})`,
      `Plateforme : ${Platform.OS} ${Platform.Version}`,
      `Langue : ${language}`,
    ].join('\n');
    const body = encodeURIComponent(`${feedbackText.trim()}\n\n${debugInfo}`);
    const mailtoUrl = `mailto:${FEEDBACK_EMAIL}?subject=${subject}&body=${body}`;

    try {
      const supported = await Linking.canOpenURL(mailtoUrl);
      if (!supported) throw new Error('no mail client available');
      await Linking.openURL(mailtoUrl);
      setFeedbackStatus('success');
      setFeedbackCategory(null);
      setFeedbackText('');
      setTimeout(() => setFeedbackStatus('idle'), 4000);
    } catch {
      setFeedbackStatus('error');
      setTimeout(() => setFeedbackStatus('idle'), 4000);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={[styles.scrollContent, { paddingTop: 24 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Donate */}
        <View style={[styles.card, { padding: 0 }]}>
          <LinearGradient
            colors={[colors.white, colors.white]}
            start={{ x: 0, y: 0 }}
            end={{ x: 3, y: -1 }}
            style={{ borderRadius: 16, padding: 24, alignItems: 'center', overflow: 'hidden' }}
          >
            <Ionicons name="heart" size={56} color={colors.primary} style={{ marginBottom: 14 }} />
            <Text style={[styles.itemTitle, {fontSize: 20, textAlign: 'center', marginBottom: 20 }]}>
              {t.aboutDonate}
            </Text>
            <Text style={[styles.body, {textAlign: 'center', lineHeight: 22, marginBottom: 24 }]}>
              {t.aboutDonateHint}
            </Text>
            <Pressable
              style={({ pressed }) => [styles.btnPrimary, { alignSelf: 'stretch' }, pressed && styles.pressed]}
              onPress={() => Linking.openURL(DONATION_URL)}
              accessibilityRole="button"
            >
              <Text style={styles.btnPrimaryText}>{t.aboutDonateCTA}</Text>
            </Pressable>
          </LinearGradient>
        </View>

        {/* Feedback */}
        <Text
          style={[styles.sectionLabel, { marginTop: 24 }]}
          onLayout={(e) => { feedbackY.current = e.nativeEvent.layout.y; }}
        >
          {t.feedbackTitle}
        </Text>
        <View style={[styles.card, { gap: 12 }]}>
          <Text style={styles.caption}>{t.feedbackSubtitle}</Text>

          <Pressable
            style={[styles.feedbackPicker, feedbackErrors.category && styles.feedbackPickerError]}
            onPress={() => setCategoryPickerVisible(true)}
            accessibilityRole="button"
            accessibilityLabel={feedbackCategory ?? t.feedbackCategoryPlaceholder}
            accessibilityState={{ expanded: categoryPickerVisible }}
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
            accessibilityLabel={t.feedbackTextPlaceholder}
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

          <Pressable accessibilityRole="button"
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
      </ScrollView>

      <Modal
        visible={categoryPickerVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setCategoryPickerVisible(false)}
      >
        <Pressable accessible={false} style={styles.overlay} onPress={() => setCategoryPickerVisible(false)}>
          <Pressable accessible={false} style={styles.sheet} onPress={(e) => e.stopPropagation()}>
            <Text style={[styles.labelPrimary, { marginBottom: 4 }]} accessibilityRole="header">{t.feedbackCategory}</Text>
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
                accessibilityRole="radio"
                accessibilityState={{ selected: feedbackCategory === cat }}
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
