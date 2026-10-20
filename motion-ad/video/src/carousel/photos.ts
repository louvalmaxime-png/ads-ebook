// Athlete photos for deck C. Files live in motion-ad/photos/ (prepare.sh syncs them
// into public/photos/). Everything below is in the photo's own pixels, so the crop
// and the pencil marks stay pinned to the body whatever the frame on the card.
//   size:   natural width and height of the file.
//   origin: the photo pixel shown at the frame's top-left corner.
//   scale:  card pixels per photo pixel.
//   marks:  pencil question marks as [x, y, rotation°], placed by eye around the
//           shoulders and hips.
export type Photo = {
  src: string;
  size: [number, number];
  origin: [number, number];
  scale: number;
  marks: Array<[number, number, number]>;
};

// Photo 2: front lever on the door bar, white interior.
export const PHOTO_A: Photo | null = {
  // The -nologo file has the prints painted out (sock swooshes, the lettered stripe on
  // both wristbands, the bar end caps): apparel and equipment only, the athlete is
  // untouched. The original sits next to it. Script: nologo_front_lever.py.
  src: 'photos/front-lever-door-bar-nologo.webp',
  size: [600, 700],
  origin: [55, 82], // bar caps and shorts each ~22 px inside the frame, shelf out
  scale: 1.22,
  marks: [
    [509, 470, 8], // right shoulder, on clean wall level with the joint
    [382, 300, 4], // shoulder girdle, between the arms just above the head
    [140, 455, -10], // hips, in the gap left of the glutes
  ],
};

// Photo B: planche on parallettes in the park (DSC05664), effort on the face. Used on
// both halves of card 3 with the same crop: the whole line from head to the frame edge,
// both hands and parallettes, bystanders cut below the face except the one filming,
// who is softened out of focus in the -nologo file. That file also has the prints
// painted out (shorts, a waistband, a cap, a wristband, a parallette base): apparel,
// equipment and a bystander only, the athlete is untouched. Script: nologo_planche.py.
export const PHOTO_B: Photo = {
  src: 'photos/planche-park-nologo.webp',
  size: [1080, 1616],
  origin: [20, 676],
  scale: 540 / 1060,
  marks: [],
};

// Frame-relative mark positions used when no photo is set, so the layout can be judged.
export const PREVIEW_MARKS: Array<[number, number, number]> = [
  [0.3, 0.16, -10],
  [0.66, 0.24, 8],
  [0.47, 0.7, -3],
];
