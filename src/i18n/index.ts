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
    contact: 'Contact',

    // Accessibilité (labels lecteur d'écran, boutons icône seule)
    back: 'Retour',
    openMenu: 'Ouvrir le menu',
    closeMenu: 'Fermer le menu',
    close: 'Fermer',
    edit: 'Modifier',
    addFavoritePlayer: 'Ajouter un joueur depuis les favoris',
    removePlayerAction: 'Retirer ce joueur',
    decreaseDiceCount: 'Diminuer le nombre de dés',
    increaseDiceCount: 'Augmenter le nombre de dés',
    decreaseTeamCount: 'Diminuer le nombre d\'équipes',
    increaseTeamCount: 'Augmenter le nombre d\'équipes',
    decreasePlayersPerTeam: 'Diminuer le nombre de joueurs par équipe',
    increasePlayersPerTeam: 'Augmenter le nombre de joueurs par équipe',
    decreaseScore: 'Diminuer le score',
    increaseScore: 'Augmenter le score',
    eraseDigit: 'Effacer le dernier chiffre',
    colorLabel: 'Couleur',

    // HomeScreen
    gameList: 'LISTE DE JEUX',
    searchPlaceholder: 'Rechercher un jeu...',
    noResult: 'Aucun jeu trouvé',
    noResultFreeModeHint: 'Si vous ne trouvez pas votre jeu, utiliser le mode libre',
    noResultRequestGame: 'Ou envoyer nous une demande d\'ajout',
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
    scoreEmpty: 'aucun score',

    // ScoreLimitModal / RoundLimitModal
    scoreLimitTitle: 'LIMITE DE SCORE',
    scoreLimitSubtitle: 'Points requis pour terminer la partie',
    roundLimitTitle: 'NOMBRE DE MANCHES',
    roundLimitSubtitle: 'Nombre de manches pour terminer la partie',

    // Mode Libre – nom du jeu
    gameNameLabel: 'NOM DU JEU',
    freeGameDefaultName: 'Mode jeu libre',
    gameNamePlaceholder: 'Saisissez le nom du jeu',

    // Mode Libre – condition de victoire
    winnerMode: 'Condition de victoire',
    highestWins: 'Score le plus élevé',
    lowestWins: 'Score le plus bas',

    // Mode Libre – limite de temps
    timeLimit: 'Limite de temps',
    noLimit: 'Pas de limite',
    timeLimitTitle: 'LIMITE DE TEMPS',
    timeLimitSubtitle: 'Durée maximale de la partie',

    // Mode Libre – limite de manches
    roundLimitToggleLabel: 'Limite de manches',

    // Mode Libre – équipes
    teamMode: 'Jouer en équipe',
    teamCount: 'Nombre d\'équipes',
    playersPerTeam: 'Joueurs par équipe',

    // Sous-libellés des options (NewGameScreen)
    scoreLimitGoal: 'Objectif en points',
    duration: 'Durée',
    roundCount: 'Nombre de manches',
    rounds: 'manches',

    // AboutScreen – feedback
    feedbackTitle: 'Laisser un commentaire',
    feedbackSubtitle: 'Une suggestion, un bug ? Écrivez-nous.',
    feedbackCategory: 'SUJET',
    feedbackCategoryPlaceholder: 'Choisir un sujet...',
    feedbackTextPlaceholder: 'Votre message...',
    feedbackSend: 'Envoyer',
    feedbackSuccess: 'Votre application mail va s\'ouvrir avec le message pré-rempli. Merci pour votre retour !',
    feedbackErrorCategory: 'Veuillez choisir un sujet.',
    feedbackErrorText: 'Le message doit contenir au moins 10 caractères.',
    feedbackErrorGeneral: 'Aucune application mail configurée sur cet appareil.',
    feedbackCatNewGame: 'Nouveau jeu',
    feedbackCatBug: 'Bug sur l\'application',
    feedbackCatOther: 'Autres',

    // SettingsScreen
    language: 'LANGUE',
    appearance: 'APPARENCE',
    darkMode: 'Mode sombre',
    french: 'Français',
    english: 'English',
    export: 'EXPORTER / IMPORTER',
    exportData: 'Exporter mes données',
    exportDataHint: 'Génère un fichier avec ton historique de parties et tes joueurs favoris, à partager ou sauvegarder où tu veux.',
    exportErrorTitle: 'Export impossible',
    exportErrorMessage: 'Une erreur est survenue pendant l\'export. Réessaie dans quelques instants.',
    importData: 'Importer mes données',
    importDataHint: 'Sélectionne le fichier d\'un export ScorUp pour récupérer ton historique et tes joueurs favoris.',
    importPickFile: 'Choisir un fichier',
    importPicking: 'Sélection en cours...',
    importModeLabel: 'MÉTHODE',
    importModeMerge: 'Fusionner avec mes données actuelles',
    importModeReplace: 'Remplacer toutes mes données',
    importAction: 'Importer',
    importing: 'Import en cours...',
    importErrorTitle: 'Import impossible',
    importErrorMessage: 'Ce fichier ne correspond pas à un export ScorUp valide. Choisis un autre fichier.',
    importReplaceConfirmTitle: 'Remplacer toutes les données ?',
    importReplaceConfirmMessage: 'Ton historique et tes joueurs favoris actuels seront définitivement remplacés par les données importées. Cette action est irréversible.',
    importReplaceConfirmAction: 'Remplacer',
    importSuccessTitle: 'Import terminé',
    importSuccessAdded: 'Ajouté :',
    importSuccessReplaced: 'Données remplacées :',
    importGamesUnit: 'partie(s)',
    importFavoritesUnit: 'joueur(s) favori(s)',
    importAnd: 'et',

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

    // DiceSetupScreen / DiceRollerScreen
    diceCount: 'NOMBRE DE DÉS',
    diceType: 'NOMBRES DE FACES',
    rollAll: 'Lancer tous les dés',
    rollSingle: 'Lancer ce dé',
    diceHint: 'Tape un dé ou lance-les tous',

    // AboutScreen
    description: 'ScorUp est une application de gestion de scores pour vos jeux de société préférés.',
    aboutBio: "Développeur freelance, j'ai créé ScorUp pour le simple plaisir de jouer à des jeux de société avec mes amis. C'est un projet personnel, développé avec passion — sans publicité, sans abonnement.",
    aboutDonate: 'Soutenir le projet',
    aboutDonateHint: "ScorUp est une application gratuite et sans pub. Si elle vous plaît, vous pouvez soutenir son développement en faisant un don. C'est entièrement facultatif, mais chaque contribution est vraiment appréciée !",
    aboutDonateCTA: 'Faire un don',
    donateSheetTitle: 'Choisissez un montant',
    donateProcessing: 'Traitement du paiement…',
    donateSuccessTitle: 'Merci beaucoup !',
    donateSuccessBody: 'Votre don a bien été pris en compte. Merci de soutenir ScorUp 💜',
    donateErrorTitle: 'Le paiement a échoué',
    donateErrorBody: "Une erreur s'est produite, aucune somme n'a été débitée. Réessayez plus tard.",
    donateUnavailable: "Les dons sont momentanément indisponibles. Réessayez plus tard.",
    donateLoadingAmounts: 'Chargement des montants…',
    donateRetry: 'Réessayer',
    donateUnconfirmedBody: "Nous n'avons pas pu confirmer votre don. Si votre compte a été débité, la transaction est bien passée — inutile de réessayer. En cas de doute, vérifiez votre historique d'achats App Store ou écrivez-nous.",
    donatePendingBody: "Votre paiement est en attente de validation (autorisation d'achat ou vérification bancaire). Il se finalisera automatiquement, ne réessayez pas.",

    privacyPolicyTitle: 'Politique de confidentialité',
    privacyPolicyUpdated: 'Dernière mise à jour : 13 août 2026',
    privacyPolicyBody:
      "Cette politique de confidentialité s'applique à l'application mobile Scorup (ci-après « l'Application »), éditée par BODY François (ci-après « l'Éditeur »), disponible sur l'App Store et le Google Play Store.\n\n" +
      "1. Résumé\n" +
      "Scorup ne collecte, n'enregistre sur un serveur, ne transmet et ne vend aucune donnée personnelle. Toutes les informations que vous saisissez restent uniquement sur votre appareil.\n\n" +
      "2. Quelles données sont traitées\n" +
      "L'Application vous permet de créer des parties, d'ajouter des joueurs et de suivre des scores. Ces informations (noms de joueurs, scores, historique de parties, statistiques, préférences d'affichage) sont :\n\n" +
      "• stockées exclusivement en local, sur votre appareil, via le mécanisme de stockage natif du système (AsyncStorage) ;\n" +
      "• jamais transmises à l'Éditeur, à un serveur distant, ni à un tiers ;\n" +
      "• accessibles uniquement par vous, depuis votre appareil.\n\n" +
      "L'Éditeur n'a techniquement accès à aucune de ces données et ne peut ni les consulter, ni les modifier, ni les récupérer.\n\n" +
      "3. Aucun compte, aucune connexion réseau requise\n" +
      "Scorup fonctionne entièrement hors ligne. L'Application ne requiert pas de création de compte et n'effectue aucun appel réseau pour son fonctionnement.\n\n" +
      "4. Publicité, traceurs et services tiers\n" +
      "L'Application ne contient :\n\n" +
      "• aucune publicité ;\n" +
      "• aucun traceur publicitaire ou SDK de mesure d'audience (Google Analytics, Meta SDK, etc.) ;\n" +
      "• aucun service d'achat intégré ;\n" +
      "• aucun partage de données avec des tiers, puisqu'aucune donnée n'est collectée.\n\n" +
      "5. Autorisations demandées sur votre appareil\n" +
      "L'Application ne demande aucune autorisation particulière (pas d'accès à la caméra, à la localisation, aux contacts, au microphone ou aux photos) au-delà de ce qui est strictement nécessaire à son fonctionnement de base.\n\n" +
      "6. Utilisation par des mineurs\n" +
      "Scorup est une application familiale, utilisable par tout âge dans le cadre de jeux de société. Aucune donnée n'étant collectée ni transmise, l'Application ne présente pas de risque spécifique pour les données des mineurs et respecte à ce titre les exigences applicables (RGPD, COPPA) par absence totale de collecte.\n\n" +
      "7. Vos droits\n" +
      "Puisque vos données restent sur votre appareil et ne sont jamais transmises à l'Éditeur, vous en gardez l'entier contrôle : vous pouvez les consulter, les modifier ou les supprimer directement depuis l'Application, ou en désinstallant l'Application (ce qui supprime l'ensemble des données stockées localement).\n\n" +
      "Pour toute question relative à cette politique, vous pouvez contacter l'Éditeur aux coordonnées ci-dessous.\n\n" +
      "8. Modifications de cette politique\n" +
      "Cette politique peut être mise à jour si l'Application évolue (ajout de publicité, de statistiques d'usage, d'une synchronisation en ligne, etc.). En cas de changement significatif dans la nature des données traitées, cette page sera mise à jour et la date de dernière modification en haut de page sera actualisée. Nous vous invitons à la consulter régulièrement.\n\n" +
      "9. Contact\n" +
      "Pour toute question concernant cette politique de confidentialité ou l'Application :\n\n" +
      "Email : scorup.support@gmail.com\n\n" +
      "Scorup — application de feuilles de score pour jeux de société.",
  },
  en: {
    // Navigation
    home: 'Home',
    history: 'History',
    playersMenu: 'Players',
    statistics: 'Statistics',
    settings: 'Settings',
    about: 'About',
    contact: 'Contact',

    // Accessibility (screen reader labels, icon-only buttons)
    back: 'Back',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    close: 'Close',
    edit: 'Edit',
    addFavoritePlayer: 'Add a player from favorites',
    removePlayerAction: 'Remove this player',
    decreaseDiceCount: 'Decrease number of dice',
    increaseDiceCount: 'Increase number of dice',
    decreaseTeamCount: 'Decrease number of teams',
    increaseTeamCount: 'Increase number of teams',
    decreasePlayersPerTeam: 'Decrease players per team',
    increasePlayersPerTeam: 'Increase players per team',
    decreaseScore: 'Decrease score',
    increaseScore: 'Increase score',
    eraseDigit: 'Erase last digit',
    colorLabel: 'Color',

    // HomeScreen
    gameList: 'GAME LIST',
    searchPlaceholder: 'Search a game...',
    noResult: 'No game found',
    noResultFreeModeHint: 'If you can\'t find your game, use free mode',
    noResultRequestGame: 'Or send us a request to add it',
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
    scoreEmpty: 'no score',

    // ScoreLimitModal / RoundLimitModal
    scoreLimitTitle: 'SCORE LIMIT',
    scoreLimitSubtitle: 'Points required to end the game',
    roundLimitTitle: 'NUMBER OF ROUNDS',
    roundLimitSubtitle: 'Number of rounds to end the game',

    // Free Mode – game name
    gameNameLabel: 'GAME NAME',
    freeGameDefaultName: 'Free game',
    gameNamePlaceholder: 'Enter the game name',

    // Free Mode – winner condition
    winnerMode: 'Winner condition',
    highestWins: 'Highest score',
    lowestWins: 'Lowest score',

    // Free Mode – time limit
    timeLimit: 'Time limit',
    noLimit: 'No limit',
    timeLimitTitle: 'TIME LIMIT',
    timeLimitSubtitle: 'Maximum game duration',

    // Free Mode – round limit
    roundLimitToggleLabel: 'Round limit',

    // Free Mode – teams
    teamMode: 'Play in teams',
    teamCount: 'Number of teams',
    playersPerTeam: 'Players per team',

    // Sub-labels for options (NewGameScreen)
    scoreLimitGoal: 'Score target',
    duration: 'Duration',
    roundCount: 'Number of rounds',
    rounds: 'rounds',

    // AboutScreen – feedback
    feedbackTitle: 'Leave a comment',
    feedbackSubtitle: 'A suggestion or a bug? Write to us.',
    feedbackCategory: 'SUBJECT',
    feedbackCategoryPlaceholder: 'Choose a subject...',
    feedbackTextPlaceholder: 'Your message...',
    feedbackSend: 'Send',
    feedbackSuccess: 'Your mail app will open with the message pre-filled. Thanks for your feedback!',
    feedbackErrorCategory: 'Please select a subject.',
    feedbackErrorText: 'Message must be at least 10 characters.',
    feedbackErrorGeneral: 'No mail app is configured on this device.',
    feedbackCatNewGame: 'New game',
    feedbackCatBug: 'Bug report',
    feedbackCatOther: 'Other',

    // SettingsScreen
    language: 'LANGUAGE',
    appearance: 'APPEARANCE',
    darkMode: 'Dark mode',
    french: 'Français',
    english: 'English',
    export: 'EXPORT / IMPORT',
    exportData: 'Export my data',
    exportDataHint: 'Generates a file with your game history and favorite players, ready to share or save anywhere.',
    exportErrorTitle: 'Export failed',
    exportErrorMessage: 'Something went wrong during the export. Please try again in a moment.',
    importData: 'Import my data',
    importDataHint: 'Select the file from a ScorUp export to restore your history and favorite players.',
    importPickFile: 'Choose a file',
    importPicking: 'Selecting...',
    importModeLabel: 'METHOD',
    importModeMerge: 'Merge with my current data',
    importModeReplace: 'Replace all my data',
    importAction: 'Import',
    importing: 'Importing...',
    importErrorTitle: 'Import failed',
    importErrorMessage: 'This file doesn\'t match a valid ScorUp export. Please choose another file.',
    importReplaceConfirmTitle: 'Replace all data?',
    importReplaceConfirmMessage: 'Your current history and favorite players will be permanently replaced by the imported data. This action cannot be undone.',
    importReplaceConfirmAction: 'Replace',
    importSuccessTitle: 'Import complete',
    importSuccessAdded: 'Added:',
    importSuccessReplaced: 'Data replaced:',
    importGamesUnit: 'game(s)',
    importFavoritesUnit: 'favorite player(s)',
    importAnd: 'and',

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

    // DiceSetupScreen / DiceRollerScreen
    diceCount: 'NUMBER OF DICE',
    diceType: 'NUMBER OF FACES',
    rollAll: 'Roll all dice',
    rollSingle: 'Roll this die',
    diceHint: 'Tap a die or roll them all',

    // AboutScreen
    description: 'ScorUp is a score tracking app for your favorite board games.',
    aboutBio: "I'm a freelance developer. I created ScorUp for the simple joy of playing board games with friends. It's a personal project, built with passion — no ads, no subscriptions.",
    aboutDonate: 'Support the project',
    aboutDonateHint: "ScorUp is a free app with no ads. If you enjoy ScorUp, you can support its development by making a donation. It's entirely optional, but every contribution is truly appreciated!",
    aboutDonateCTA: 'Make a donation',
    donateSheetTitle: 'Choose an amount',
    donateProcessing: 'Processing payment…',
    donateSuccessTitle: 'Thank you so much!',
    donateSuccessBody: 'Your donation was successful. Thank you for supporting ScorUp 💜',
    donateErrorTitle: 'Payment failed',
    donateErrorBody: 'Something went wrong, you have not been charged. Please try again later.',
    donateUnavailable: 'Donations are temporarily unavailable. Please try again later.',
    donateLoadingAmounts: 'Loading amounts…',
    donateRetry: 'Try again',
    donateUnconfirmedBody: "We couldn't confirm your donation. If your account was charged, the transaction went through — no need to try again. If you're unsure, check your App Store purchase history or get in touch.",
    donatePendingBody: 'Your payment is awaiting approval (purchase authorisation or bank verification). It will complete automatically — please do not try again.',

    privacyPolicyTitle: 'Privacy Policy',
    privacyPolicyUpdated: 'Last updated: August 13, 2026',
    privacyPolicyBody:
      "This privacy policy applies to the Scorup mobile application (hereafter \"the App\"), published by [Your full legal name] (hereafter \"the Publisher\"), available on the App Store and Google Play Store.\n\n" +
      "1. Summary\n" +
      "Scorup does not collect, store on a server, transmit, or sell any personal data. All information you enter stays solely on your device.\n\n" +
      "2. What data is processed\n" +
      "The App lets you create games, add players, and track scores. This information (player names, scores, game history, statistics, display preferences) is:\n\n" +
      "• stored exclusively locally, on your device, via the system's native storage mechanism (AsyncStorage);\n" +
      "• never transmitted to the Publisher, a remote server, or any third party;\n" +
      "• accessible only by you, from your device.\n\n" +
      "The Publisher has no technical access to any of this data and cannot view, modify, or retrieve it.\n\n" +
      "3. No account, no network connection required\n" +
      "Scorup works entirely offline. The App does not require account creation and makes no network calls for its operation.\n\n" +
      "4. Advertising, trackers and third-party services\n" +
      "The App contains:\n\n" +
      "• no advertising;\n" +
      "• no advertising tracker or audience measurement SDK (Google Analytics, Meta SDK, etc.);\n" +
      "• no in-app purchase service;\n" +
      "• no data sharing with third parties, since no data is collected.\n\n" +
      "5. Permissions requested on your device\n" +
      "The App does not request any specific permissions (no access to the camera, location, contacts, microphone, or photos) beyond what is strictly necessary for its basic operation.\n\n" +
      "6. Use by minors\n" +
      "Scorup is a family-friendly app, usable by all ages for board game scoring. Since no data is collected or transmitted, the App presents no specific risk to minors' data and, on this basis, complies with applicable requirements (GDPR, COPPA) through the total absence of data collection.\n\n" +
      "7. Your rights\n" +
      "Since your data stays on your device and is never transmitted to the Publisher, you retain full control over it: you can view, modify, or delete it directly from the App, or by uninstalling the App (which removes all locally stored data).\n\n" +
      "For any question regarding this policy, you may contact the Publisher using the details below.\n\n" +
      "8. Changes to this policy\n" +
      "This policy may be updated if the App evolves (addition of advertising, usage statistics, online sync, etc.). In the event of a significant change in the nature of the data processed, this page will be updated and the last-modified date at the top will be refreshed. We encourage you to review it periodically.\n\n" +
      "9. Contact\n" +
      "For any question regarding this privacy policy or the App:\n\n" +
      "Email: scorup.support@gmail.com\n\n" +
      "Scorup — scorekeeping app for board games.",
  },
};

export function useTranslation(language: Language) {
  return translations[language];
}

export type TranslationKeys = keyof typeof translations.fr;
