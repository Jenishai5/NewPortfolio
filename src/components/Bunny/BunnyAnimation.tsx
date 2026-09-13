import { useEffect, useRef, useState } from 'react';
import { BUNNY_FRAME_INTERVALS_MS, type BunnyState } from './bunny.types';
import { BUNNY_FRAMES_BY_STATE } from './bunnyFrames';

interface BunnyAnimationProps {
  state: BunnyState;
  isScrolling: boolean;
  reducedMotion: boolean;
  mirrored: boolean;
  overrideSrc?: string;
}

export default function BunnyAnimation({
  state,
  isScrolling,
  reducedMotion,
  mirrored,
  overrideSrc,
}: BunnyAnimationProps) {
  const frames = BUNNY_FRAMES_BY_STATE[state];
  const [frameIndex, setFrameIndex] = useState(0);
  const prevStateRef = useRef(state);

  useEffect(() => {
    if (prevStateRef.current !== state) {
      prevStateRef.current = state;
      setFrameIndex(0);
    }
  }, [state]);

  useEffect(() => {
    if (overrideSrc || reducedMotion || frames.length <= 1) return undefined;

    if (!isScrolling) return undefined;

    const id = window.setInterval(() => {
      setFrameIndex((index) => (index + 1) % frames.length);
    }, BUNNY_FRAME_INTERVALS_MS[state]);

    return () => window.clearInterval(id);
  }, [state, isScrolling, reducedMotion, frames.length, overrideSrc]);

  const safeIndex = Math.min(frameIndex, frames.length - 1);
  const src = overrideSrc ?? frames[safeIndex];
  const isMirrored = mirrored && !overrideSrc;

  return (
    <img
      className={isMirrored ? 'bunny-frame bunny-frame--mirrored' : 'bunny-frame'}
      src={src}
      alt=""
      draggable={false}
    />
  );
}
