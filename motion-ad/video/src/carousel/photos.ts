// Athlete photos for deck C. Drop the file in motion-ad/photos/ (prepare.sh syncs it
// into public/photos/), then point src at it. Until then the card shows an empty frame.
//   focus: CSS object-position of the crop inside the frame.
//   marks: pencil question marks as [x, y, rotation°], x and y as fractions of the frame,
//          placed by eye on the shoulders and hips of the actual photo.
export type Photo = {src: string; focus: string; marks: Array<[number, number, number]>};

export const PHOTO_A: Photo | null = null;

// Mark positions used while no photo is set, so the layout can be judged.
export const PREVIEW_MARKS: Photo['marks'] = [
  [0.3, 0.16, -10],
  [0.66, 0.24, 8],
  [0.47, 0.7, -3],
];
