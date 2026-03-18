import { Language } from '../theme/ThemeContext';

const translations = {
  fr: {
    // Navigation
    home: 'Accueil',
    history: 'Historique',
    settings: 'Paramètres',
    about: 'A propos',

    // HomeScreen
    gameList: 'LISTE DE JEUX',
    searchPlaceholder: 'Rechercher un jeu...',
    noResult: 'Aucun jeu trouvé',
    supportMe: 'Soutenez moi',
    freeApp: 'Scorio est une application gratuite et sans pub.\nSi vous aimez cette application',

    // NewGameScreen
    players: 'JOUEURS',
    teams: 'ÉQUIPES',
    gameSettings: 'PARAMÈTRES DE LA PARTIE',
    gameRules: 'RÈGLES DU JEU',
    addPlayer: 'Ajouter un joueur',
    add: 'Ajouter',
    playerName: 'Nom du joueur',
    scoreLimit: 'Limite de score',
    announcements: 'Annonces',
    newGame: 'Nouvelle Partie',
    hideRules: 'Masquer les règles',
    showRules: 'Voir les règles complètes',

    // ScoreboardScreen
    addRound: 'Ajouter une manche',
    finish: 'terminer',
    rules: 'Règles',
    quitGame: 'Quitter la partie ?',
    progressLost: 'Votre progression sera perdue.',
    yes: 'Oui',
    no: 'Non',

    // HistoryScreen
    noGameFound: 'Aucune partie trouvée',
    startFirst: 'Lance ta première partie !',
    adjustFilters: 'Modifie les filtres pour voir plus de résultats.',
    filterGames: 'Filtrer les parties',
    game: 'Jeu',
    date: 'Date',
    allGames: 'Tous les jeux',
    reset: 'Réinitialiser',
    apply: 'Appliquer',
    clearDate: 'Effacer',
    clearHistory: 'Effacer l\'historique',
    clearHistoryMsg: 'Toutes les parties seront supprimées définitivement.',
    cancel: 'Annuler',
    clear: 'Effacer',

    // EndGameModal
    gameOver: 'Partie Terminée',
    finalRanking: 'Voici le classement final',
    winner: 'VAINQUEUR',
    replay: 'Rejouer',
    backHome: 'Retour à l\'accueil',

    // UnoScoreModal
    round: 'Manche',
    enterScore: 'Saisissez le score de',
    validate: 'Valider',
    announceLabel: 'Annonces',

    // ScoreLimitModal
    scoreLimitTitle: 'LIMITE DE SCORE',
    scoreLimitSubtitle: 'Points requis pour terminer la partie',

    // SettingsScreen
    language: 'LANGUE',
    appearance: 'APPARENCE',
    darkMode: 'Mode sombre',
    french: 'Français',
    english: 'English',

    // AboutScreen
    description: 'Scorio est une application de gestion de scores pour vos jeux de société préférés.',
  },
  en: {
    // Navigation
    home: 'Home',
    history: 'History',
    settings: 'Settings',
    about: 'About',

    // HomeScreen
    gameList: 'GAME LIST',
    searchPlaceholder: 'Search a game...',
    noResult: 'No game found',
    supportMe: 'Support me',
    freeApp: 'Scorio is a free app with no ads.\nIf you enjoy this app',

    // NewGameScreen
    players: 'PLAYERS',
    teams: 'TEAMS',
    gameSettings: 'GAME SETTINGS',
    gameRules: 'GAME RULES',
    addPlayer: 'Add a player',
    add: 'Add',
    playerName: 'Player name',
    scoreLimit: 'Score limit',
    announcements: 'Announcements',
    newGame: 'New Game',
    hideRules: 'Hide rules',
    showRules: 'View full rules',

    // ScoreboardScreen
    addRound: 'Add a round',
    finish: 'finish',
    rules: 'Rules',
    quitGame: 'Quit the game?',
    progressLost: 'Your progress will be lost.',
    yes: 'Yes',
    no: 'No',

    // HistoryScreen
    noGameFound: 'No game found',
    startFirst: 'Start your first game!',
    adjustFilters: 'Adjust the filters to see more results.',
    filterGames: 'Filter games',
    game: 'Game',
    date: 'Date',
    allGames: 'All games',
    reset: 'Reset',
    apply: 'Apply',
    clearDate: 'Clear',
    clearHistory: 'Clear history',
    clearHistoryMsg: 'All games will be permanently deleted.',
    cancel: 'Cancel',
    clear: 'Clear',

    // EndGameModal
    gameOver: 'Game Over',
    finalRanking: 'Here is the final ranking',
    winner: 'WINNER',
    replay: 'Play again',
    backHome: 'Back to home',

    // UnoScoreModal
    round: 'Round',
    enterScore: 'Enter the score for',
    validate: 'Confirm',
    announceLabel: 'Announcements',

    // ScoreLimitModal
    scoreLimitTitle: 'SCORE LIMIT',
    scoreLimitSubtitle: 'Points required to end the game',

    // SettingsScreen
    language: 'LANGUAGE',
    appearance: 'APPEARANCE',
    darkMode: 'Dark mode',
    french: 'Français',
    english: 'English',

    // AboutScreen
    description: 'Scorio is a score tracking app for your favorite board games.',
  },
};

export function useTranslation(language: Language) {
  return translations[language];
}

export type TranslationKeys = keyof typeof translations.fr;
