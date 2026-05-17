import { Language } from '../theme/ThemeContext';

const translations = {
  fr: {
    // Navigation
    home: 'Accueil',
    history: 'Historique',
    playersMenu: 'Mes joueurs favoris',
    statistics: 'Statistiques',
    settings: 'Paramètres',
    about: 'A propos',

    // HomeScreen
    gameList: 'LISTE DE JEUX',
    searchPlaceholder: 'Rechercher un jeu...',
    noResult: 'Aucun jeu trouvé',
    supportMe: 'Laisser un commentaire',
    freeApp: 'Cette application évolue régulièrement grâce à vous. Partagez nous vos idées et/ou les problèmes rencontrés, afin de nous permettre d\'améliorer l\'expérience de jeu',

    // NewGameScreen
    players: 'JOUEURS',
    teams: 'ÉQUIPES',
    gameSettings: 'PARAMÈTRES DE LA PARTIE',
    gameRules: 'RÈGLES DU JEU',
    addPlayer: 'Ajouter un joueur',
    add: 'Ajouter',
    playerName: 'Nom du joueur',
    scoreLimit: 'Limite de score',
    roundLimit: 'Nombre de manches',
    announcements: 'Annonces',
    play: 'JOUER',
    newGame: 'Nouvelle Partie',
    hideRules: 'Masquer les règles',
    showRules: 'Voir les règles complètes',

    // ScoreboardScreen
    addRound: 'Ajouter une manche',
    finish: 'terminer',
    endGameBtn: 'Terminer la partie',
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
    month: 'Mois',
    year: 'Année',
    allGames: 'Tous les jeux',
    reset: 'Réinitialiser',
    apply: 'Appliquer',
    clearDate: 'Effacer',
    seeMore: 'Voir plus',
    seeLess: 'Voir moins',
    clearHistory: 'Effacer l\'historique',
    clearHistoryMsg: 'Toutes les parties seront supprimées définitivement.',
    cancel: 'Annuler',
    clear: 'Effacer',

    // EndGameModal
    gameOver: 'Partie Terminée',
    finalRanking: 'Voici le classement final',
    winner: 'VAINQUEUR',
    replay: 'Rejouer',
    backHome: 'Retour à la page jeu',

    // EditScoreModal
    round: 'Manche',
    enterScore: 'Saisissez le score de',
    validate: 'Valider',
    announceLabel: 'Annonces',

    // ScoreLimitModal / RoundLimitModal
    scoreLimitTitle: 'LIMITE DE SCORE',
    scoreLimitSubtitle: 'Points requis pour terminer la partie',
    roundLimitTitle: 'NOMBRE DE MANCHES',
    roundLimitSubtitle: 'Nombre de manches pour terminer la partie',

    // Mode Libre – nom du jeu
    gameNameLabel: 'NOM DU JEU',
    freeGameDefaultName: 'Mode jeu libre',

    // Mode Libre – condition de victoire
    winnerMode: 'Condition de victoire',
    highestWins: 'Score le plus élevé',
    lowestWins: 'Score le plus bas',

    // Mode Libre – limite de temps
    timeLimit: 'Limite de temps',
    noLimit: 'Pas de limite',
    timeLimitTitle: 'LIMITE DE TEMPS',
    timeLimitSubtitle: 'Durée maximale de la partie',

    // AboutScreen – feedback
    feedbackTitle: 'Laisser un commentaire',
    feedbackSubtitle: 'Une suggestion, un bug ? Écrivez-nous.',
    feedbackCategory: 'SUJET',
    feedbackCategoryPlaceholder: 'Choisir un sujet...',
    feedbackTextPlaceholder: 'Votre message...',
    feedbackSend: 'Envoyer',
    feedbackSuccess: 'Message envoyé ! Merci pour votre retour.',
    feedbackErrorCategory: 'Veuillez choisir un sujet.',
    feedbackErrorText: 'Le message doit contenir au moins 10 caractères.',
    feedbackErrorGeneral: 'Une erreur est survenue. Réessayez.',
    feedbackCatNewGame: 'Nouveau jeu',
    feedbackCatBug: 'Bug sur l\'application',
    feedbackCatOther: 'Autres',

    // SettingsScreen
    language: 'LANGUE',
    appearance: 'APPARENCE',
    darkMode: 'Mode sombre',
    french: 'Français',
    english: 'English',

    // PlayersScreen
    favoritePlayers: 'JOUEURS FAVORIS',
    noFavorites: 'Aucun joueur favori',
    noFavoritesHint: 'Ajoutez les joueurs avec qui vous jouez régulièrement pour les retrouver facilement.',
    addFavorite: 'Ajouter un joueur',
    editFavorite: 'Modifier le joueur',
    save: 'Enregistrer',
    confirmDeletePlayer: 'Supprimer ce joueur des favoris ?',
    deletePlayer: 'Supprimer',
    fromFavorites: 'FAVORIS',

    // StatsScreen
    comingSoon: 'Bientôt disponible',
    statsHint: 'Retrouvez bientôt vos statistiques de parties : victoires, scores moyens, jeux favoris et bien plus.',
    statsAllGames: 'Tous',
    statsTotalGames: 'Parties totales',
    statsMostPlayed: 'Jeu favori',
    statsMostActive: 'Meilleur joueur',
    statsPlayerRanking: 'CLASSEMENT JOUEURS',
    statsGamesSection: 'LISTE DES JEUX',
    statsVictories: 'Victoires',
    statsVictories2: 'vic.',
    statsWinRate: 'Taux de victoires',
    statsAvgScore: 'Moy.',
    statsBestScore: 'Max',
    statsStreak: 'Série',
    statsTopPlayer: 'Top joueur',
    statsNoHistory: 'Aucune partie jouée',
    statsNoHistoryHint: 'Jouez votre première partie pour voir vos statistiques ici.',
    statsParties: 'Parties',
    statsParties2: 'part.',
    statsOther: 'Autre',
    statsSur: 'sur',

    // AboutScreen
    description: 'Scorio est une application de gestion de scores pour vos jeux de société préférés.',
    aboutBio: "Développeur freelance, j'ai créé Scorio pour le simple plaisir de jouer à des jeux de société avec mes amis. C'est un projet personnel, développé avec passion — sans publicité, sans abonnement.",
    aboutDonate: 'Soutenir le projet',
    aboutDonateHint: "Scorio est une application gratuite et sans pub. Si elle vous plaît, vous pouvez soutenir son développement en faisant un don. C'est entièrement facultatif, mais chaque contribution est vraiment appréciée !",
    aboutDonateCTA: 'Faire un don',
  },
  en: {
    // Navigation
    home: 'Home',
    history: 'History',
    playersMenu: 'Players',
    statistics: 'Statistics',
    settings: 'Settings',
    about: 'About',

    // HomeScreen
    gameList: 'GAME LIST',
    searchPlaceholder: 'Search a game...',
    noResult: 'No game found',
    supportMe: 'Send a comment',
    freeApp: 'This app is constantly evolving thanks to you. Please share your ideas and/or any issues you’ve encountered with us, so that we can improve the gaming experience.',

    // NewGameScreen
    players: 'PLAYERS',
    teams: 'TEAMS',
    gameSettings: 'GAME SETTINGS',
    gameRules: 'GAME RULES',
    addPlayer: 'Add a player',
    add: 'Add',
    playerName: 'Player name',
    scoreLimit: 'Score limit',
    roundLimit: 'Number of rounds',
    announcements: 'Announcements',
    play: 'PLAY',
    newGame: 'New Game',
    hideRules: 'Hide rules',
    showRules: 'View full rules',

    // ScoreboardScreen
    addRound: 'Add a round',
    finish: 'finish',
    endGameBtn: 'End game',
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
    month: 'Month',
    year: 'Year',
    allGames: 'All games',
    reset: 'Reset',
    apply: 'Apply',
    clearDate: 'Clear',
    seeMore: 'See more',
    seeLess: 'See less',
    clearHistory: 'Clear history',
    clearHistoryMsg: 'All games will be permanently deleted.',
    cancel: 'Cancel',
    clear: 'Clear',

    // EndGameModal
    gameOver: 'Game Over',
    finalRanking: 'Here is the final ranking',
    winner: 'WINNER',
    replay: 'Play again',
    backHome: 'Back to game page',

    // EditScoreModal
    round: 'Round',
    enterScore: 'Enter the score for',
    validate: 'Confirm',
    announceLabel: 'Announcements',

    // ScoreLimitModal / RoundLimitModal
    scoreLimitTitle: 'SCORE LIMIT',
    scoreLimitSubtitle: 'Points required to end the game',
    roundLimitTitle: 'NUMBER OF ROUNDS',
    roundLimitSubtitle: 'Number of rounds to end the game',

    // Free Mode – game name
    gameNameLabel: 'GAME NAME',
    freeGameDefaultName: 'Free game',

    // Free Mode – winner condition
    winnerMode: 'Winner condition',
    highestWins: 'Highest score',
    lowestWins: 'Lowest score',

    // Free Mode – time limit
    timeLimit: 'Time limit',
    noLimit: 'No limit',
    timeLimitTitle: 'TIME LIMIT',
    timeLimitSubtitle: 'Maximum game duration',

    // AboutScreen – feedback
    feedbackTitle: 'Leave a comment',
    feedbackSubtitle: 'A suggestion or a bug? Write to us.',
    feedbackCategory: 'SUBJECT',
    feedbackCategoryPlaceholder: 'Choose a subject...',
    feedbackTextPlaceholder: 'Your message...',
    feedbackSend: 'Send',
    feedbackSuccess: 'Message sent! Thank you for your feedback.',
    feedbackErrorCategory: 'Please select a subject.',
    feedbackErrorText: 'Message must be at least 10 characters.',
    feedbackErrorGeneral: 'An error occurred. Please try again.',
    feedbackCatNewGame: 'New game',
    feedbackCatBug: 'Bug report',
    feedbackCatOther: 'Other',

    // SettingsScreen
    language: 'LANGUAGE',
    appearance: 'APPEARANCE',
    darkMode: 'Dark mode',
    french: 'Français',
    english: 'English',

    // PlayersScreen
    favoritePlayers: 'FAVORITE PLAYERS',
    noFavorites: 'No favorite players',
    noFavoritesHint: 'Add the players you regularly play with to find them easily.',
    addFavorite: 'Add a player',
    editFavorite: 'Edit player',
    save: 'Save',
    confirmDeletePlayer: 'Remove this player from favorites?',
    deletePlayer: 'Remove',
    fromFavorites: 'FAVORITES',

    // StatsScreen
    comingSoon: 'Coming soon',
    statsHint: 'Find your game statistics soon: wins, average scores, favorite games and much more.',
    statsAllGames: 'All',
    statsTotalGames: 'Total Games',
    statsMostPlayed: 'Fav. game',
    statsMostActive: 'Top player',
    statsPlayerRanking: 'PLAYER RANKING',
    statsGamesSection: 'LIST OF GAMES',
    statsVictories: 'Wins',
     statsVictories2: 'Wins',
    statsWinRate: 'Rate',
    statsAvgScore: 'Avg.',
    statsBestScore: 'Best',
    statsStreak: 'Streak',
    statsTopPlayer: 'Top player',
    statsNoHistory: 'No games played',
    statsNoHistoryHint: 'Play your first game to see your statistics here.',
    statsParties: 'games',
    statsParties2: 'games',
    statsOther: 'Other',
    statsSur: 'out of',

    // AboutScreen
    description: 'Scorio is a score tracking app for your favorite board games.',
    aboutBio: "I'm a freelance developer. I created Scorio for the simple joy of playing board games with friends. It's a personal project, built with passion — no ads, no subscriptions.",
    aboutDonate: 'Support the project',
    aboutDonateHint: "Scorio is a free app with no ads. If you enjoy Scorio, you can support its development by making a donation. It's entirely optional, but every contribution is truly appreciated!",
    aboutDonateCTA: 'Make a donation',
  },
};

export function useTranslation(language: Language) {
  return translations[language];
}

export type TranslationKeys = keyof typeof translations.fr;
