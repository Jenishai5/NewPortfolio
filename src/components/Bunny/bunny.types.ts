export type BunnyState = 'wave' | 'walk-forward' | 'turn-right' | 'walk-right' | 'walk-away';

export interface BunnyThresholds {
  waveEnd: number;
  walkForwardEnd: number;
  turnRightEnd: number;
  exitStart: number;
  exitEnd: number;
  captionEnd: number;
}

export interface BunnyScrollInfo {
  state: BunnyState;
  progress: number;
  isScrolling: boolean;
  direction: 'up' | 'down';
  thresholds: BunnyThresholds;
}

export const BUNNY_SCROLL_CONFIG = {
  waveEnd: 0.05,
} as const;

export const TURN_WINDOW = 0.02;
export const DEFAULT_TURN_CENTER = 0.4;
export const DEFAULT_EXIT_WINDOW = { start: 0.78, end: 0.9 };
export const DEFAULT_CAPTION_END = 0.22;

export function buildBunnyThresholds(
  turnCenter: number,
  exitWindow: { start: number; end: number } = DEFAULT_EXIT_WINDOW,
  captionEnd: number = DEFAULT_CAPTION_END,
): BunnyThresholds {
  const safeCenter = Math.min(0.92, Math.max(BUNNY_SCROLL_CONFIG.waveEnd + 0.12, turnCenter));
  const turnRightEnd = Math.min(0.96, safeCenter + TURN_WINDOW);
  const safeExitStart = Math.max(turnRightEnd + 0.02, exitWindow.start);
  const safeExitEnd = Math.max(safeExitStart + 0.03, exitWindow.end);
  const walkForwardEnd = safeCenter - TURN_WINDOW;
  const minCaptionEnd = BUNNY_SCROLL_CONFIG.waveEnd + 0.05;
  const maxCaptionEnd = Math.max(minCaptionEnd, walkForwardEnd - 0.02);
  const safeCaptionEnd = Math.min(maxCaptionEnd, Math.max(minCaptionEnd, captionEnd));
  return {
    waveEnd: BUNNY_SCROLL_CONFIG.waveEnd,
    walkForwardEnd,
    turnRightEnd,
    exitStart: Math.min(0.97, safeExitStart),
    exitEnd: Math.min(1, safeExitEnd),
    captionEnd: safeCaptionEnd,
  };
}

export const DEFAULT_BUNNY_THRESHOLDS = buildBunnyThresholds(DEFAULT_TURN_CENTER);

export interface BunnyPositionKeyframe {
  progress: number;
  xVw: number;
  yVh: number;
  scale: number;
}

export const BUNNY_CENTER_POSITION = { xVw: 40, yVh: -16 } as const;

export function getBunnyPositionKeyframes(thresholds: BunnyThresholds): BunnyPositionKeyframe[] {
  return [
    { progress: 0, xVw: BUNNY_CENTER_POSITION.xVw, yVh: BUNNY_CENTER_POSITION.yVh, scale: 1 },
    { progress: thresholds.waveEnd, xVw: BUNNY_CENTER_POSITION.xVw, yVh: BUNNY_CENTER_POSITION.yVh, scale: 1 },
    { progress: thresholds.walkForwardEnd, xVw: 0, yVh: 0, scale: 1.15 },
    { progress: thresholds.turnRightEnd, xVw: 0, yVh: 0, scale: 1.15 },
    { progress: thresholds.exitStart, xVw: 0, yVh: 0, scale: 1.15 },
    { progress: thresholds.exitEnd, xVw: BUNNY_CENTER_POSITION.xVw, yVh: 0, scale: 1.55 },
    { progress: 1, xVw: BUNNY_CENTER_POSITION.xVw, yVh: 0, scale: 1.55 },
  ];
}

export const BUNNY_FRAME_INTERVALS_MS: Record<BunnyState, number> = {
  wave: 550,
  'walk-forward': 120,
  'turn-right': 160,
  'walk-right': 120,
  'walk-away': 260,
};

export const BUNNY_RECEDE_CONFIG = {
  scaleMultiplier: 0.93,
  duration: 0.5,
};
