import { Platform } from 'react-native';
import Purchases, { LOG_LEVEL, PurchasesStoreProduct } from 'react-native-purchases';
import { DONATION_PRODUCT_IDS } from '../config/donations';

// Clés publiques RevenueCat (pas des secrets — safe à embarquer dans le bundle client).
// Renseignées via variables d'environnement EXPO_PUBLIC_* (voir .env / EAS secrets).
const REVENUECAT_API_KEY_IOS = process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY ?? '';
const REVENUECAT_API_KEY_ANDROID = process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY ?? '';

let configured = false;

/** À appeler une fois au démarrage de l'app (voir App.tsx). */
export function initPurchases() {
  if (configured) return;

  const apiKey = Platform.OS === 'ios' ? REVENUECAT_API_KEY_IOS : REVENUECAT_API_KEY_ANDROID;

  if (!apiKey) {
    console.warn(
      '[purchases] Clé API RevenueCat manquante — les dons ne fonctionneront pas. ' +
      'Renseigne EXPO_PUBLIC_REVENUECAT_IOS_KEY / EXPO_PUBLIC_REVENUECAT_ANDROID_KEY.'
    );
    return;
  }

  Purchases.configure({ apiKey });
  if (__DEV__) {
    Purchases.setLogLevel(LOG_LEVEL.DEBUG);
  }
  configured = true;
}

export function isPurchasesConfigured() {
  return configured;
}

/** Récupère les produits de don disponibles auprès du store (prix localisés inclus). */
export async function fetchDonationProducts(): Promise<PurchasesStoreProduct[]> {
  if (!configured) return [];
  return Purchases.getProducts(DONATION_PRODUCT_IDS);
}

export type DonationPurchaseResult =
  | { status: 'success' }
  | { status: 'cancelled' }
  | { status: 'error'; message: string };

/** Lance l'achat natif pour un produit de don donné. */
export async function purchaseDonation(product: PurchasesStoreProduct): Promise<DonationPurchaseResult> {
  try {
    await Purchases.purchaseStoreProduct(product);
    return { status: 'success' };
  } catch (error: any) {
    if (error?.userCancelled) {
      return { status: 'cancelled' };
    }
    return { status: 'error', message: error?.message ?? 'unknown error' };
  }
}
