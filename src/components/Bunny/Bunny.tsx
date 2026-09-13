import { useEffect, useMemo, useRef } from 'react';
import { gsap } from 'gsap';
import { useBunnyScroll } from '../../hooks/useBunnyScroll';
import BunnyAnimation from './BunnyAnimation';
import { ALL_BUNNY_FRAMES, BUNNY_GLANCE_FRAME, BUNNY_IDLE_FRAME } from './bunnyFrames';
import {
  BUNNY_RECEDE_CONFIG,
  BUNNY_SCROLL_CONFIG,
  DEFAULT_BUNNY_THRESHOLDS,
  getBunnyPositionKeyframes,
  type BunnyPositionKeyframe,
  type BunnyState,
  type BunnyThresholds,
} from './bunny.types';
import './Bunny.css';

function getBunnyTransform(progress: number, frames: BunnyPositionKeyframe[]) {
  let from = frames[0];
  let to = frames[frames.length - 1];

  for (let i = 0; i < frames.length - 1; i += 1) {
    if (progress >= frames[i].progress && progress <= frames[i + 1].progress) {
      from = frames[i];
      to = frames[i + 1];
      break;
    }
  }

  const span = to.progress - from.progress || 1;
  const t = Math.min(1, Math.max(0, (progress - from.progress) / span));

  return {
    xVw: from.xVw + (to.xVw - from.xVw) * t,
    yVh: from.yVh + (to.yVh - from.yVh) * t,
    scale: from.scale + (to.scale - from.scale) * t,
  };
}

function getCaptionOpacity(progress: number, thresholds: BunnyThresholds, direction: 'up' | 'down') {
  if (direction === 'up') return 0;

  const { waveEnd, captionEnd } = thresholds;
  const span = Math.max(0.01, captionEnd - waveEnd);
  const fade = Math.min(0.03, span / 3);

  if (progress <= waveEnd || progress >= captionEnd) return 0;
  if (progress < waveEnd + fade) return (progress - waveEnd) / fade;
  if (progress > captionEnd - fade) return (captionEnd - progress) / fade;
  return 1;
}

function getEndCaptionOpacity(progress: number, thresholds: BunnyThresholds, direction: 'up' | 'down') {
  if (direction === 'up') return 0;

  const { exitStart, exitEnd } = thresholds;
  const fadeStart = exitStart + (exitEnd - exitStart) * 0.55;
  const span = Math.max(0.01, exitEnd - fadeStart);

  if (progress <= fadeStart) return 0;
  return Math.min(1, (progress - fadeStart) / span);
}

const DODGE_SELECTOR = '.intro-stack-list li, [data-bunny-caption-anchor]';
const DODGE_MARGIN = 150;
const DODGE_MAX_PUSH = 60;

function applyDodgeEffect(bunnyRect: DOMRect, isBunnyVisible: boolean, offsets: WeakMap<Element, number>) {
  const bunnyCenterX = bunnyRect.left + bunnyRect.width / 2;
  const bunnyTop = bunnyRect.top - 16;
  const bunnyBottom = bunnyRect.bottom + 16;

  document.querySelectorAll<HTMLElement>(DODGE_SELECTOR).forEach((el) => {
    const rect = el.getBoundingClientRect();
    const prevOffset = offsets.get(el) ?? 0;
    let push = 0;

    if (isBunnyVisible) {
      const naturalLeft = rect.left - prevOffset;
      const naturalRight = rect.right - prevOffset;
      const verticalOverlap = rect.top < bunnyBottom && rect.bottom > bunnyTop;

      if (verticalOverlap) {
        const closestX = Math.max(naturalLeft, Math.min(bunnyCenterX, naturalRight));
        const dist = bunnyCenterX - closestX;
        const absDist = Math.abs(dist);
        if (absDist < DODGE_MARGIN) {
          const elCenterX = (naturalLeft + naturalRight) / 2;
          const direction = bunnyCenterX <= elCenterX ? 1 : -1;
          push = direction * DODGE_MAX_PUSH * (1 - absDist / DODGE_MARGIN);
        }
      }
    }

    if (Math.abs(push - prevOffset) > 0.5) {
      offsets.set(el, push);
      gsap.to(el, { x: push, duration: 0.4, ease: 'power2.out', overwrite: 'auto' });
    }
  });
}

export default function Bunny() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);
  const endCaptionRef = useRef<HTMLDivElement>(null);
  const thresholdsRef = useRef<BunnyThresholds>(DEFAULT_BUNNY_THRESHOLDS);
  const dodgeOffsetsRef = useRef<WeakMap<Element, number>>(new WeakMap());
  const prefersReducedMotion = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  );

  useEffect(() => {
    ALL_BUNNY_FRAMES.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  useEffect(() => {
    if (prefersReducedMotion && wrapperRef.current) {
      gsap.set(wrapperRef.current, { opacity: 1 });
    }
  }, [prefersReducedMotion]);

  const handleProgress = useMemo(() => {
    if (prefersReducedMotion) return undefined;

    return (progress: number, state: BunnyState, direction: 'up' | 'down') => {
      const el = wrapperRef.current;
      if (!el) return;

      const keyframes = getBunnyPositionKeyframes(thresholdsRef.current);
      const { xVw, yVh, scale } = getBunnyTransform(progress, keyframes);
      const isReceding = direction === 'up' && state === 'walk-forward';
      const finalScale = isReceding ? scale * BUNNY_RECEDE_CONFIG.scaleMultiplier : scale;
      const opacity = Math.min(1, Math.max(0, progress / BUNNY_SCROLL_CONFIG.waveEnd));

      applyDodgeEffect(el.getBoundingClientRect(), opacity > 0.4, dodgeOffsetsRef.current);

      gsap.to(el, {
        x: `${xVw}vw`,
        y: `${yVh}vh`,
        scale: finalScale,
        opacity,
        duration: isReceding ? BUNNY_RECEDE_CONFIG.duration : 0.45,
        ease: 'power2.out',
        overwrite: 'auto',
      });

      if (captionRef.current) {
        gsap.to(captionRef.current, {
          opacity: getCaptionOpacity(progress, thresholdsRef.current, direction),
          duration: 0.35,
          ease: 'power1.out',
          overwrite: 'auto',
        });
      }

      if (endCaptionRef.current) {
        gsap.to(endCaptionRef.current, {
          opacity: getEndCaptionOpacity(progress, thresholdsRef.current, direction),
          duration: 0.4,
          ease: 'power1.out',
          overwrite: 'auto',
        });
      }
    };
  }, [prefersReducedMotion]);

  const { state, isScrolling, direction, thresholds } = useBunnyScroll(handleProgress);

  useEffect(() => {
    thresholdsRef.current = thresholds;
  }, [thresholds]);

  const isReceding = direction === 'up' && state === 'walk-forward';
  const effectiveState: BunnyState = isReceding ? 'walk-away' : state;
  const mirrored = direction === 'up' && (state === 'turn-right' || state === 'walk-right');
  const overrideSrc = isScrolling ? undefined : effectiveState === 'walk-away' ? BUNNY_GLANCE_FRAME : BUNNY_IDLE_FRAME;

  return (
    <div className="bunny" ref={wrapperRef} aria-hidden="true">
      <div className="bunny-caption" ref={captionRef}>
        Hi, I&apos;ll accompany you here!
      </div>
      <div className="bunny-caption" ref={endCaptionRef}>
        Hope you didn&apos;t feel alone!
      </div>
      <BunnyAnimation
        state={effectiveState}
        isScrolling={isScrolling}
        reducedMotion={prefersReducedMotion}
        mirrored={mirrored}
        overrideSrc={overrideSrc}
      />
    </div>
  );
}
