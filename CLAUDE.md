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

*Mettre à jour ce fichier quand le stack ou les conventions évoluent.*
