# Carrousel Meta : pack Static Strength

Deux carrousels pour un test A/B d'accroche. Seule l'ouverture change, le reste est identique.

- **A** : 7 cartes, accroche « Tuck to straddle feels like a wall / Because it is one. » (`A/01.png` à `A/07.png`)
- **B** : 6 cartes, accroche « “It was hard” is not a number. » (`B/01.png` à `B/06.png`)

Format : images carrées 1080×1080, placements Fil Facebook et Instagram. Pour les Stories et les Reels, utilise la vidéo motion.

## Ordre des cartes

| A | B | Carte | Rôle |
|---|---|---|---|
| 1 | | Le mur tuck → straddle | Accroche A : le prospect se reconnaît |
| | 1 | « It was hard » is not a number | Accroche B : il s'entraîne au ressenti |
| 2 | 2 | Quatre marches, le saut 2 → 3 | Le mur existe, il a une taille |
| 3 | | « It was hard » + la règle | La cause : aucun chiffre pour savoir quand monter |
| 4 | 3 | An instrument, not a guess | La solution : l'échelle de 1 à 10 |
| 5 | 4 | How hard. How much. When. | Les 3 tomes et ce que chacun apporte |
| 6 | 5 | What readers say | Deux avis 5 étoiles, mot pour mot |
| 7 | 6 | L'offre | Prix, contenu, garantie, bouton |

## Texte principal

**A**

```
Tuck to straddle feels like a wall because it is one: the biggest jump in the whole progression.

Static Strength is a 3-ebook method for planche and front lever. A 1–10 scale for static holds tells you exactly when to progress, so you stop guessing.

All three for $44.99 ($99.99 separately). 14-day money-back guarantee.
```

**B**

```
"It was hard" is not a number. Train static holds by feel and you never know when you're ready to move up.

Static Strength is a 3-ebook method for planche and front lever: how hard (a 1–10 scale), how much (volume, with an Excel calculator) and when (weeks and months, structured).

All three for $44.99 ($99.99 separately). 14-day money-back guarantee.
```

Les 125 premiers caractères portent l'accroche : c'est la partie visible avant « Voir plus ».

## Titre et description de chaque carte

| Carte | Titre (≤ 40 car.) | Description |
|---|---|---|
| A1 | Stuck between tuck and straddle? | Planche & front lever |
| B1 | Your effort needs a number | Planche & front lever |
| Marches | The jump between steps 2 and 3 | Static Strength method |
| Règle (A3) | Feel can't tell you when to move up | Measure, don't guess |
| Instrument | A 1–10 scale for static holds | Know when to progress |
| 3 tomes | How hard. How much. When. | 3 ebooks + calculator |
| Avis | What readers say | Reader reviews |
| Offre | All 3 ebooks: $44.99 | $99.99 separately |

Bouton d'action : **Shop Now**.

## Liens

- A : `https://maximecalisthenics.com/?utm_source=meta&utm_medium=paid_social&utm_campaign=static_strength_pack&utm_content=carousel_a`
- B : `https://maximecalisthenics.com/?utm_source=meta&utm_medium=paid_social&utm_campaign=static_strength_pack&utm_content=carousel_b`

## Réglages Meta

- Désactive « Afficher automatiquement les cartes les plus performantes en premier » : le carrousel raconte une histoire, l'ordre compte.
- Désactive la carte de fin avec ta photo de profil : le carrousel se termine sur l'offre.
- Mets A et B dans le même ensemble de publicités, avec le même budget. Attends au moins 1 000 impressions par version avant de juger, puis garde celle qui a le coût par achat le plus bas.

## Ce qui est volontairement absent

- L'avis signé « Louval » : c'est ton nom de famille. S'il vient de toi ou d'un proche, il ne peut pas servir de témoignage client.
- L'avis d'Ethan.SW : il est en français et noté 4 étoiles. Il reste utilisable dans une version française, avec sa note réelle.
- Toute statistique ou promesse de résultat absente de tes visuels et de tes réponses.

## Version vidéo (Reels et Stories)

`video/reel_A_9x16.mp4` : le carrousel A en motion design, 27,5 s, 1080×1920, H.264, 30 i/s. Même ordre que les cartes : le mur, les quatre marches, la règle, l'instrument, les 3 tomes, les avis, l'offre.

- Placements : Reels et Stories Instagram et Facebook. Le carrousel reste la version pour le fil.
- Texte principal : celui du carrousel A.
- Image de couverture : `video/reel_A_cover.png` (image 75, l'accroche complète).
- Son : la vidéo est muette. `video/reel_A_cues.csv` donne l'image de chaque effet si tu ajoutes une musique dans le Gestionnaire de publicités ou dans CapCut.
- Régénérer : `cd motion-ad/video && ./scripts/render-reel.sh`

## Régénérer les images

```bash
cd motion-ad/video
npm install
./scripts/prepare.sh
node scripts/carousel.mjs
```

Le code des cartes est dans `motion-ad/video/src/carousel/`.
