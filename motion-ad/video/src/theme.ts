import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';
import type React from 'react';

export const C = {
  bg: '#EFEDE7',
  ink: '#121518',
  red: '#D63C1E',
  surface: '#E4DED8',
  lines: '#A8A6A0',
  dots: '#C6C4BE',
  muted: '#7C7C76',
  glowI: '#D85632',
  glowV: '#42C6CC',
  glowP: '#9E65CB',
};

export const HEAD = "'Bebas Neue', 'Arial Narrow', sans-serif";
export const BODY = "'Inter', 'Helvetica Neue', Arial, sans-serif";

const FONTS: Array<[string, string, string]> = [
  ['Bebas Neue', 'fonts/bebas-400.woff2', '400'],
  ['Inter', 'fonts/inter-500.woff2', '500'],
  ['Inter', 'fonts/inter-600.woff2', '600'],
];
for (const [family, file, weight] of FONTS) {
  loadFont({family, url: staticFile(file), weight});
}

export const head = (size: number, color = C.ink): React.CSSProperties => ({
  fontFamily: HEAD,
  fontWeight: 400,
  fontSize: size,
  lineHeight: 0.9,
  color,
  whiteSpace: 'nowrap',
});

export const body = (size = 34, color = C.ink, weight = 500): React.CSSProperties => ({
  fontFamily: BODY,
  fontWeight: weight,
  fontSize: size,
  lineHeight: 1.2,
  color,
  whiteSpace: 'nowrap',
});
