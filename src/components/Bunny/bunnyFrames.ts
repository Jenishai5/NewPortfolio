import type { BunnyState } from './bunny.types';

const BASE = '/bunny';

export const WAVE_FRAMES = [
  `${BASE}/wave/bunny-vawe-1.png`,
  `${BASE}/wave/bunny-vawe-2.png`,
];

export const WALK_FORWARD_FRAMES = [
  `${BASE}/walk/bunny-1.png`,
  `${BASE}/walk/bunny-2.png`,
  `${BASE}/walk/bunny-3.png`,
  `${BASE}/walk/bunny-4.png`,
  `${BASE}/walk/bunny-5.png`,
  `${BASE}/walk/bunny-6.png`,
  `${BASE}/walk/bunny-7.png`,
  `${BASE}/walk/bunny-8.png`,
];

export const TURN_RIGHT_FRAMES = [
  `${BASE}/turn/bunny-1.png`,
  `${BASE}/turn/bunny-2.png`,
];

export const WALK_RIGHT_FRAMES = [
  `${BASE}/walk-right/bunny-1.png`,
  `${BASE}/walk-right/bunny-2.png`,
  `${BASE}/walk-right/bunny-3.png`,
  `${BASE}/walk-right/bunny-4.png`,
  `${BASE}/walk-right/bunny-5.png`,
  `${BASE}/walk-right/bunny-6.png`,
];

export const WALK_AWAY_FRAMES = [
  `${BASE}/back/bunny-1.png`,
  `${BASE}/back/bunny-2.png`,
  `${BASE}/back/bunny-3.png`,
  `${BASE}/back/bunny-4.png`,
];

export const BUNNY_FRAMES_BY_STATE: Record<BunnyState, string[]> = {
  wave: WAVE_FRAMES,
  'walk-forward': WALK_FORWARD_FRAMES,
  'turn-right': TURN_RIGHT_FRAMES,
  'walk-right': WALK_RIGHT_FRAMES,
  'walk-away': WALK_AWAY_FRAMES,
};

export const BUNNY_IDLE_FRAME = `${BASE}/sample.png?v=3`;
export const BUNNY_GLANCE_FRAME = `${BASE}/glance.png?v=3`;

export const ALL_BUNNY_FRAMES = [
  ...WAVE_FRAMES,
  ...WALK_FORWARD_FRAMES,
  ...TURN_RIGHT_FRAMES,
  ...WALK_RIGHT_FRAMES,
  ...WALK_AWAY_FRAMES,
  BUNNY_IDLE_FRAME,
  BUNNY_GLANCE_FRAME,
];
