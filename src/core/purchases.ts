/**
 * Achats intégrés (dons) — MODULE DORMANT, volontairement non appelé.
 *
 * Les dons ont été retirés de l'app : proposer un achat intégré fait basculer
 * l'éditeur en statut « trader » au sens du DSA, ce qui impose la publication
 * de son adresse postale sur la fiche App Store dans l'UE. Décision de ne pas
 * créer de structure pour l'instant (24 août 2026).
 *
 * Le code est conservé intact et fonctionnel pour une réintégration ultérieure.
 * Pour le réactiver : rappeler initPurchases() au démarrage dans App.tsx et
 * remonter l'UI de dons dans SupportScreen.tsx (cf. historique git).
 */
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

  // Le niveau de log doit être posé AVANT configure(), sinon les logs du
  // démarrage (dont ceux du chargement des produits) sont perdus.
  if (__DEV__) {
    Purchases.setLogLevel(LOG_LEVEL.DEBUG);
  }
  Purchases.configure({ apiKey });
  configured = true;
}

export function isPurchasesConfigured() {
  return configured;
}

/** Récupère les produits de don disponibles auprès du store (prix localisés inclus). */
export async function fetchDonationProducts(): Promise<PurchasesStoreProduct[]> {
  if (!configured) return [];
  const products = await Purchases.getProducts(DONATION_PRODUCT_IDS);

  if (__DEV__ && products.length !== DONATION_PRODUCT_IDS.length) {
    const returned = products.map((p) => p.identifier);
    const missing = DONATION_PRODUCT_IDS.filter((id) => !returned.includes(id));
    console.warn(
      `[donations] ${products.length}/${DONATION_PRODUCT_IDS.length} produits renvoyés par le store. ` +
      `Manquants : ${missing.join(', ') || 'aucun'}`
    );
  }

  return products;
}

export type DonationPurchaseResult =
  | { status: 'success' }
  | { status: 'cancelled' }
  /** Paiement accepté par le store mais pas encore validé (Demander à acheter, 3D Secure…). */
  | { status: 'pending' }
  /**
   * Échec de l'achat. `charged` indique si l'utilisateur a pu être débité :
   * - 'no'    → la transaction StoreKit n'a jamais abouti, aucun débit possible.
   * - 'maybe' → StoreKit a pu accepter le paiement mais la validation côté
   *             RevenueCat a échoué. Ne jamais affirmer « aucun débit » ici.
   */
  | { status: 'error'; charged: 'no' | 'maybe'; code: string; message: string };

/**
 * Codes d'erreur qui surviennent AVANT que StoreKit n'accepte le paiement.
 * Dans ces cas, on peut affirmer sans risque que rien n'a été débité.
 * Codes issus de PURCHASES_ERROR_CODE (react-native-purchases).
 */
const ERROR_CODES_BEFORE_PAYMENT = new Set<string>([
  '2',  // STORE_PROBLEM_ERROR
  '3',  // PURCHASE_NOT_ALLOWED_ERROR
  '4',  // PURCHASE_INVALID_ERROR
  '5',  // PRODUCT_NOT_AVAILABLE_FOR_PURCHASE_ERROR
  '6',  // PRODUCT_ALREADY_PURCHASED_ERROR
  '15', // OPERATION_ALREADY_IN_PROGRESS_ERROR
  '18', // INELIGIBLE_ERROR
  '23', // CONFIGURATION_ERROR
  '24', // UNSUPPORTED_ERROR
  '32', // PRODUCT_REQUEST_TIMED_OUT_ERROR
  '33', // API_ENDPOINT_BLOCKED
]);

const ERROR_CODE_PAYMENT_PENDING = '20'; // PAYMENT_PENDING_ERROR
const ERROR_CODE_CANCELLED = '1';        // PURCHASE_CANCELLED_ERROR

/** Lance l'achat natif pour un produit de don donné. */
export async function purchaseDonation(product: PurchasesStoreProduct): Promise<DonationPurchaseResult> {
  try {
    await Purchases.purchaseStoreProduct(product);
    return { status: 'success' };
  } catch (error: any) {
    const code = String(error?.code ?? '');

    if (error?.userCancelled || code === ERROR_CODE_CANCELLED) {
      return { status: 'cancelled' };
    }
    if (code === ERROR_CODE_PAYMENT_PENDING) {
      return { status: 'pending' };
    }

    // Tout ce qui n'est pas explicitement pré-paiement est traité comme
    // potentiellement débité (erreurs réseau / backend / reçu, et inconnues).
    const charged = ERROR_CODES_BEFORE_PAYMENT.has(code) ? 'no' : 'maybe';

    console.warn(
      `[purchases] Échec achat ${product.identifier} — code=${code} charged=${charged}: ` +
      (error?.underlyingErrorMessage || error?.message || 'unknown error')
    );

    return { status: 'error', charged, code, message: error?.message ?? 'unknown error' };
  }
}
