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
  translations: {
    fr: {
      name: 'Speed Bac',
      description: 'Speed Bac est un jeu d’ambiance rapide où il faut trouver des mots correspondant à une catégorie et une lettre donnée.',
      detailedRules: `
1. Description

Speedbac, c'est un p'tit bac en super rapide ! Débarrassez-vous de vos lettres en répondant plus vite que les autres à des thèmes délirants, trash et épicés.
Des centaines de thèmes délirants entre adultes (C'est long & dur, Ça ferait du bien à mon voisin de droite, Un prénom de beauf, On y va sans les enfants...)
Speedbac est un jeu d'ambiance drôle mais pas vulgaire qui stimule la répartie et l'humour.

Parfait entre potes & adultes !

---

2. Comment on joue ?

Speedbac est un jeu de rapidité de 2 à 7 joueurs.
Chacun commence avec 5 cartes Lettre en main. On pioche une carte thème, et chacun cherche alors le plus vite possible une réponse qui commence par l'une de ces lettres.
Soyez rapides car 3 réponses sont acceptées par tour, pas plus !

Mais attention : si la majorité refuse votre réponse, vous reprenez votre lettre et en piochez une autre en pénalité. Le premier qui pose toutes ses lettres gagne !

---

3. Points forts :

 - Des règles qui s'expliquent en 1 minute,
 - Des parties ultra rapides et nerveuses,
 - 224 thèmes loufoques, des réponses incongrues... des débats hilarants !
`,
    },
    en: {
      name: 'Speed Bac',
      description: 'Speed Bac is a fast-paced party game where you have to find words matching a given category and letter.',
      detailedRules: `
1. Description

Speedbac is a lightning-fast game of "le bac" (Scattergories)! Get rid of your letters by coming up with answers faster than everyone else, on themes that are wild, cheeky, and spicy.
Hundreds of outrageous adult themes ("Long & Hard", "Something My Neighbor Could Use", "A Redneck's First Name", "Let's Leave the Kids at Home...")
Speedbac is a fun party game — cheeky but never vulgar — that gets everyone's wit and humor flowing.

Perfect with friends & adults!

---

2. How do you play?

Speedbac is a speed game for 2 to 7 players.
Everyone starts with 5 Letter cards in hand. A theme card is drawn, and everyone races to come up with an answer starting with one of those letters as fast as possible.
Be quick, because only 3 answers are accepted per round — no more!

But watch out: if the majority rejects your answer, you take your letter back and draw another one as a penalty. The first player to play all their letters wins!

---

3. Highlights:

 - Rules you can explain in 1 minute,
 - Ultra-fast, high-energy rounds,
 - 224 wacky themes, absurd answers... hilarious debates!
`,
    },
  },
  detailedRules: `
1. Description

Speedbac, c'est un p'tit bac en super rapide ! Débarrassez-vous de vos lettres en répondant plus vite que les autres à des thèmes délirants, trash et épicés.
Des centaines de thèmes délirants entre adultes (C'est long & dur, Ça ferait du bien à mon voisin de droite, Un prénom de beauf, On y va sans les enfants...) 
Speedbac est un jeu d'ambiance drôle mais pas vulgaire qui stimule la répartie et l'humour.

Parfait entre potes & adultes !

---

2. Comment on joue ?

Speedbac est un jeu de rapidité de 2 à 7 joueurs.
Chacun commence avec 5 cartes Lettre en main. On pioche une carte thème, et chacun cherche alors le plus vite possible une réponse qui commence par l'une de ces lettres.
Soyez rapides car 3 réponses sont acceptées par tour, pas plus !

Mais attention : si la majorité refuse votre réponse, vous reprenez votre lettre et en piochez une autre en pénalité. Le premier qui pose toutes ses lettres gagne !

---

3. Points forts :

 - Des règles qui s'expliquent en 1 minute,
 - Des parties ultra rapides et nerveuses,
 - 224 thèmes loufoques, des réponses incongrues... des débats hilarants !
`,
};