# Scorup — Guide de mise en ligne App Store & Play Store

*Rédigé le 13/08/2026, à partir de l'état réel du projet (`app.json`, `eas.json`, `package.json`, `src/games/`). Les infos réglementaires (tailles, prix, quotas) ont été vérifiées via recherche web en août 2026 — à recontrôler au moment de la soumission, ces règles bougent souvent.*

---

## 0. Blocages à corriger AVANT le premier build de prod

🔴 **Bundle ID incohérent entre iOS et Android.**
- iOS : `com.bodyfrancois.scorup`
- Android : `com.anonymous.scorup` ← c'est le placeholder par défaut d'Expo, pas un vrai identifiant.

`com.anonymous.*` ne doit pas partir en prod : une fois publié sur Play Store, **le package name est figé à vie** (impossible à changer sans republier une nouvelle fiche = perte des avis/téléchargements). Décide maintenant :
- soit tu alignes les deux sur `com.bodyfrancois.scorup`,
- soit tu passes sur un identifiant de marque si tu comptes structurer une société/marque plus tard (ex. `com.scorup.app`).

À corriger dans `app.json` → `android.package` avant `eas build --profile production`.

🔴 **Aucune politique de confidentialité (privacy policy).** Obligatoire pour Apple ET Google, même si l'app ne collecte rien. Voir §6, un brouillon est prêt plus bas — il te reste à l'héberger sur une URL publique (page GitHub Pages, Notion public, site perso...).

🔴 **`eas.json` → `submit.production` est vide `{}`.** Il faudra le compléter avec tes identifiants Apple / le service account Google avant `eas submit` (détails §3).

🟡 **Aucun screenshot ni feature graphic dans `assets/`.** À produire, voir §5.

🟡 **Vérifie qu'aucune lib pub/tracking n'a été ajoutée depuis** : `package.json` ne contient aujourd'hui aucune dépendance AdMob, analytics ou achat intégré, et `AsyncStorage` reste local. Si c'est toujours le cas au moment de soumettre, le formulaire "Data Safety" (Google) et "App Privacy" (Apple) se remplissent en mode "aucune donnée collectée" — le plus simple qui soit. Si tu as ajouté des pubs ou un SDK d'analytics entre-temps, tout ce qui suit sur la confidentialité est à refaire.

---

## 1. Comptes et coûts

| | Apple | Google |
|---|---|---|
| Compte requis | Apple Developer Program | Google Play Console |
| Coût | 99 $/an | 25 $ *une seule fois* (pas de renouvellement) |
| Délai d'activation | 1 à 3 jours (compte individuel) | Rapide pour l'inscription, mais voir vérification d'identité ci-dessous |
| Ton cas (aucun compte encore) | Les deux contraintes 2026 ci-dessous s'appliquent automatiquement, tu pars de zéro. | |

### ⚠️ Nouveau en 2026 : vérification d'identité Google (Android Developer Verification)

Google déploie depuis septembre 2026 une vérification d'identité obligatoire pour **tout nouveau compte développeur personnel** : nom, adresse, téléphone vérifiés, et **pièce d'identité officielle** (passeport, carte d'identité, permis) à uploader — en cours de validité, lisible, avec ton nom légal exact. Le nom sur la pièce doit correspondre exactement au nom déclaré dans Play Console, idem pour l'adresse. Prépare ces documents avant de commencer l'inscription, ça évite un rejet et une reprise à zéro.

Comme tu n'as pas encore de compte, tu passeras par cette vérification de toute façon — **inscris-toi maintenant plutôt que d'attendre**, c'est un point de départ obligé, pas un choix.

Ceci est distinct des 12 testeurs/14 jours (§4), qui s'ajoutent par-dessus.

**Ordre recommandé, vu que tu pars de zéro** :
1. Compte Google Play Console en premier (25$ + vérif identité) → c'est lui qui a le chemin critique le plus long (vérif identité + 14 jours de test). Lance-le cette semaine.
2. Compte Apple Developer en parallèle ou juste après (1-3 jours d'approbation, moins bloquant).

---

## 2. Préparer la config technique

### 2.1 Corriger `app.json`

```json
"android": {
  "package": "com.bodyfrancois.scorup"   // remplace com.anonymous.scorup
}
```

### 2.2 Compléter `eas.json`

```json
"submit": {
  "production": {
    "ios": {
      "appleId": "ton-email-apple-dev@example.com",
      "ascAppId": "XXXXXXXXXX",
      "appleTeamId": "XXXXXXXXXX"
    },
    "android": {
      "serviceAccountKeyPath": "./google-service-account.json",
      "track": "internal"
    }
  }
}
```

- `ascAppId` : créé en enregistrant l'app dans App Store Connect (avant le premier submit).
- Le fichier `google-service-account.json` : à générer dans Google Cloud Console (compte de service avec droits "Release Manager" sur Play Console) — voir doc Expo [Creating a Google Service Account key](https://docs.expo.dev/submit/android/#creating-a-google-service-account). **Ne jamais commiter ce fichier** — ajoute-le au `.gitignore`.

### 2.3 Versioning

`eas.json` a déjà `"autoIncrement": true` en production → EAS incrémente automatiquement `buildNumber` (iOS) / `versionCode` (Android) à chaque build. Tu n'as rien à gérer manuellement là-dessus, bon point de départ.

---

## 3. Build & Submit avec EAS

Le projet est déjà relié à EAS (`extra.eas.projectId` présent, owner `fbo44`). Séquence :

```bash
# 1. Login EAS si besoin
eas login

# 2. Build de prod pour les deux plateformes
eas build --platform all --profile production

# 3. Une fois le build terminé, soumission
eas submit --platform ios --latest
eas submit --platform android --latest
```

Notes :
- **iOS** : `eas submit` envoie l'`.ipa` vers TestFlight. Ce n'est **pas** automatiquement publié — il faut ensuite aller dans App Store Connect, compléter la fiche (screenshots, description...), sélectionner le build, et soumettre pour App Review manuellement.
- **Android** : `eas submit` publie l'`.aab` sur la track choisie (mets `internal` en premier passage, tu passeras en `production` depuis la console une fois les tests validés).
- Apple impose depuis le 28/04/2026 que toute nouvelle soumission soit compilée avec le SDK iOS 26 minimum — vérifie ta version d'Xcode/EAS build image avant de builder si tu es sur une image ancienne.

---

## 4. Le piège Google : 12 testeurs / 14 jours

Ton compte sera créé maintenant, donc **cette contrainte s'applique à toi, à coup sûr**. Tu ne pourras pas publier directement en production. Étapes obligatoires :

1. Créer une track de "Test fermé" (Closed testing) dans Play Console.
2. Recruter au moins **12 testeurs réels** qui doivent explicitement opt-in via le lien d'invitation, sur de vrais appareils Android avec un vrai compte Google (les émulateurs et comptes dupliqués ne comptent pas).
3. Laisser tourner **14 jours consécutifs** à partir du moment où les 12 testeurs ont rejoint et où la release est approuvée.
4. Ensuite seulement, la demande de passage en production s'ouvre.

**À vérifier avant de te lancer** : la date exacte de création de ton compte Play Console (Play Console → Paramètres du compte) — ça détermine si cette contrainte s'applique. Si oui, lance cette étape en tout premier, en parallèle de la prépa des assets — c'est le facteur qui va le plus retarder ta mise en ligne.

---

## 5. Assets requis

| Asset | iOS (App Store Connect) | Android (Play Console) |
|---|---|---|
| Icône app | déjà en place (`assets/icon.png`) — vérifier 1024×1024 sans transparence/coins arrondis | `assets/adaptive-icon.png` en place — prévoir en plus une **icône haute résolution 512×512 px** pour la fiche store |
| Feature graphic | — | **1024×500 px**, obligatoire, absente actuellement |
| Screenshots | **6.9" iPhone : 1320×2868 px** (obligatoire) + **13" iPad : 2064×2752 px** si l'app supporte tablette (c'est le cas, `supportsTablet: true`). Apple redimensionne automatiquement pour les autres tailles d'écran — plus besoin de fournir toutes les tailles comme avant. 1 à 10 images. | Captures téléphone (min 2, jusqu'à 8), formats JPG/PNG 16:9 ou 9:16 |
| Privacy Manifest (`PrivacyInfo.xcprivacy`) | Obligatoire si l'app utilise des "Required Reason APIs" (ex. `UserDefaults`, certaines API de date/heure). À vérifier — souvent auto-géré par les libs Expo/RN modernes, mais un rejet Apple fréquent en 2026 vient de ce fichier manquant. À contrôler via `npx expo-doctor` avant build. | — |

Aucun screenshot n'existe encore dans le projet — c'est la tâche manuelle la plus longue avant soumission (il faut jouer une partie de chaque jeu phare pour capturer de vrais écrans, pas des mockups vides).

---

## 6. Politique de confidentialité — brouillon prêt à héberger

Vu l'état actuel du code (stockage 100% local via AsyncStorage, aucun réseau, aucune pub détectée), un texte simple suffit. À copier sur une page publique (GitHub Pages, Notion partagé, etc.) puis renseigner l'URL dans App Store Connect et Play Console.

```
Politique de confidentialité — Scorup

Dernière mise à jour : [date]

Scorup est une application de feuilles de score pour jeux de société.
Scorup ne collecte, ne transmet et ne partage aucune donnée personnelle.

Les données que vous saisissez (noms des joueurs, scores, historique de
parties) sont stockées uniquement sur votre appareil, localement, et ne
sont jamais envoyées à un serveur. Nous n'avons accès à aucune de ces
informations.

L'application ne contient ni publicité, ni traceur, ni service d'analyse
tiers, ni achat intégré.

Pour toute question : [ton email de contact]
```

⚠️ Ce texte n'a de valeur que si le code correspond réellement à cette description au moment où tu le publies. Si tu ajoutes un jour des pubs, un SDK d'analytics ou une sync cloud, ce texte devient faux et il faudra le mettre à jour avant la prochaine soumission.

---

## 7. Fiche store — FR (optimisée référencement)

L'app couvre déjà ces jeux (source : `src/games/`) — ce sont tes mots-clés naturels, les gens cherchent l'app par le nom du jeu plus souvent que par "compteur de points" : **Belote, Tarot, Skyjo, Uno, Scrabble, Pétanque, Cornhole, Ligretto, Mille Sabords, 5 Rois, Fléchettes 301, 6 qui prend, Hilo, Speedbac, Palet, Pili Pili, Flip 7, Dés (Dice)**, + mode jeu libre.

### App Store (iOS)

- **Nom de l'app (30 car. max)** : `Scorup`
- **Sous-titre (30 car. max)** : `Score & règles jeux société` *(compte les caractères exacts dans App Store Connect au moment de la saisie, les accents/espaces peuvent varier le total)*
- **Champ mots-clés (100 car. max, séparés par virgules, sans espace)** :
  `belote,tarot,skyjo,uno,scrabble,petanque,cornhole,ligretto,millesabords,flechettes,compteur,carnet,regles,soiree`
  *(à ajuster pour tenir exactement dans 100 caractères — ne répète pas les mots déjà dans le nom/sous-titre, ça gaspille de la place)*
- **Description** : voir bloc commun ci-dessous.

### Google Play

- **Titre (30 car. max)** : `Scorup - Score jeux société`
- **Description courte (80 car. max)** : `Feuilles de score automatiques pour tous vos jeux de société, sans papier.`
- **Description longue (4000 car. max)** : voir bloc commun ci-dessous, tu peux la garder plus détaillée que sur iOS puisque Google indexe le texte complet (contrairement à Apple qui n'indexe que le champ mots-clés).

### Description longue (commune, à adapter par plateforme)

```
Scorup remplace le papier et le crayon pour tous vos jeux de société.

Choisissez votre jeu, ajoutez les joueurs, et Scorup affiche une feuille
de score intelligente qui respecte les règles officielles : calcul
automatique des points, gestion des bonus et malus, indication du
joueur qui commence, et guidage manche par manche.

Jeux disponibles : Belote, Tarot, Skyjo, Uno, Scrabble, Pétanque,
Cornhole, Ligretto, Mille Sabords, 5 Rois, Fléchettes 301, 6 qui prend,
Hilo, Speedbac, Palet, Pili Pili, Flip 7, lancer de dés, et un mode
libre pour inventer vos propres règles de score.

✓ Calcul automatique des points, bonus et malus
✓ Respecte les règles officielles de chaque jeu
✓ Historique de toutes vos parties, conservé sur votre appareil
✓ Statistiques par joueur
✓ Fonctionne hors ligne, aucune connexion nécessaire
✓ Aucune donnée envoyée à un serveur, aucune publicité

Fini les manches recomptées trois fois et les feuilles de score
perdues au fond d'une boîte de jeu : Scorup s'occupe des calculs,
vous vous occupez de jouer.
```

*(Nombre de caractères ~1000 — largement dans les 4000 permis par Google. Sur iOS, vise plutôt 1500-2000 caractères, Apple valorise moins le remplissage massif.)*

Ajoute en fin de description Play Store, si tu veux capter les recherches longues :
`Compatible avec les soirées jeux entre amis et en famille.`

---

## 7bis. Textes pour les screenshots (accroches courtes)

À poser en surimpression sur chaque capture (Figma/Canva), pas un champ à remplir dans App Store Connect — juste le texte marketing sur l'image elle-même.

| Écran | Accroche | Sous-ligne (optionnelle) |
|---|---|---|
| Accueil | Tous vos jeux, un seul endroit | Belote, Tarot, Skyjo, Uno, Scrabble... et bien d'autres |
| Paramètres du jeu | Une partie prête en 30 secondes | Joueurs, équipes, règles : tout se configure en un instant |
| Tableau de score | Le calcul, c'est pour nous | Bonus, malus, manches : tout est automatique |
| Popin finale | Le classement, sans discussion possible | Fini les comptes refaits trois fois |
| Historique | Chaque partie, gardée en mémoire | Retrouvez vos scores passés à tout moment |
| Statistique | Qui gagne vraiment, chez vous ? | Vos stats, partie après partie |
| Favoris | Vos joueurs, toujours sous la main | Plus besoin de retaper les noms à chaque partie |

À adapter en EN au moment de faire le jeu de captures anglais si tu publies en anglais.

## 8. Fiche store — EN

Le code contient déjà des traductions `en` dans `src/i18n/index.ts` — l'app est prête à être publiée en anglais aussi.

Dans App Store Connect : App Information → sélecteur de langue → **+ Add Localization** → **English (U.S.)** (pour Name/Subtitle), puis même chose sur la page de version 1.0 (pour Description/Keywords/Screenshots).

- Nom : `Scorup`
- Sous-titre (30 car. max) : `Score & rules for board games`
- Mots-clés (100 car. max) : `uno,skyjo,scrabble,belote,tarot,cornhole,ligretto,scorekeeper,scorepad,game night,family games`
- Description :

```
Scorup replaces pen and paper for all your board game nights.

Pick your game, add your players, and Scorup shows a smart scoresheet
that follows the official rules: automatic point calculation, bonus
and penalty handling, who starts each round, and round-by-round
guidance.

Games included: Belote, Tarot, Skyjo, Uno, Scrabble, Cornhole,
Ligretto, and many more — plus a free mode to build your own scoring
rules for any game.

✓ Automatic scoring, bonuses and penalties
✓ Follows each game's official rules
✓ Full history of your past games, stored on your device
✓ Per-player stats
✓ Works fully offline, no connection needed
✓ No data sent anywhere, no ads

No more recounting a round three times or losing the scoresheet at
the bottom of the game box: Scorup handles the math, you handle
the fun.
```

---

## 9. Classification d'âge / contenu

Aucune violence, aucun contenu adulte, pas de vraies mises d'argent (les jeux de cartes type Belote/Tarot sont juste des compteurs de points, pas du gambling réel) → classification attendue : **4+ (Apple)** / **PEGI 3 (Google)**. Remplis quand même le questionnaire officiel sur chaque store, les réponses sont déclaratives et engagent ta responsabilité.

---

## 10. Checklist finale avant soumission

- [ ] `android.package` corrigé dans `app.json` (plus de `com.anonymous`)
- [ ] Politique de confidentialité rédigée, hébergée, URL en main
- [ ] Compte Google Play Console créé (25$ payés) + vérification d'identité (pièce d'identité + justificatif d'adresse) validée
- [ ] Compte Apple Developer actif (99$/an payé)
- [ ] Test fermé Google 12 testeurs / 14 jours lancé **en tout premier** (c'est le facteur le plus long de tout le planning)
- [ ] `eas.json` → `submit.production` complété (Apple ID / ASC App ID / service account Google)
- [ ] Google service account JSON généré et ajouté au `.gitignore`
- [ ] Screenshots réels capturés (6.9" iPhone + 13" iPad + Android)
- [ ] Feature graphic Android 1024×500 créé
- [ ] `npx expo-doctor` lancé pour vérifier le Privacy Manifest iOS
- [ ] Fiche store FR rédigée et relue (titre, sous-titre/description courte, mots-clés, description longue)
- [ ] Questionnaire Data Safety (Google) + App Privacy (Apple) rempli
- [ ] Questionnaire de classification d'âge rempli sur les deux stores
- [ ] `eas build --platform all --profile production`
- [ ] `eas submit --platform ios --latest` puis `eas submit --platform android --latest`
- [ ] iOS : build sélectionné en App Store Connect + soumis à App Review
- [ ] Android : release passée de la track interne à la track de production

---

### Sources consultées (à recontrôler, ces pages bougent)

- [Apple App Store screenshot sizes & guidelines (2026)](https://www.mobileaction.co/guide/app-screenshot-sizes-and-guidelines-for-the-app-store/)
- [App Store Connect Release Checklist 2026](https://appscreens.com/blog/app-store-connect-release-checklist)
- [Google Play target API level requirements](https://support.google.com/googleplay/android-developer/answer/11926878?hl=en)
- [Google Play Data Safety Form 2026](https://respectlytics.com/blog/google-play-data-safety-guide/)
- [Expo — Submit to app stores](https://docs.expo.dev/deploy/submit-to-app-stores/)
- [Expo — Submit to Google Play with EAS Submit](https://docs.expo.dev/submit/android/)
- [Apple Developer Program cost 2026](https://magora-systems.com/apple-developer-fee/)
- [Google Play Console registration fee 2026](https://afkarsoftware.com/en/blog-detail/google-play-console-account-2026-one-time-25-fee/)
- [Everything about the 12 testers requirement — Google Play Developer Community](https://support.google.com/googleplay/android-developer/community-guide/255621488/everything-about-the-12-testers-requirement?hl=en)
- [Android developer verification — rolling out to all developers (Android Developers Blog, 2026)](https://android-developers.googleblog.com/2026/03/android-developer-verification-rolling-out-to-all-developers.html)
- [Verify your developer identity information — Play Console Help](https://support.google.com/googleplay/android-developer/answer/10841920?hl=en)
- [Apple Developer Program Enrollment: Step-by-Step (2026)](https://www.applefy.tech/blog/apple-developer-program-enrollment)
- [ASO best practices 2026 — Apptweak](https://www.apptweak.com/en/aso-blog/app-store-optimization-aso-best-practices)
