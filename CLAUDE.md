# CLAUDE.md — Routine intégrée : Review · Tests · Sécurité
> Stack : React / TypeScript  
> Objectif : automatiser une boucle qualité complète à chaque session Claude Code

---

## 0. Setup initial (à faire une fois)

```bash
# MCPs nécessaires
claude mcp add @modelcontextprotocol/server-github
claude mcp add @playwright/mcp
claude mcp add @upstash/context7-mcp

# Outils CLI globaux
npm install -g semgrep
npm install -g snyk
npm install -g gitleaks   # ou via brew install gitleaks

# Auth
snyk auth
gh auth login             # GitHub CLI, utilisé par le MCP
```

---

## 1. Commandes rapides

Ces commandes déclenchent une routine complète. Utilise-les comme point d'entrée dans Claude Code.

| Commande | Ce que Claude fait |
|---|---|
| `/review` | Analyse la PR ou les fichiers modifiés — voir §2 |
| `/test` | Lance les tests existants et propose des ajouts — voir §3 |
| `/audit` | Scan sécurité complet du projet — voir §4 |
| `/routine` | Enchaîne les trois dans l'ordre |

---

## 2. Code Review (`/review`)

### Comportement attendu

Quand je lance `/review`, Claude doit :

1. **Identifier le périmètre** : fichiers modifiés depuis `main` (`git diff --name-only main`)
2. **Pour chaque fichier modifié**, analyser :
   - Lisibilité et cohérence avec les conventions du projet
   - Props TypeScript : types stricts, pas de `any`
   - Hooks React : règles des hooks, dépendances `useEffect` complètes
   - Gestion d'erreurs : pas de `try/catch` vides, erreurs propagées correctement
   - Accessibilité : `aria-*`, rôles sémantiques, focus management
   - Performance : `useMemo`/`useCallback` justifiés, pas de re-renders inutiles
3. **Sortir un rapport structuré** avec trois niveaux :
   - 🔴 Bloquant — à corriger avant merge
   - 🟡 Conseil — amélioration recommandée
   - 🟢 Positif — bon pattern à noter
4. Si le **MCP GitHub** est disponible : poster les commentaires directement sur la PR

### Conventions du projet à respecter

```
Projet : Scorup — app mobile React Native / Expo (iOS + Android)

Naming :
- Composants : PascalCase (ex. ScoreCard, PlayerList)
- Fonctions et variables : camelCase (ex. handlePress, isLoading)
- Fichiers de composants : PascalCase.tsx
- Fichiers utilitaires : camelCase.ts

Style :
- StyleSheet.create() de React Native — pas de CSS, pas de Tailwind
- Les styles restent dans le même fichier que le composant
- Pas de style inline sauf pour les valeurs dynamiques (ex. { color: score > 0 ? 'green' : 'red' })

Navigation :
- React Navigation (drawer + native-stack)
- Les écrans principaux sont dans le drawer
- Typer les paramètres de navigation avec un RootStackParamList

État :
- Local : useState / useContext (pas de Redux ni Zustand)
- Persistance : AsyncStorage (@react-native-async-storage)
- Pas de fetching réseau détecté — si ajouté, utiliser React Query

Icônes : @expo/vector-icons (Ionicons, MaterialIcons…)
Animations : react-native-reanimated
Identifiants : uuid (déjà installé)

Tests : aucun runner configuré — voir §3 pour l'ajouter
TypeScript : activé (strict recommandé — vérifier tsconfig.json)
```

---

## 3. Tests (`/test`)

### Comportement attendu

Quand je lance `/test` :

1. **Installer Jest si pas encore fait** (React Native / Expo) :
   ```bash
   npx expo install jest-expo @testing-library/react-native @testing-library/jest-native
   ```
   Puis ajouter dans `package.json` :
   ```json
   "jest": { "preset": "jest-expo" },
   "scripts": { "test": "jest --coverage" }
   ```
2. **Lancer la suite existante** :
   ```bash
   npx jest --coverage
   ```
2. **Analyser les résultats** : identifier les tests en échec et les causes probables
3. **Identifier les composants non couverts** : fichiers `.tsx` sans fichier `.test.tsx` associé
4. **Proposer des tests manquants** en priorité pour :
   - Les composants avec logique métier (calculs, transformations)
   - Les composants avec gestion d'état complexe
   - Les hooks custom
5. **Pour les tests E2E** (si Playwright MCP est disponible) :
   - Générer des scénarios couvrant les user journeys critiques
   - Lancer les tests sur `http://localhost:5173` (ou le port configuré)

### Structure de test attendue

```typescript
// Modèle pour un composant React Native
import { render, screen, fireEvent } from '@testing-library/react-native'
import { describe, it, expect } from '@jest/globals'
import { MonComposant } from './MonComposant'

describe('MonComposant', () => {
  it('affiche le contenu par défaut', () => { ... })
  it('réagit à l\'interaction utilisateur', () => {
    fireEvent.press(screen.getByText('Valider'))
    expect(...).toBe(...)
  })
  it('gère les cas limites / erreurs', () => { ... })
})
```

---

## 4. Audit sécurité (`/audit`)

### Comportement attendu

Quand je lance `/audit`, Claude enchaîne ces scans dans l'ordre :

#### 4a. Secrets exposés
```bash
gitleaks detect --source . --verbose
# Cherche : tokens, clés API, mots de passe dans le code et l'historique git
```

#### 4b. Analyse statique (SAST)
```bash
semgrep scan --config=auto --lang=typescript .
# Règles : injections, XSS, eval() dangereux, dangerouslySetInnerHTML non contrôlé
```

#### 4c. Vulnérabilités des dépendances (SCA)
```bash
snyk test --all-projects
# Alternative sans compte : npm audit --audit-level=moderate
```

#### 4d. Points de vigilance React/TS spécifiques

Claude doit aussi inspecter manuellement :
- `dangerouslySetInnerHTML` — vérifier que l'input est sanitisé
- Fetch / axios sans gestion CORS explicite
- Variables d'env exposées côté client (`VITE_` ou `REACT_APP_`)
- Dépendances avec typosquatting potentiel (noms proches de libs populaires)
- `localStorage` / `sessionStorage` avec données sensibles non chiffrées

#### 4e. Rapport de sortie

```
## Rapport sécurité — [date]

### Secrets : ✅ Aucun / ⚠️ X trouvé(s)
### SAST Semgrep : X findings (Y critiques, Z moyens)
### Dépendances : X vulnérabilités (Y high, Z moderate)
### Inspection manuelle : [observations]

### Actions prioritaires :
1. ...
2. ...
```

---

## 5. Routine complète (`/routine`)

Enchaînement recommandé avant un merge ou une mise en prod :

```
1. /review   → corriger les bloquants
2. /test     → s'assurer que la couverture est OK
3. /audit    → vérifier qu'aucun secret ou CVE critique n'est introduit
4. Commit + push
```

Claude doit s'arrêter et signaler si :
- Un finding 🔴 est détecté en review
- Un test existant échoue
- Un secret ou une vulnérabilité **high/critical** est trouvé

---

## 6. Context7 — Documentation à jour

Si le MCP Context7 est disponible, Claude doit l'utiliser automatiquement quand :
- La review concerne une lib tierce (React, Zod, React Query…)
- Une suggestion implique une API que Claude pourrait mal connaître

```
use context7 for: react-native, expo, react-navigation, async-storage, react-native-reanimated
```

---

## 7. Ce que Claude ne doit PAS faire

- Modifier du code sans demander confirmation si le fichier n'est pas dans le diff
- Poster des commentaires sur une PR sans confirmation explicite
- Ignorer un finding `critical` ou `high` en sécurité
- Générer des tests qui mockent tout — les tests doivent tester du comportement réel

---

## 8. Contexte produit & état de déploiement

*Dernière mise à jour : 24 août 2026. Section vivante — mettre à jour au fil des sessions de déploiement/publication. Guide détaillé pas-à-pas : voir `STORE_LAUNCH.md` à la racine du repo.*

### Identité de l'app

- Nom : **Scorup** — assistant de score universel pour jeux de société (remplace papier/crayon, calcule automatiquement points/bonus/malus selon les règles officielles de chaque jeu). 17 jeux.
- Bundle ID **identique iOS et Android** : `com.scorup.app` (changé depuis `com.bodyfrancois.scorup` / `com.anonymous.scorio`).
- Compte EAS/Expo : owner `fbo44`. Projet EAS recréé de zéro à cause d'un mismatch de slug historique ("scorio" côté serveur vs "scorup" en local) — `extra.eas.projectId` régénéré via `eas init`.
- App Store Connect : app créée, App ID Apple `6801548595`. Apple Team `G9WRT4J6C5` (François BODY, Individual).
- Éditeur légal (personne physique, compte individuel) : **BODY François**. Utilisé dans le copyright (`© 2026 François Body`) et les pages de politique de confidentialité.
- Contact support dédié (pas l'email perso) : `scorup.support@gmail.com`.

### DÉCISION MAJEURE du 24 août 2026 — pas de dons dans l'app

**L'app est 100 % gratuite : aucun achat intégré, aucun abonnement, aucune pub, aucun lien de paiement externe.**

Raison : proposer un achat intégré fait basculer l'éditeur en statut **« trader » au sens du DSA**, ce qui impose la publication de nom + **adresse postale** + téléphone sur la fiche App Store dans l'UE. Le statut trader ne dépend pas d'avoir une société — une personne physique qui monétise est trader. Sans structure juridique, la seule adresse déclarable est le domicile. L'utilisateur ne souhaite pas créer d'auto-entreprise + domiciliation (~180-360 €/an) pour une app sans audience établie.

Chaîne à retenir : **dons ⇒ trader ⇒ adresse publique**. Les seules issues sont : pas de dons, ou structure + domiciliation commerciale.

Conséquences dans le code (commits `f26b607b` et `73691df7`) :

- UI de dons retirée de `SupportScreen.tsx` ; `initPurchases()` n'est plus appelé dans `App.tsx`.
- `src/core/purchases.ts` et `src/config/donations.ts` **conservés intacts et documentés** (en-tête explicatif dans `purchases.ts`) pour réintégration ultérieure. Les dépendances `react-native-purchases` / `-ui` restent installées.
- Écran renommé : label du drawer et titre de page passés de « Soutenir le projet » à **« Contact »**, nouvelle icône `IconMail` (enveloppe outline). L'écran ne contient plus que le formulaire de feedback (mailto).
- Textes i18n de dons laissés en place (inutilisés, sans impact).

**Si les dons sont réintégrés un jour** : rappeler `initPurchases()` au démarrage, remonter l'UI (cf. historique git), recréer/rattacher les 7 produits IAP, ET traiter le statut trader DSA au préalable.

### État iOS

- Compte Apple Developer Program individuel actif (99 $/an).
- Historique des rejets : **3.1.1** le 19 août (lien de don externe Ko-fi → supprimé), puis demande d'infos **2.1** (traitée : note de review, age rating 4+, Paid Apps Agreement signé), puis **2.1(b)** (boutons de montants de don morts).
- Le rejet 2.1(b) avait **deux causes cumulées**, toutes deux comprises et résolues :
  1. `EXPO_PUBLIC_REVENUECAT_IOS_KEY` absente du build → SDK non configuré → `getProducts()` renvoyait `[]` → tous les boutons `disabled`.
  2. Contrat Paid Apps inactif au moment de la review (activé seulement le 24 août) → StoreKit ne servait aucun produit.
- Les deux motifs de rejet sont désormais **sans objet** puisqu'il n'y a plus aucun mécanisme de paiement.
- Builds : 6 (reviewé, rejeté), 7/9/10 annulés, **11** = premier build sans dons (commit `73691df7`).
- `eas.json` → `submit.production` laissé vide intentionnellement : `eas submit` prompt les identifiants à la volée plutôt que de les stocker en config.

### Statut DSA « trader » — EN ATTENTE, point bloquant avant publication

- Déclaration trader soumise (avec adresse perso) avant la décision de retirer les dons. Statut : **« En cours de vérification »** dans App Store Connect → Business → Conformité.
- **Non modifiable** pendant la vérification, et il n'existe **pas** de champ trader au niveau de l'app (vérifié : rien dans Informations sur l'app). Seul recours : le support Apple.
- Mail de demande de correction en non-trader envoyé via Business → Contactez-nous.
- **Rien n'est publié tant que l'app n'est pas en ligne.** D'où la règle : **soumettre en publication MANUELLE**, ne déclencher la mise en vente qu'une fois le statut passé en non-trader.

### Contrat & fiscalité (tous actifs depuis le 24 août 2026)

- Contrat applications gratuites : Actif. Contrat applications payantes : Actif (24 août 2026 – 13 août 2027).
- Compte bancaire BODY (3701), France, EUR : Actif. W-8BEN + Certificate of Foreign Status : Actifs.
- À savoir si les dons reviennent : des revenus **récurrents** relèvent d'une activité habituelle → immatriculation probablement nécessaire (URSSAF / comptable à consulter). Apple, lui, n'exige aucune société.

### Configuration RevenueCat (en place, actuellement inutilisée)

- App « Scorup (App Store) », bundle `com.scorup.app`. Clé publique iOS présente comme variable d'env EAS `EXPO_PUBLIC_REVENUECAT_IOS_KEY` (environnement `production`, créée le 20 août).
- In-app purchase key `.p8` (Key ID `D3M3VDY92H`) : « Valid credentials ». Shared Secret renseigné. App Store Connect API key uploadée → les 7 produits sont passés de « Could not check » à « Ready to Submit ».
- Clé Android `EXPO_PUBLIC_REVENUECAT_ANDROID_KEY` : **jamais créée**.
- Les 7 produits IAP (`com.scorup.app.tip_099` / `_199` / `_299` / `_499` / `_999` / `_1999` / `_4999`) existent dans App Store Connect en « Ready to Submit ». **À détacher de la soumission de version** — sinon Apple examine des produits absents du binaire.

### État Android

- Bundle/package corrigé (`com.scorup.app`), mais **rien d'autre entamé** côté Play Store.
- Reste à faire : créer le compte Google Play Console (25 $, vérification d'identité obligatoire depuis sept. 2026), lancer le test fermé 12 testeurs/14 jours (obligatoire pour tout nouveau compte perso), puis build + submit EAS Android.

### Pages légales (hébergées via GitHub Pages, repo `bodyfrancois/scorup`, branche main, racine)

- `privacy-policy.html` / `privacy-policy-en.html`
- `support.html` / `support-en.html`
- URLs live : `https://bodyfrancois.github.io/scorup/{privacy-policy,support}[-en].html`

### Points ouverts / à surveiller

- **Statut DSA non-trader** : voir ci-dessus. C'est le seul point qui bloque la mise en vente.
- **Logo Flip 7** : conservé tel quel malgré une ressemblance avec le branding officiel du jeu (gros « 7 » jaune/doré) — risque accepté explicitement par l'utilisateur, pas une omission.
- Logos revus/rendus plus génériques pour réduire le risque de marque : Uno, Skyjo, Scrabble, Ligretto, 6 qui prend, Pili Pili. Les jeux traditionnels/génériques (Tarot, Belote, Palet, Cornhole, Mille Sabords, 5 Rois, Fléchettes 301, Hilo, Speedbac, Dice) n'ont pas de marque déposée unique à risquer.

### Pièges techniques déjà rencontrés (éviter de les refaire)

- **EAS Build archive l'état COMMITÉ de git**, pas le dossier de travail. Un fichier modifié mais non commité n'est pas dans le build (piège vécu : build 7 construit sans aucune des corrections). Et `git commit -am` **n'ajoute pas les fichiers neufs** (piège vécu : `IconMail.tsx` absent du commit → import cassé). Toujours `git status --porcelain` avant de builder : aucune ligne `??` ni ` M` qui compte.
- **Un profil de build EAS ne charge les variables d'env du serveur que s'il déclare `"environment": "..."`** dans `eas.json`. Sans ce champ, la variable existe côté EAS mais n'est jamais injectée — silencieusement. Signal fiable au lancement du build : la ligne `Environment variables ... loaded from the "production" environment on EAS`. Le champ `environment` renvoyé par `eas build:list --json` vaut toujours `None` et **n'est pas un indicateur fiable**.
- **`.easignore` remplace entièrement `.gitignore`** pour EAS Build (ne s'additionne pas) — s'il existe, il doit dupliquer tout le contenu utile de `.gitignore` (node_modules/, ios/Pods/, ios/build/, android/build/, android/.gradle/) sous peine d'archives énormes (157 Mo → 281 Mo en l'oubliant). Taille saine actuelle : ~70 Mo.
- Projet en mode **prebuild/bare** (dossiers `ios/`/`android/` committés) : éditer `app.json` seul ne suffit pas pour `orientation`, `icon`, `userInterfaceStyle`, `splash`, `ios`, `android`, `plugins` — EAS Build ne les resynchronise pas. Il faut éditer les fichiers natifs directement (`ios/*.xcodeproj/project.pbxproj`, `ios/*/Info.plist`, `android/app/build.gradle`, `android/app/src/main/java/.../MainActivity.kt` etc.).
- Renommage de bundle ID Android = déplacer le dossier Kotlin (`android/app/src/main/java/<ancien package>/` → `<nouveau package>/`) et mettre à jour la ligne `package` en tête de chaque fichier `.kt`, en plus de `build.gradle`.
- `react-native-reanimated` v4 nécessite le package séparé `react-native-worklets` **et** le plugin babel `react-native-worklets/plugin` (pas `react-native-reanimated/plugin`) — sinon crash silencieux en prod.
- `ITSAppUsesNonExemptEncryption = false` ajouté dans `Info.plist` (+ `app.json` → `ios.config.usesNonExemptEncryption`) pour éviter la question de conformité chiffrement à chaque soumission.
- **Logs JS vs natifs** : les `console.warn` sortent dans le terminal Metro, pas dans la console Xcode. Les logs natifs (RevenueCat p. ex.) sortent dans Xcode. Chercher au mauvais endroit fait conclure à tort à une absence d'erreur.

---

*Mettre à jour ce fichier quand le stack ou les conventions évoluent.*
