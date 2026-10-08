# Pub motion design : pack Static Strength

20 secondes, en 9:16 (Reels, Stories) et en 4:5 (fil d'actualité). Grille de 120 BPM : chaque coupe tombe sur un temps. Le prompt à exécuter est dans `prompt.txt`, les visuels de référence dans `refs/`.

## La trame

| Temps | Scène | À l'écran | Rôle |
|---|---|---|---|
| 0 à 3,5 s | Hook | « YOUR PROBLEM » et les quatre bulles qui tombent sur le temps | Le prospect se reconnaît dès la première image |
| 3,5 à 7 s | Escalier | Quatre marches égales, puis la 3e jaillit : « THEY AREN'T. » | Le mur tuck → straddle prend une taille |
| 7 à 10 s | Règle | « IT WAS HARD » IS NOT A NUMBER ; le curseur erre, puis se verrouille | La cause : on s'entraîne au ressenti |
| 10 à 13,5 s | Instrument | La règle s'enroule en orbite autour du tome Intensité, quatre bénéfices | La solution, montrée comme un outil |
| 13,5 à 20 s | Offre | HOW HARD / HOW MUCH / WHEN, les trois tomes montent, un temps de silence, $44.99, bouton | L'offre, puis l'action |

## Pourquoi cet ordre

- Chaque scène répond à la précédente. La bulle « wall » ouvre l'escalier, la règle devient l'orbite du livre, le livre rejoint le pack : le spectateur suit un seul fil du hook au prix.
- Le mouvement porte l'argument. Des marches égales qui cassent, un curseur qui cherche sa valeur puis la verrouille.
- Un temps de silence précède le prix, et $44.99 tombe dans le vide.
- Le sur-titre « PLANCHE · FRONT LEVER », tiré de ta copy, qualifie l'audience dès l'image 0.
- Le titre « OUR ANSWER » n'apparaît pas : la règle qui s'enroule autour du livre fait ce travail en mouvement.

## À fournir

- `covers/intensity.png`, `volume.png`, `periodization.png` : les trois couvertures à plat. Sans elles, le prompt découpe les livres dans les slides, avec un rendu moins net.
- `audio/music.mp3` : électro sombre et minimale, 120 BPM, attaque sur le premier temps. `audio/sfx/` : `pop`, `tick`, `click`, `impact` en .mp3. Sans audio, la vidéo sort muette avec un fichier de cues pour poser le son ailleurs.

## Lancer

Dans Claude Code, à la racine du repo : « Exécute motion-ad/prompt.txt ». Valide les 9 images de contrôle avant le rendu final.

## Avant diffusion

- « UP TO 55% OFF » doit correspondre aux prix réels des tomes vendus seuls, et « Founding seats, limited » à une limite réelle.
