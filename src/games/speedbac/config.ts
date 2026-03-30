import { GameConfig } from '../../core/types';

export const speedbacConfig: GameConfig = {
  name: 'SPEED BAC',
  minPlayers: 2,
  maxPlayers: 7,
  estimatedDuration: 15,
  age:'+7',
  category: 'Jeu de lettre',
  scoreLimit: 40,
  lowestScoreWins: false,
  description: 'Speed Bac est un jeu d’ambiance rapide où il faut trouver des mots correspondant à une catégorie et une lettre donnée.',
  image: require('./asset/logo.png'), // ✅ image locale au module
  detailedRules: `
1. Description

Speedbac, c'est un p'tit bac en super rapide ! Débarrassez-vous de vos lettres en répondant plus vite que les autres à des thèmes délirants, trash et épicés.
Des centaines de thèmes délirants entre adultes (C'est long & dur, Ça ferait du bien à mon voisin de droite, Un prénom de beauf, On y va sans les enfants...) 
Speedbac est un jeu d'ambiance drôle mais pas vulgaire qui stimule la répartie et l'humour.

Parfait entre potes & adultes !


2. Comment on joue ?

Speedbac est un jeu de rapidité de 2 à 7 joueurs.
Chacun commence avec 5 cartes Lettre en main. On pioche une carte thème, et chacun cherche alors le plus vite possible une réponse qui commence par l'une de ces lettres.
Soyez rapides car 3 réponses sont acceptées par tour, pas plus !

Mais attention : si la majorité refuse votre réponse, vous reprenez votre lettre et en piochez une autre en pénalité. Le premier qui pose toutes ses lettres gagne !

3. Points forts :
 - Des règles qui s'expliquent en 1 minute,
 - Des parties ultra rapides et nerveuses,
 - 224 thèmes loufoques, des réponses incongrues... des débats hilarants !
`,
};