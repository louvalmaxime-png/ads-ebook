import React from 'react';
import {Img, staticFile} from 'remotion';
import {lerp} from '../anim';

// A hardcover built from a flat 2:3 cover: front board, spine, page block.
export type Pose = {cx: number; cy: number; h: number; rx: number; ry: number; rz: number};

export const lerpPose = (a: Pose, b: Pose, t: number): Pose => ({
  cx: lerp(a.cx, b.cx, t),
  cy: lerp(a.cy, b.cy, t),
  h: lerp(a.h, b.h, t),
  rx: lerp(a.rx, b.rx, t),
  ry: lerp(a.ry, b.ry, t),
  rz: lerp(a.rz, b.rz, t),
});

const BOARD = '#15181C';
const face: React.CSSProperties = {position: 'absolute', left: 0, top: 0, backfaceVisibility: 'hidden'};
const PAPER: [string, string] = ['#F3EFE7', '#DDD7CC'];
const pages = (dir: 'to right' | 'to bottom', [light, dark]: [string, string]) =>
  `repeating-linear-gradient(${dir}, rgba(60,50,40,0.10) 0 1px, rgba(0,0,0,0) 1px 3px),` +
  `linear-gradient(${dir}, #23262A 0 7%, ${light} 7%, ${dark} 93%, #23262A 93% 100%)`;
const HINGE =
  'linear-gradient(to right, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 1.4%, rgba(255,255,255,0.09) 2.6%, rgba(0,0,0,0.32) 3.8%, rgba(0,0,0,0) 6.5%)';
const SHEEN =
  'linear-gradient(118deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 36%, rgba(0,0,0,0) 68%, rgba(0,0,0,0.16) 100%)';

// sheen / hinge: studio highlight and spine crease drawn over the board; both off where
// the artwork must stay exactly as supplied. persp: camera distance in book heights.
// paper: page-block tones, darker where the book stands on a light ground.
export const Book3D: React.FC<{
  src: string;
  pose: Pose;
  filter?: string;
  opacity?: number;
  sheen?: boolean;
  hinge?: boolean;
  persp?: number;
  paper?: [string, string];
}> = ({src, pose, filter, opacity = 1, sheen = true, hinge = true, persp = 5, paper = PAPER}) => {
  const {h} = pose;
  const w = (h * 2) / 3;
  const t = h * 0.075;
  const inset = h * 0.008;
  return (
    <div style={{position: 'absolute', left: pose.cx - w / 2, top: pose.cy - h / 2, width: w, height: h, filter, opacity}}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transformStyle: 'preserve-3d',
          transform: `perspective(${h * persp}px) rotateZ(${pose.rz}deg) rotateX(${pose.rx}deg) rotateY(${pose.ry}deg)`,
        }}
      >
        <div style={{...face, width: w, height: h, background: BOARD, borderRadius: 3, transform: `translateZ(${-t / 2}px) rotateY(180deg)`}} />
        <div
          style={{
            ...face,
            left: w - inset - t / 2,
            top: inset,
            width: t,
            height: h - 2 * inset,
            background: pages('to right', paper),
            transform: 'rotateY(90deg)',
          }}
        />
        <div
          style={{
            ...face,
            top: inset - t / 2,
            width: w - inset,
            height: t,
            background: pages('to bottom', paper),
            transform: 'rotateX(90deg)',
          }}
        />
        <div
          style={{
            ...face,
            top: h - inset - t / 2,
            width: w - inset,
            height: t,
            background: pages('to bottom', paper),
            transform: 'rotateX(-90deg)',
          }}
        />
        <div
          style={{
            ...face,
            left: -t / 2 + 0.6, // a hair inside the board so no ground shows through the joint
            width: t,
            height: h,
            background: 'linear-gradient(to right, #0B0D10 0%, #262A30 48%, #0B0D10 100%)',
            transform: 'rotateY(-90deg)',
          }}
        />
        <div
          style={{
            ...face,
            width: w,
            height: h,
            overflow: 'hidden',
            borderRadius: '2px 4px 4px 2px',
            background: BOARD,
            transform: `translateZ(${t / 2}px)`,
          }}
        >
          <Img src={staticFile(src)} style={{width: '100%', height: '100%', display: 'block', objectFit: 'cover'}} />
          {hinge && <div style={{position: 'absolute', inset: 0, background: HINGE}} />}
          {sheen && <div style={{position: 'absolute', inset: 0, background: SHEEN}} />}
        </div>
      </div>
    </div>
  );
};
