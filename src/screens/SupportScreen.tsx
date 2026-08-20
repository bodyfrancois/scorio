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
  Animated,
  StyleSheet,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Constants from 'expo-constants';
import type { PurchasesStoreProduct } from 'react-native-purchases';
import { useTheme } from '../theme/ThemeContext';
import { useTranslation } from '../i18n';
import { makeAboutStyles } from '../theme/styles';
import { useSheetAnimation } from '../hooks/useSheetAnimation';
import { DONATION_TIERS } from '../config/donations';
import { fetchDonationProducts, purchaseDonation, isPurchasesConfigured } from '../core/purchases';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

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
  const categoryPickerAnim = useSheetAnimation(categoryPickerVisible);
  const [feedbackStatus, setFeedbackStatus] = useState<FeedbackStatus>('idle');
  const [feedbackErrors, setFeedbackErrors] = useState<{ category?: boolean; text?: boolean }>({});

  // ---- Dons (IAP) ----
  const [donateSheetVisible, setDonateSheetVisible] = useState(false);
  const donateSheetAnim = useSheetAnimation(donateSheetVisible);
  const [donationProducts, setDonationProducts] = useState<PurchasesStoreProduct[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [purchasingId, setPurchasingId] = useState<string | null>(null);
  const [donateResult, setDonateResult] = useState<'idle' | 'success' | 'error'>('idle');

  const openDonateSheet = async () => {
    setDonateSheetVisible(true);
    if (donationProducts.length === 0 && isPurchasesConfigured()) {
      setProductsLoading(true);
      try {
        const products = await fetchDonationProducts();
        setDonationProducts(products);
      } finally {
        setProductsLoading(false);
      }
    }
  };

  const handlePickAmount = async (productId: string) => {
    const product = donationProducts.find((p) => p.identifier === productId);
    if (!product) return; // produit pas encore chargé / indisponible — bouton désactivé dans ce cas
    setPurchasingId(productId);
    const result = await purchaseDonation(product);
    setPurchasingId(null);
    if (result.status === 'success') {
      setDonateSheetVisible(false);
      setDonateResult('success');
      setTimeout(() => setDonateResult('idle'), 5000);
    } else if (result.status === 'error') {
      setDonateSheetVisible(false);
      setDonateResult('error');
      setTimeout(() => setDonateResult('idle'), 5000);
    }
    // 'cancelled' → on laisse simplement la sheet ouverte, aucun message
  };

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

            {donateResult === 'success' && (
              <View style={[styles.feedbackStatusBox, { backgroundColor: colors.primarySubtle, alignSelf: 'stretch', marginBottom: 16 }]}>
                <Ionicons name="checkmark-circle" size={18} color={colors.primary} />
                <Text style={[styles.feedbackStatusText, { color: colors.primary }]}>{t.donateSuccessBody}</Text>
              </View>
            )}
            {donateResult === 'error' && (
              <View style={[styles.feedbackStatusBox, { borderWidth: 1, borderColor: colors.danger, alignSelf: 'stretch', marginBottom: 16 }]}>
                <Ionicons name="alert-circle" size={18} color={colors.danger} />
                <Text style={[styles.feedbackStatusText, { color: colors.danger }]}>{t.donateErrorBody}</Text>
              </View>
            )}

            <Pressable
              style={({ pressed }) => [styles.btnPrimary, { alignSelf: 'stretch' }, pressed && styles.pressed]}
              onPress={openDonateSheet}
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
        visible={categoryPickerAnim.rendered}
        transparent
        animationType="none"
        onRequestClose={() => setCategoryPickerVisible(false)}
      >
        <AnimatedPressable accessible={false} style={[styles.overlay, StyleSheet.absoluteFillObject, categoryPickerAnim.overlayStyle]} onPress={() => setCategoryPickerVisible(false)} />
        <View style={{ flex: 1, justifyContent: 'flex-end' }} pointerEvents="box-none">
          <Animated.View style={[styles.sheet, categoryPickerAnim.sheetStyle]}>
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
          </Animated.View>
        </View>
      </Modal>

      <Modal
        visible={donateSheetAnim.rendered}
        transparent
        animationType="none"
        onRequestClose={() => setDonateSheetVisible(false)}
      >
        <AnimatedPressable accessible={false} style={[styles.overlay, StyleSheet.absoluteFillObject, donateSheetAnim.overlayStyle]} onPress={() => setDonateSheetVisible(false)} />
        <View style={{ flex: 1, justifyContent: 'flex-end' }} pointerEvents="box-none">
          <Animated.View style={[styles.sheet, donateSheetAnim.sheetStyle]}>
            <Text style={[styles.labelPrimary, { marginBottom: 12 }]} accessibilityRole="header">
              {t.donateSheetTitle}
            </Text>

            {!isPurchasesConfigured() && (
              <View style={[styles.feedbackStatusBox, { borderWidth: 1, borderColor: colors.danger, marginBottom: 12 }]}>
                <Ionicons name="alert-circle" size={18} color={colors.danger} />
                <Text style={[styles.feedbackStatusText, { color: colors.danger }]}>{t.donateUnavailable}</Text>
              </View>
            )}

            {DONATION_TIERS.map((tier, i) => {
              const product = donationProducts.find((p) => p.identifier === tier.productId);
              const label = product?.priceString ?? tier.fallbackLabel;
              const disabled = productsLoading || !product || purchasingId !== null;
              return (
                <Pressable
                  key={tier.productId}
                  style={[
                    styles.dropdownOption,
                    i === DONATION_TIERS.length - 1 && styles.dropdownOptionLast,
                    disabled && !purchasingId && { opacity: productsLoading ? 0.5 : 1 },
                  ]}
                  onPress={() => handlePickAmount(tier.productId)}
                  disabled={disabled}
                  accessibilityRole="button"
                >
                  <Text style={styles.dropdownOptionText}>{label}</Text>
                  {purchasingId === tier.productId && (
                    <ActivityIndicator size="small" color={colors.primary} />
                  )}
                </Pressable>
              );
            })}
          </Animated.View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}
