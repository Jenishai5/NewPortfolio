import { useEffect, useRef, useState } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  buildBunnyThresholds,
  DEFAULT_CAPTION_END,
  DEFAULT_EXIT_WINDOW,
  DEFAULT_TURN_CENTER,
  type BunnyScrollInfo,
  type BunnyState,
  type BunnyThresholds,
} from '../components/Bunny/bunny.types';

const SCROLL_IDLE_DELAY_MS = 150;
const TURN_ANCHOR_SELECTOR = '[data-bunny-turn-anchor]';
const EXIT_TRIGGER_SELECTOR = '.horizontal-projects';
const CAPTION_ANCHOR_SELECTOR = '[data-bunny-caption-anchor]';

function resolveState(progress: number, thresholds: BunnyThresholds): BunnyState {
  if (progress < thresholds.waveEnd) return 'wave';
  if (progress < thresholds.walkForwardEnd) return 'walk-forward';
  if (progress < thresholds.turnRightEnd) return 'turn-right';
  return 'walk-right';
}

function computeProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  if (scrollable <= 0) return 0;
  return Math.min(1, Math.max(0, window.scrollY / scrollable));
}

function computeTurnCenter(): number {
  const el = document.querySelector<HTMLElement>(TURN_ANCHOR_SELECTOR);
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  if (!el || scrollable <= 0) return DEFAULT_TURN_CENTER;

  const rect = el.getBoundingClientRect();
  const elCenterAbs = rect.top + window.scrollY + rect.height / 2;
  const targetScrollY = elCenterAbs - window.innerHeight / 2;
  return targetScrollY / scrollable;
}

function computeCaptionEnd(): number {
  const el = document.querySelector<HTMLElement>(CAPTION_ANCHOR_SELECTOR);
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  if (!el || scrollable <= 0) return DEFAULT_CAPTION_END;

  const rect = el.getBoundingClientRect();
  const elTopAbs = rect.top + window.scrollY;
  const targetScrollY = elTopAbs - window.innerHeight * 0.6;
  return Math.min(1, Math.max(0, targetScrollY / scrollable));
}

function computeExitWindow(): { start: number; end: number } {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  if (scrollable <= 0) return DEFAULT_EXIT_WINDOW;

  const trigger = document.querySelector<HTMLElement>(EXIT_TRIGGER_SELECTOR);
  const st = trigger ? ScrollTrigger.getAll().find((instance) => instance.trigger === trigger) : undefined;
  if (!st) return DEFAULT_EXIT_WINDOW;

  const startScrollY = st.start + (st.end - st.start) * 0.35;
  const endScrollY = st.end;

  return {
    start: Math.min(1, Math.max(0, startScrollY / scrollable)),
    end: Math.min(1, Math.max(0, endScrollY / scrollable)),
  };
}

type BunnyProgressListener = (progress: number, state: BunnyState, direction: 'up' | 'down') => void;

export function useBunnyScroll(onProgress?: BunnyProgressListener): BunnyScrollInfo {
  const [info, setInfo] = useState<BunnyScrollInfo>(() => {
    const thresholds = buildBunnyThresholds(DEFAULT_TURN_CENTER);
    const progress = typeof window === 'undefined' ? 0 : computeProgress();
    return { state: resolveState(progress, thresholds), progress, isScrolling: false, direction: 'down', thresholds };
  });

  const onProgressRef = useRef(onProgress);
  const thresholdsRef = useRef<BunnyThresholds>(buildBunnyThresholds(DEFAULT_TURN_CENTER));
  const lastScrollYRef = useRef(0);
  const tickingRef = useRef(false);
  const idleTimerRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    onProgressRef.current = onProgress;
  }, [onProgress]);

  useEffect(() => {
    lastScrollYRef.current = window.scrollY;

    const sync = (direction: 'up' | 'down', isScrolling: boolean) => {
      const thresholds = thresholdsRef.current;
      const progress = computeProgress();
      const state = resolveState(progress, thresholds);

      onProgressRef.current?.(progress, state, direction);

      setInfo((prev) => {
        if (
          prev.state === state &&
          prev.isScrolling === isScrolling &&
          prev.direction === direction &&
          prev.thresholds === thresholds &&
          Math.abs(prev.progress - progress) < 0.0008
        ) {
          return prev;
        }
        return { state, progress, isScrolling, direction, thresholds };
      });
    };

    const handleFrame = () => {
      tickingRef.current = false;

      const currentY = window.scrollY;
      const direction: 'up' | 'down' = currentY >= lastScrollYRef.current ? 'down' : 'up';
      lastScrollYRef.current = currentY;

      sync(direction, true);

      window.clearTimeout(idleTimerRef.current);
      idleTimerRef.current = window.setTimeout(() => {
        setInfo((prev) => (prev.isScrolling ? { ...prev, isScrolling: false } : prev));
      }, SCROLL_IDLE_DELAY_MS);
    };

    const handleScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;
      requestAnimationFrame(handleFrame);
    };

    const measure = () => {
      thresholdsRef.current = buildBunnyThresholds(computeTurnCenter(), computeExitWindow(), computeCaptionEnd());
      sync('down', false);
    };

    measure();
    const settleTimer = window.setTimeout(measure, 500);

    let contentResizeTimer: number | undefined;
    const scheduleMeasure = () => {
      window.clearTimeout(contentResizeTimer);
      contentResizeTimer = window.setTimeout(measure, 150);
    };
    const contentObserver = new ResizeObserver(scheduleMeasure);
    contentObserver.observe(document.body);

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', measure, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', measure);
      contentObserver.disconnect();
      window.clearTimeout(idleTimerRef.current);
      window.clearTimeout(settleTimer);
      window.clearTimeout(contentResizeTimer);
    };
  }, []);

  return info;
}
