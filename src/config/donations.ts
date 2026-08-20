/**
 * Paliers de don (achat intégré consommable, aucune fonctionnalité débloquée).
 * Les IDs doivent correspondre exactement aux produits créés dans
 * App Store Connect (Fonctionnalités de l'app → Achats intégrés) et
 * Google Play Console (Monétiser → Produits → Produits in-app).
 */
export type DonationTier = {
  productId: string;
  /** Libellé affiché si le prix RevenueCat n'est pas encore chargé (fallback hors-ligne). */
  fallbackLabel: string;
};

export const DONATION_TIERS: DonationTier[] = [
  { productId: 'com.scorup.app.tip_099', fallbackLabel: '0,99 €' },
  { productId: 'com.scorup.app.tip_199', fallbackLabel: '1,99 €' },
  { productId: 'com.scorup.app.tip_299', fallbackLabel: '2,99 €' },
  { productId: 'com.scorup.app.tip_499', fallbackLabel: '4,99 €' },
  { productId: 'com.scorup.app.tip_999', fallbackLabel: '9,99 €' },
  { productId: 'com.scorup.app.tip_1999', fallbackLabel: '19,99 €' },
  { productId: 'com.scorup.app.tip_4999', fallbackLabel: '49,99 €' },
];

export const DONATION_PRODUCT_IDS = DONATION_TIERS.map((tier) => tier.productId);
